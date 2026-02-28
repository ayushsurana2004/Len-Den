import { Pool } from 'pg';
import { env } from '../config/env.js';
import { Logger } from '../utils/Logger.js';
export class DatabaseManager {
    static instance;
    pool;
    logger;
    constructor() {
        this.logger = Logger.getInstance();
        this.pool = new Pool({
            connectionString: env.DB_URL,
        });
        this.pool.on('error', (err) => {
            this.logger.error('Unexpected error on idle client', err);
            process.exit(-1);
        });
    }
    static getInstance() {
        if (!DatabaseManager.instance) {
            DatabaseManager.instance = new DatabaseManager();
        }
        return DatabaseManager.instance;
    }
    async query(text, params) {
        const start = Date.now();
        const res = await this.pool.query(text, params);
        const duration = Date.now() - start;
        this.logger.log(`executed query: ${text} | duration: ${duration}ms`);
        return res;
    }
    async getClient() {
        return await this.pool.connect();
    }
}
//# sourceMappingURL=DatabaseManager.js.map