import { User } from '../domain/User.js';
import { DatabaseManager } from '../database/DatabaseManager.js';

export interface IUserRepository {
    findById(id: number): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    findByMobile(mobile: string): Promise<User | null>;
    save(user: User): Promise<User>;
    getFriends(userId: number): Promise<{ id: number; name: string; email: string; mobileNumber: string }[]>;
}

export class PostgresUserRepository implements IUserRepository {
    private db: DatabaseManager;

    constructor() {
        this.db = DatabaseManager.getInstance();
    }

    private rowToUser(row: any): User {
        return new User(row.name, row.password_hash, row.email, row.mobile_number, row.id);
    }

    async findById(id: number): Promise<User | null> {
        const result = await this.db.query('SELECT * FROM users WHERE id = $1', [id]);
        if (result.rows.length === 0) return null;
        return this.rowToUser(result.rows[0]);
    }

    async findByEmail(email: string): Promise<User | null> {
        const result = await this.db.query('SELECT * FROM users WHERE email = $1', [email]);
        if (result.rows.length === 0) return null;
        return this.rowToUser(result.rows[0]);
    }

    async findByMobile(mobile: string): Promise<User | null> {
        const result = await this.db.query('SELECT * FROM users WHERE mobile_number = $1', [mobile]);
        if (result.rows.length === 0) return null;
        return this.rowToUser(result.rows[0]);
    }

    async save(user: User): Promise<User> {
        const passwordHash = (user as any).passwordHash;
        if (user.getId()) {
            await this.db.query(
                'UPDATE users SET name = $1, email = $2, mobile_number = $3, password_hash = $4 WHERE id = $5',
                [user.getName(), user.getEmail(), user.getMobileNumber(), passwordHash, user.getId()]
            );
            return user;
        } else {
            const result = await this.db.query(
                'INSERT INTO users (name, email, mobile_number, password_hash) VALUES ($1, $2, $3, $4) RETURNING id',
                [user.getName(), user.getEmail(), user.getMobileNumber(), passwordHash]
            );
            return new User(user.getName(), passwordHash, user.getEmail(), user.getMobileNumber(), result.rows[0].id);
        }
    }

    async getFriends(userId: number): Promise<{ id: number; name: string; email: string; mobileNumber: string; balance: number }[]> {
        // Get distinct friends, then for each calculate net balance:
        //   positive = they owe you, negative = you owe them
        //   Factor in completed settlements (status = 'SETTLED')
        const query = `
            SELECT
                u.id, u.name, u.email, u.mobile_number,
                COALESCE(they_owe.total, 0) - COALESCE(i_owe.total, 0)
                - COALESCE(they_settled.total, 0) + COALESCE(i_settled.total, 0) AS balance
            FROM users u
            JOIN user_groups ug ON u.id = ug.user_id
            LEFT JOIN LATERAL (
                -- Amount friend owes me: I paid, they have a split
                SELECT SUM(es.amount) AS total
                FROM expense_splits es
                JOIN expenses e ON es.expense_id = e.id
                WHERE e.payer_id = $1 AND es.user_id = u.id
            ) they_owe ON true
            LEFT JOIN LATERAL (
                -- Amount I owe friend: They paid, I have a split
                SELECT SUM(es.amount) AS total
                FROM expense_splits es
                JOIN expenses e ON es.expense_id = e.id
                WHERE e.payer_id = u.id AND es.user_id = $1
            ) i_owe ON true
            LEFT JOIN LATERAL (
                -- Settlements: friend paid me (reduces what they owe me)
                SELECT SUM(s.amount) AS total
                FROM settlements s
                WHERE s.payer_id = u.id AND s.payee_id = $1 AND s.status = 'SETTLED'
            ) they_settled ON true
            LEFT JOIN LATERAL (
                -- Settlements: I paid friend (reduces what I owe them)
                SELECT SUM(s.amount) AS total
                FROM settlements s
                WHERE s.payer_id = $1 AND s.payee_id = u.id AND s.status = 'SETTLED'
            ) i_settled ON true
            WHERE ug.group_id IN (
                SELECT group_id FROM user_groups WHERE user_id = $1
            ) AND u.id != $1
            GROUP BY u.id, u.name, u.email, u.mobile_number, they_owe.total, i_owe.total, they_settled.total, i_settled.total
        `;
        const result = await this.db.query(query, [userId]);
        return result.rows.map((row: any) => ({
            id: row.id,
            name: row.name,
            email: row.email,
            mobileNumber: row.mobile_number,
            balance: parseFloat(row.balance) || 0
        }));
    }
}
