import pg from 'pg';
import dotenv from 'dotenv';
import logger from '../lib/logger.js';

dotenv.config();

const { Pool } = pg;

export const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
    statement_timeout: 10000,
});

// Test connection on startup
pool.on('connect', () => {
    logger.info('Database connected');
});

pool.on('error', (err) => {
    logger.error({ err }, 'Database pool error');
});

export default pool;
