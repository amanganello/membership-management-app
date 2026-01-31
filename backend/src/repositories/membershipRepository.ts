import pool from '../config/database.js';
import type { Membership, AssignMembershipDto } from '../types/index.js';

interface ActiveMembershipInfo {
    id: string;
    planName: string;
    startDate: string;
    endDate: string;
}

export const membershipRepository = {
    async create(data: AssignMembershipDto & { endDate: string }): Promise<Membership> {
        const result = await pool.query(
            `INSERT INTO memberships (member_id, plan_id, start_date, end_date) 
       VALUES ($1, $2, $3, $4) 
       RETURNING id, member_id as "memberId", plan_id as "planId", 
                 start_date as "startDate", end_date as "endDate",
                 created_at as "createdAt", updated_at as "updatedAt"`,
            [data.memberId, data.planId, data.startDate, data.endDate]
        );
        return result.rows[0] as Membership;
    },

    async findById(id: string): Promise<Membership | null> {
        const result = await pool.query(
            `SELECT id, member_id as "memberId", plan_id as "planId", 
              start_date as "startDate", end_date as "endDate",
              created_at as "createdAt", updated_at as "updatedAt"
       FROM memberships 
       WHERE id = $1`,
            [id]
        );
        return (result.rows[0] as Membership) ?? null;
    },

    async findActiveByMemberId(memberId: string): Promise<ActiveMembershipInfo | null> {
        const result = await pool.query(
            `SELECT m.id, p.name as "planName", 
              m.start_date as "startDate", m.end_date as "endDate"
       FROM memberships m
       JOIN plans p ON m.plan_id = p.id
       WHERE m.member_id = $1 AND m.end_date >= CURRENT_DATE
       ORDER BY m.end_date DESC
       LIMIT 1`,
            [memberId]
        );
        return (result.rows[0] as ActiveMembershipInfo) ?? null;
    },

    async hasActiveMembership(memberId: string): Promise<boolean> {
        const result = await pool.query(
            `SELECT 1 FROM memberships 
       WHERE member_id = $1 AND end_date >= CURRENT_DATE`,
            [memberId]
        );
        return result.rowCount !== null && result.rowCount > 0;
    },

    async cancel(id: string, cancelDate: string): Promise<Membership | null> {
        const result = await pool.query(
            `UPDATE memberships 
       SET end_date = $2
       WHERE id = $1 AND end_date >= CURRENT_DATE
       RETURNING id, member_id as "memberId", plan_id as "planId", 
                 start_date as "startDate", end_date as "endDate",
                 created_at as "createdAt", updated_at as "updatedAt"`,
            [id, cancelDate]
        );
        return (result.rows[0] as Membership) ?? null;
    }
};
