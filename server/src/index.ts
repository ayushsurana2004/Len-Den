import "reflect-metadata"; // Required for TypeORM
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env.js';
import { Logger } from './utils/Logger.js';
import apiRouter from './routes/api.js';


const logger = Logger.getInstance();
const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', apiRouter);
app.get('/', (req, res) => {
    res.send(`Server is running on ${env.NODE_ENV} environment`);
});
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        environment: env.NODE_ENV
    });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    logger.error('Unhandled error', err);
    res.status(500).json({ message: 'Internal Server Error' });
});

// --- VERCEL SPECIFIC LOGIC ---
// Only start the standalone server if we are NOT on Vercel
if (env.NODE_ENV !== 'production') {
    const PORT = env.PORT || 5000;
    app.listen(PORT, () => {
        logger.log(`Server running locally on port ${PORT}`);
    });
}

// Export the app for Vercel's serverless handler
export default app;
