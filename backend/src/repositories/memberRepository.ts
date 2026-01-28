import pool from '../config/database.js';
import type { Member, CreateMemberDto } from '../types/index.js';

export const memberRepository = {
    async create(data: CreateMemberDto): Promise<Member> {
        const result = await pool.query(
            `INSERT INTO members (name, email) 
       VALUES ($1, $2) 
       RETURNING id, name, email, join_date as "joinDate", created_at as "createdAt", updated_at as "updatedAt"`,
            [data.name, data.email]
        );
        return result.rows[0] as Member;
    },

    async findAll(): Promise<Member[]> {
        const result = await pool.query(
            `SELECT id, name, email, join_date as "joinDate", created_at as "createdAt", updated_at as "updatedAt"
       FROM members 
       ORDER BY name`
        );
        return result.rows as Member[];
    },

    async search(query: string): Promise<Member[]> {
        const searchPattern = `%${query}%`;
        const result = await pool.query(
            `SELECT id, name, email, join_date as "joinDate", created_at as "createdAt", updated_at as "updatedAt"
       FROM members 
       WHERE name ILIKE $1 OR email ILIKE $1
       ORDER BY name`,
            [searchPattern]
        );
        return result.rows as Member[];
    },

    async findById(id: string): Promise<Member | null> {
        const result = await pool.query(
            `SELECT id, name, email, join_date as "joinDate", created_at as "createdAt", updated_at as "updatedAt"
       FROM members 
       WHERE id = $1`,
            [id]
        );
        return (result.rows[0] as Member) ?? null;
    },

    async exists(id: string): Promise<boolean> {
        const result = await pool.query(
            `SELECT 1 FROM members WHERE id = $1`,
            [id]
        );
        return result.rowCount !== null && result.rowCount > 0;
    },

    async emailExists(email: string): Promise<boolean> {
        const result = await pool.query(
            `SELECT 1 FROM members WHERE email = $1`,
            [email]
        );
        return result.rowCount !== null && result.rowCount > 0;
    }
};
