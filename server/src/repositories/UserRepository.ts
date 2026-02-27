import { User } from '../domain/User.js';
import { DatabaseManager } from '../database/DatabaseManager.js';

export interface IUserRepository {
    findById(id: number): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    findByMobile(mobile: string): Promise<User | null>;
    save(user: User): Promise<User>;
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
}
