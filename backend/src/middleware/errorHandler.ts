import type { Request, Response, NextFunction } from 'express';
import { AppError } from '../types/index.js';

interface ErrorResponse {
    error: {
        message: string;
        code?: string;
        statusCode: number;
    };
}

export const errorHandler = (
    err: Error,
    _req: Request,
    res: Response<ErrorResponse>,
    _next: NextFunction
): void => {
    console.error('❌ Error:', err.message);

    // Handle our custom AppError
    if (err instanceof AppError) {
        res.status(err.statusCode).json({
            error: {
                message: err.message,
                code: err.code,
                statusCode: err.statusCode
            }
        });
        return;
    }

    // Handle PostgreSQL unique constraint violation
    if ('code' in err && err.code === '23505') {
        res.status(409).json({
            error: {
                message: 'Resource already exists',
                code: 'DUPLICATE',
                statusCode: 409
            }
        });
        return;
    }

    // Handle PostgreSQL foreign key violation
    if ('code' in err && err.code === '23503') {
        res.status(400).json({
            error: {
                message: 'Referenced resource does not exist',
                code: 'FOREIGN_KEY_VIOLATION',
                statusCode: 400
            }
        });
        return;
    }

    // Generic server error
    res.status(500).json({
        error: {
            message: 'Internal server error',
            code: 'INTERNAL_ERROR',
            statusCode: 500
        }
    });
};
