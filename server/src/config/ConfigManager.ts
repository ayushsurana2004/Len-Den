import dotenv from 'dotenv';

dotenv.config();

export class ConfigManager {
    private static instance: ConfigManager;
    private readonly config: Record<string, string | undefined>;

    private constructor() {
        this.config = {
            PORT: process.env.PORT,
            DB_URL: process.env.DB_URL,
            JWT_SECRET: process.env.JWT_SECRET,
            APP_KEY: process.env.APP_KEY,
            APP_URL: process.env.APP_URL,
        };

        this.validate();
    }

    public static getInstance(): ConfigManager {
        if (!ConfigManager.instance) {
            ConfigManager.instance = new ConfigManager();
        }
        return ConfigManager.instance;
    }

    public get(key: string): string {
        const value = this.config[key];
        if (!value) {
            throw new Error(`Configuration key "${key}" is missing.`);
        }
        return value;
    }

    private validate() {
        const requiredKeys = ['PORT', 'DB_URL', 'JWT_SECRET', 'APP_KEY', 'APP_URL'];
        for (const key of requiredKeys) {
            if (!this.config[key]) {
                throw new Error(`Missing required environment variable: ${key}`);
            }
        }
    }
}
