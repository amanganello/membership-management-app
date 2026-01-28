import pool from '../config/database.js';
import type { Checkin, CreateCheckinDto } from '../types/index.js';

interface CheckinStats {
    lastCheckinAt: string | null;
    checkinCount30Days: number;
}

export const checkinRepository = {
    async create(data: CreateCheckinDto): Promise<Checkin> {
        const result = await pool.query(
            `INSERT INTO checkins (member_id) 
       VALUES ($1) 
       RETURNING id, member_id as "memberId", checked_in_at as "checkedInAt"`,
            [data.memberId]
        );
        return result.rows[0] as Checkin;
    },

    async getStatsByMemberId(memberId: string): Promise<CheckinStats> {
        const result = await pool.query(
            `SELECT 
         MAX(checked_in_at) as "lastCheckinAt",
         COUNT(CASE WHEN checked_in_at >= NOW() - INTERVAL '30 days' THEN 1 END)::int as "checkinCount30Days"
       FROM checkins 
       WHERE member_id = $1`,
            [memberId]
        );

        const row = result.rows[0] as { lastCheckinAt: Date | null; checkinCount30Days: number } | undefined;
        return {
            lastCheckinAt: row?.lastCheckinAt?.toISOString() ?? null,
            checkinCount30Days: row?.checkinCount30Days ?? 0
        };
    }
};
