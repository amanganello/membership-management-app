import pool from '../config/database.js';
import type { Membership, AssignMembershipDto } from '../types/index.js';
import { APP_CONFIG } from '../config/constants.js';

interface ActiveMembershipInfo {
    id: string;
    planName: string;
    startDate: string;
    endDate: string;
    cancelledAt: string | null;
}

export const membershipRepository = {
    async create(data: AssignMembershipDto & { endDate: string }): Promise<Membership> {
        const result = await pool.query(
            `INSERT INTO memberships (member_id, plan_id, start_date, end_date) 
       VALUES ($1, $2, $3, $4) 
       RETURNING id, member_id as "memberId", plan_id as "planId", 
                 start_date as "startDate", end_date as "endDate",
                 cancelled_at as "cancelledAt",
                 created_at as "createdAt", updated_at as "updatedAt"`,
            [data.memberId, data.planId, data.startDate, data.endDate]
        );
        return result.rows[0] as Membership;
    },

    async findById(id: string): Promise<Membership | null> {
        const result = await pool.query(
            `SELECT id, member_id as "memberId", plan_id as "planId", 
              start_date as "startDate", end_date as "endDate",
              cancelled_at as "cancelledAt",
              created_at as "createdAt", updated_at as "updatedAt"
       FROM memberships 
       WHERE id = $1`,
            [id]
        );
        return (result.rows[0] as Membership) ?? null;
    },

    async findAllByMemberId(memberId: string): Promise<ActiveMembershipInfo[]> {
        const result = await pool.query(
            `SELECT m.id, p.name as "planName", 
              m.start_date as "startDate", m.end_date as "endDate",
              m.cancelled_at as "cancelledAt"
       FROM memberships m
       JOIN plans p ON m.plan_id = p.id
       WHERE m.member_id = $1 
       ORDER BY m.end_date DESC`,
            [memberId]
        );
        return result.rows as ActiveMembershipInfo[];
    },

    async hasActiveMembership(memberId: string): Promise<boolean> {
        const result = await pool.query(
            `SELECT 1 FROM memberships 
       WHERE member_id = $1 
         AND start_date <= CURRENT_DATE 
         AND end_date >= CURRENT_DATE`,
            [memberId]
        );
        return result.rowCount !== null && result.rowCount > 0;
    },

    async cancel(id: string, cancelDate: string): Promise<Membership | null> {
        const query = `
            UPDATE memberships 
            SET cancelled_at = NOW(),
                updated_at = NOW()
            WHERE id = $1
              AND end_date >= (NOW() AT TIME ZONE '${APP_CONFIG.TIMEZONE}')::date 
              AND cancelled_at IS NULL
            RETURNING *;
        `;
        const { rows } = await pool.query<Membership>(query, [id]);
        return rows[0] || null;
    }
};
