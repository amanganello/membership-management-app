import { z } from 'zod';

export const createMemberSchema = z.object({
    name: z.string().min(1, 'Name is required').max(255, 'Name too long'),
    email: z.string().email('Invalid email format').max(255, 'Email too long')
});

export const assignMembershipSchema = z.object({
    memberId: z.string().uuid('Invalid member ID'),
    planId: z.string().uuid('Invalid plan ID'),
    startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Start date must be YYYY-MM-DD format'),
    endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'End date must be YYYY-MM-DD format').optional()
});

export const cancelMembershipSchema = z.object({
    cancelDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Cancel date must be YYYY-MM-DD format')
});

export const createCheckinSchema = z.object({
    memberId: z.string().uuid('Invalid member ID')
});

export const uuidParamSchema = z.object({
    id: z.string().uuid('Invalid ID format')
});
