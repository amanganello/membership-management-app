import pino from 'pino';

const isDevelopment = process.env.NODE_ENV !== 'production';

export const logger = pino({
    level: process.env.LOG_LEVEL ?? 'info',
    transport: isDevelopment
        ? {
            target: 'pino-pretty',
            options: {
                colorize: true,
                translateTime: 'HH:MM:ss',
                ignore: 'pid,hostname',
            },
        }
        : undefined,
    // Redact sensitive fields (PII)
    redact: {
        paths: [
            'req.headers.authorization',
            'req.body.password',
            'req.body.email', // Optionally redact in logs
            '*.password',
            '*.token',
        ],
        censor: '[REDACTED]',
    },
});

export default logger;
