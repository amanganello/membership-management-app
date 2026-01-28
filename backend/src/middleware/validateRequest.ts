import type { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { AppError } from '../types/index.js';

// Zod validation middleware factory
export const validate = (schema: z.ZodSchema) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        try {
            schema.parse(req.body);
            next();
        } catch (error) {
            if (error instanceof z.ZodError) {
                const messages = error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
                next(new AppError(400, messages, 'VALIDATION_ERROR'));
                return;
            }
            next(error);
        }
    };
};

// Validate URL params
export const validateParams = (schema: z.ZodSchema) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        try {
            schema.parse(req.params);
            next();
        } catch (error) {
            if (error instanceof z.ZodError) {
                const messages = error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
                next(new AppError(400, messages, 'VALIDATION_ERROR'));
                return;
            }
            next(error);
        }
    };
};
