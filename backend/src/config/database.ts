import pg from 'pg';
import dotenv from 'dotenv';
import logger from '../lib/logger.js';

dotenv.config();

const { Pool } = pg;

export const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

// Test connection on startup
pool.on('connect', () => {
    logger.info('Database connected');
});

pool.on('error', (err) => {
    logger.error({ err }, 'Database pool error');
});

export default pool;
