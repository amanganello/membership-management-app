import { randomUUID } from 'crypto';
import type { Request, Response, NextFunction } from 'express';

// Extend Express Request type
declare global {
    namespace Express {
        interface Request {
            id: string;
        }
    }
}

/**
 * Middleware to attach a unique request ID for tracing
 */
export const requestIdMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    // Use existing header or generate new UUID
    req.id = (req.headers['x-request-id'] as string) ?? randomUUID();
    res.setHeader('x-request-id', req.id);
    next();
};
