import express, { type Request } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { pinoHttp } from 'pino-http';
import routes from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.js';
import { requestIdMiddleware } from './middleware/requestId.js';
import logger from './lib/logger.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(requestIdMiddleware);
app.use(pinoHttp({
    logger,
    genReqId: (req: Request) => req.id,
}));
app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api', routes);

app.use(errorHandler);

app.listen(PORT, () => {
    logger.info({ port: PORT }, 'Server started');
});

export default app;
