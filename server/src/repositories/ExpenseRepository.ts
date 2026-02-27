import { Expense } from '../domain/Expense.js';
import { DatabaseManager } from '../database/DatabaseManager.js';

export interface IExpenseRepository {
    save(expense: Expense, splits: { userId: number, amount: number }[]): Promise<void>;
    findByGroupId(groupId: number): Promise<Expense[]>;
    findByUserId(userId: number, groupId?: number | null): Promise<any[]>;
}

export class PostgresExpenseRepository implements IExpenseRepository {
    private db: DatabaseManager;

    constructor() {
        this.db = DatabaseManager.getInstance();
    }

    async save(expense: Expense, splits: { userId: number, amount: number }[]): Promise<void> {
        const client = await this.db.getClient();
        try {
            await client.query('BEGIN');

            const expenseResult = await client.query(
                'INSERT INTO expenses (description, amount, payer_id, group_id, split_type) VALUES ($1, $2, $3, $4, $5) RETURNING id',
                [expense.getDescription(), expense.getAmount(), expense.getPayerId(), expense.getGroupId(), expense.getSplitType()]
            );

            const expenseId = expenseResult.rows[0].id;

            for (const split of splits) {
                await client.query(
                    'INSERT INTO expense_splits (expense_id, user_id, amount) VALUES ($1, $2, $3)',
                    [expenseId, split.userId, split.amount]
                );
            }

            await client.query('COMMIT');
        } catch (e) {
            await client.query('ROLLBACK');
            throw e;
        } finally {
            client.release();
        }
    }

    async findByGroupId(groupId: number): Promise<Expense[]> {
        // Implementation for retrieving expenses by group
        // This would require a factory to recreate the strategy based on the stored split_type
        return [];
    }

    async findByUserId(userId: number, groupId?: number | null): Promise<any[]> {
        let query = `
            SELECT e.*, 
                   s.amount as user_share,
                   CASE WHEN e.payer_id = $1 THEN 'PAID' ELSE 'OWED' END as user_role
            FROM expenses e
            JOIN expense_splits s ON e.id = s.expense_id
            WHERE s.user_id = $1
        `;

        const params: any[] = [userId];

        if (groupId) {
            query += ` AND e.group_id = $2`;
            params.push(groupId);
        }

        query += ` ORDER BY e.created_at DESC LIMIT 20`;

        const result = await this.db.query(query, params);
        return result.rows;
    }
}
