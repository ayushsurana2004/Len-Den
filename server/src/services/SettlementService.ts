import { SettlementContext, KeyGeneratedState } from '../domain/SettlementState.js';
import { DatabaseManager } from '../database/DatabaseManager.js';

export class SettlementService {
    private db: DatabaseManager;

    constructor() {
        this.db = DatabaseManager.getInstance();
    }

    public async initiateSettlement(payerId: number, payeeId: number, amount: number): Promise<string> {
        const result = await this.db.query(
            'INSERT INTO settlements (payer_id, payee_id, amount, status) VALUES ($1, $2, $3, $4) RETURNING id',
            [payerId, payeeId, amount, 'PENDING']
        );
        const id = result.rows[0].id;

        const context = new SettlementContext(id);
        context.generateKey();
        const key = context.getKey()!;

        await this.db.query(
            'UPDATE settlements SET settlement_key = $1, status = $2 WHERE id = $3',
            [key, context.getStatus(), id]
        );

        return key;
    }

    public async getBalanceSummary(userId: number, groupId?: number | null) {
        // Total you are owed = SUM(splits for others on your payments) - Settlements you received
        // Total you owe = SUM(your splits on others' payments) - Settlements you paid

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

        const params: any[] = [userId];
        if (groupId) {
            owedQuery += ` AND e.group_id = $2`;
            oweQuery += ` AND e.group_id = $2`;
            params.push(groupId);
        }

        // Note: For a real app, we'd also include settled amounts.
        // For simplicity in this demo, we'll just use these.

        const [owedRes, oweRes] = await Promise.all([
            this.db.query(owedQuery, params),
            this.db.query(oweQuery, params)
        ]);

        const ota = parseFloat(owedRes.rows[0].total);
        const yo = parseFloat(oweRes.rows[0].total);

        return {
            totalBalance: ota - yo,
            youOwe: yo,
            youAreOwed: ota
        };
    }

    public async confirmSettlement(settlementId: number, key: string): Promise<boolean> {
        const result = await this.db.query('SELECT * FROM settlements WHERE id = $1', [settlementId]);
        if (result.rows.length === 0) throw new Error("Settlement not found");

        const row = result.rows[0];
        const context = new SettlementContext(settlementId);

        if (row.status === 'KEY_GENERATED') {
            context.setKey(row.settlement_key);
            context.setState(new KeyGeneratedState(context));
        } else if (row.status === 'SETTLED') {
            throw new Error("Settlement already completed.");
        } else {
            throw new Error(`Cannot confirm settlement in status: ${row.status}`);
        }

        context.confirmSettlement(key);

        await this.db.query(
            'UPDATE settlements SET status = $1 WHERE id = $2',
            [context.getStatus(), settlementId]
        );

        return true;
    }
}
