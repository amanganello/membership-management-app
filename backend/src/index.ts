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

// Disable ETag so API responses are not conditional (avoids 304 Not Modified)
app.set('etag', false);

app.use(requestIdMiddleware);
app.use(pinoHttp({
    logger,
    genReqId: (req: Request) => req.id,
}));
app.use(cors());
app.use(express.json());

// Prevent browsers and proxies from caching API responses (avoids 304)
app.use('/api', (_req, res, next) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    next();
});

app.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api', routes);

app.use(errorHandler);

app.listen(PORT, () => {
    logger.info({ port: PORT }, 'Server started');
});

export default app;
