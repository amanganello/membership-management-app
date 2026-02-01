import pool from '../config/database.js';
import type { Plan } from '../types/index.js';

export const planRepository = {
    async findAll(): Promise<Plan[]> {
        const result = await pool.query(
            `SELECT id, name, monthly_cost as "monthlyCost", 
                    duration_value as "durationValue", duration_unit as "durationUnit",
                    created_at as "createdAt", updated_at as "updatedAt"
       FROM plans 
       ORDER BY monthly_cost`
        );
        return result.rows as Plan[];
    },

    async findById(id: string): Promise<Plan | null> {
        const result = await pool.query(
            `SELECT id, name, monthly_cost as "monthlyCost", 
                    duration_value as "durationValue", duration_unit as "durationUnit",
                    created_at as "createdAt", updated_at as "updatedAt"
       FROM plans 
       WHERE id = $1`,
            [id]
        );
        return (result.rows[0] as Plan) ?? null;
    },

    async exists(id: string): Promise<boolean> {
        const result = await pool.query(
            `SELECT 1 FROM plans WHERE id = $1`,
            [id]
        );
        return result.rowCount !== null && result.rowCount > 0;
    }
};
