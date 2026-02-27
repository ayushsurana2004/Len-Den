import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { ConfigManager } from './config/ConfigManager.js';
import { Logger } from './utils/Logger.js';
import apiRouter from './routes/api.js';

const config = ConfigManager.getInstance();
const logger = Logger.getInstance();
const app = express();

app.use((helmet as any)());
app.use((cors as any)());
app.use(express.json());

app.use('/api', apiRouter);

app.get('/health', (req, res) => {
    res.json({ status: 'OK' });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    logger.error('Unhandled error', err);
    res.status(500).json({ message: 'Internal Server Error' });
});

const PORT = config.get('PORT');
app.listen(PORT, () => {
    logger.log(`Server running on port ${PORT}`);
});
