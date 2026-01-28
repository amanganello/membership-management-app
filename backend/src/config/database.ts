import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

export const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

// Test connection on startup
pool.on('connect', () => {
    console.log('📦 Database connected');
});

pool.on('error', (err) => {
    console.error('❌ Database error:', err.message);
});

export default pool;
