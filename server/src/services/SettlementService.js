import { SettlementContext, KeyGeneratedState } from '../domain/SettlementState.js';
import { DatabaseManager } from '../database/DatabaseManager.js';
import { GroupService } from './GroupService.js';
export class SettlementService {
    db;
    groupService;
    constructor() {
        this.db = DatabaseManager.getInstance();
        this.groupService = new GroupService();
    }
    async initiateSettlement(payerId, payeeId, amount) {
        const result = await this.db.query('INSERT INTO settlements (payer_id, payee_id, amount, status) VALUES ($1, $2, $3, $4) RETURNING id', [payerId, payeeId, amount, 'PENDING']);
        const id = result.rows[0].id;
        const context = new SettlementContext(id);
        context.generateKey();
        const key = context.getKey();
        await this.db.query('UPDATE settlements SET settlement_key = $1, status = $2 WHERE id = $3', [key, context.getStatus(), id]);
        return { id, key };
    }
    async getBalanceSummary(userId, groupId) {
        let owedQuery = `
            SELECT COALESCE(SUM(s.amount), 0) as total
            FROM expense_splits s
            JOIN expenses e ON s.expense_id = e.id
            WHERE e.payer_id = $1 AND s.user_id != $1
        `;
        let oweQuery = `
            SELECT COALESCE(SUM(s.amount), 0) as total
            FROM expense_splits s
            JOIN expenses e ON s.expense_id = e.id
            WHERE s.user_id = $1 AND e.payer_id != $1
        `;
        // Settlements I received (others paid me — reduces what they owe me)
        let settledReceivedQuery = `
            SELECT COALESCE(SUM(amount), 0) as total
            FROM settlements
            WHERE payee_id = $1 AND status = 'SETTLED'
        `;
        // Settlements I paid (I paid others — reduces what I owe)
        let settledPaidQuery = `
            SELECT COALESCE(SUM(amount), 0) as total
            FROM settlements
            WHERE payer_id = $1 AND status = 'SETTLED'
        `;
        const params = [userId];
        if (groupId) {
            owedQuery += ` AND e.group_id = $2`;
            oweQuery += ` AND e.group_id = $2`;
            params.push(groupId);
        }
        const [owedRes, oweRes, receivedRes, paidRes] = await Promise.all([
            this.db.query(owedQuery, params),
            this.db.query(oweQuery, params),
            this.db.query(settledReceivedQuery, [userId]),
            this.db.query(settledPaidQuery, [userId])
        ]);
        const ota = parseFloat(owedRes.rows[0].total);
        const yo = parseFloat(oweRes.rows[0].total);
        const received = parseFloat(receivedRes.rows[0].total);
        const paid = parseFloat(paidRes.rows[0].total);
        return {
            totalBalance: (ota - received) - (yo - paid),
            youOwe: Math.max(0, yo - paid),
            youAreOwed: Math.max(0, ota - received)
        };
    }
    async confirmSettlement(settlementId, key) {
        const client = await this.db.getClient();
        try {
            await client.query('BEGIN');
            const result = await client.query('SELECT * FROM settlements WHERE id = $1', [settlementId]);
            if (result.rows.length === 0)
                throw new Error("Settlement not found");
            const row = result.rows[0];
            if (row.status === 'SETTLED') {
                throw new Error("Settlement already completed.");
            }
            // Step 1: Validate the user-provided key against the payee's per-group settlement key
            const groupKeyCheck = await client.query(`SELECT ug.settlement_key, ug.group_id FROM user_groups ug
                 WHERE ug.user_id = $1
                 AND ug.settlement_key = $2
                 AND ug.group_id IN (SELECT group_id FROM user_groups WHERE user_id = $3)
                 LIMIT 1`, [row.payee_id, key, row.payer_id]);
            if (groupKeyCheck.rows.length === 0) {
                throw new Error("Invalid Settlement Key. Ask the payee for their correct key.");
            }
            const matchedGroupId = groupKeyCheck.rows[0].group_id;
            // Step 2: Use the State pattern to transition the settlement to SETTLED
            const context = new SettlementContext(settlementId);
            if (row.status === 'KEY_GENERATED') {
                context.setKey(row.settlement_key);
                context.setState(new KeyGeneratedState(context));
                context.confirmSettlement(row.settlement_key);
            }
            else {
                throw new Error(`Cannot confirm settlement in status: ${row.status}`);
            }
            await client.query('UPDATE settlements SET status = $1 WHERE id = $2', [context.getStatus(), settlementId]);
            // Step 3: Key Rotation — regenerate payee's settlement key
            const newKey = await this.groupService.rotateMemberKey(matchedGroupId, row.payee_id, client);
            await client.query('COMMIT');
            return { success: true, newKey };
        }
        catch (error) {
            await client.query('ROLLBACK');
            throw error;
        }
        finally {
            client.release();
        }
    }
    async getSimplifiedDebts(groupId) {
        // Step 1: Get all group members
        const membersRes = await this.db.query(`SELECT u.id, u.name FROM users u
             JOIN user_groups ug ON u.id = ug.user_id
             WHERE ug.group_id = $1`, [groupId]);
        const members = membersRes.rows;
        // Step 2: Calculate net balance for each member within this group
        //   net > 0 = creditor (others owe them)
        //   net < 0 = debtor (they owe others)
        const netBalances = new Map();
        members.forEach((m) => netBalances.set(m.id, 0));
        // Get all expense splits in this group
        const splitsRes = await this.db.query(`SELECT e.payer_id, es.user_id, es.amount
             FROM expense_splits es
             JOIN expenses e ON es.expense_id = e.id
             WHERE e.group_id = $1`, [groupId]);
        splitsRes.rows.forEach((row) => {
            const payerId = row.payer_id;
            const userId = row.user_id;
            const amt = parseFloat(row.amount);
            if (payerId !== userId) {
                // payer is owed this amount
                netBalances.set(payerId, (netBalances.get(payerId) || 0) + amt);
                // user owes this amount
                netBalances.set(userId, (netBalances.get(userId) || 0) - amt);
            }
        });
        // Factor in completed settlements
        const settlementsRes = await this.db.query(`SELECT s.payer_id, s.payee_id, s.amount
             FROM settlements s
             WHERE s.status = 'SETTLED'
             AND (s.payer_id IN (SELECT user_id FROM user_groups WHERE group_id = $1)
                  AND s.payee_id IN (SELECT user_id FROM user_groups WHERE group_id = $1))`, [groupId]);
        settlementsRes.rows.forEach((row) => {
            const payerId = row.payer_id;
            const payeeId = row.payee_id;
            const amt = parseFloat(row.amount);
            // Payer paid money — reduces their debt (increases net)
            netBalances.set(payerId, (netBalances.get(payerId) || 0) + amt);
            // Payee received money — reduces their credit (decreases net)
            netBalances.set(payeeId, (netBalances.get(payeeId) || 0) - amt);
        });
        // Step 3: Separate into debtors and creditors
        const debtors = [];
        const creditors = [];
        members.forEach((m) => {
            const net = parseFloat((netBalances.get(m.id) || 0).toFixed(2));
            if (net < -0.01) {
                debtors.push({ id: m.id, name: m.name, amount: Math.abs(net) });
            }
            else if (net > 0.01) {
                creditors.push({ id: m.id, name: m.name, amount: net });
            }
        });
        // Step 4: Greedy algorithm to simplify debts
        const result = [];
        let i = 0, j = 0;
        // Sort for deterministic results
        debtors.sort((a, b) => b.amount - a.amount);
        creditors.sort((a, b) => b.amount - a.amount);
        while (i < debtors.length && j < creditors.length) {
            const debtAmt = debtors[i].amount;
            const creditAmt = creditors[j].amount;
            const transfer = parseFloat(Math.min(debtAmt, creditAmt).toFixed(2));
            if (transfer > 0.01) {
                result.push({
                    from: { id: debtors[i].id, name: debtors[i].name },
                    to: { id: creditors[j].id, name: creditors[j].name },
                    amount: transfer
                });
            }
            debtors[i].amount = parseFloat((debtAmt - transfer).toFixed(2));
            creditors[j].amount = parseFloat((creditAmt - transfer).toFixed(2));
            if (debtors[i].amount < 0.01)
                i++;
            if (creditors[j].amount < 0.01)
                j++;
        }
        return result;
    }
}
//# sourceMappingURL=SettlementService.js.map