import dotenv from 'dotenv';
dotenv.config();

export const env = {
    PORT: process.env.PORT || '5050',
    DB_URL: process.env.DB_URL || '',
    JWT_SECRET: process.env.JWT_SECRET || 'LenDen',
    APP_KEY: process.env.APP_KEY || 'LenDen',
    APP_URL: process.env.APP_URL || 'http://localhost:5173',
    NODE_ENV: process.env.NODE_ENV || 'development'
};

// Simple validation to ensure critical variables are present
const requiredKeys = ['DB_URL', 'JWT_SECRET', 'APP_KEY'] as const;
for (const key of requiredKeys) {
    if (!env[key]) {
        console.warn(`[WARNING] Missing environment variable: ${key}. Some features may not work correctly.`);
    }
}
