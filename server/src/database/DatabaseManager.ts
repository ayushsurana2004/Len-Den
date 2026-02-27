import { Pool } from 'pg';
import { ConfigManager } from '../config/ConfigManager.js';
import { Logger } from '../utils/Logger.js';

export class DatabaseManager {
    private static instance: DatabaseManager;
    private pool: Pool;
    private logger: Logger;

    private constructor() {
        this.logger = Logger.getInstance();
        const config = ConfigManager.getInstance();

        this.pool = new Pool({
            connectionString: config.get('DB_URL'),
        });

        this.pool.on('error', (err) => {
            this.logger.error('Unexpected error on idle client', err);
            process.exit(-1);
        });
    }

    public static getInstance(): DatabaseManager {
        if (!DatabaseManager.instance) {
            DatabaseManager.instance = new DatabaseManager();
        }
        return DatabaseManager.instance;
    }

    public async query(text: string, params?: any[]) {
        const start = Date.now();
        const res = await this.pool.query(text, params);
        const duration = Date.now() - start;
        this.logger.log(`executed query: ${text} | duration: ${duration}ms`);
        return res;
    }

    public async getClient() {
        return await this.pool.connect();
    }
}
