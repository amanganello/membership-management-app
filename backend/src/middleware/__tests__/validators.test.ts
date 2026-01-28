import {
    createMemberSchema,
    assignMembershipSchema,
    cancelMembershipSchema,
    createCheckinSchema,
    uuidParamSchema,
} from '../validators.js';

describe('Zod Validators', () => {
    describe('createMemberSchema', () => {
        it('should accept valid member data', () => {
            const result = createMemberSchema.safeParse({
                name: 'John Doe',
                email: 'john@example.com',
            });

            expect(result.success).toBe(true);
        });

        it('should reject invalid email format', () => {
            const result = createMemberSchema.safeParse({
                name: 'John Doe',
                email: 'not-an-email',
            });

            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues[0]?.message).toContain('email');
            }
        });

        it('should reject empty name', () => {
            const result = createMemberSchema.safeParse({
                name: '',
                email: 'john@example.com',
            });

            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues[0]?.message).toContain('required');
            }
        });
    });

    describe('assignMembershipSchema', () => {
        it('should accept valid membership data', () => {
            const result = assignMembershipSchema.safeParse({
                memberId: '550e8400-e29b-41d4-a716-446655440000',
                planId: '550e8400-e29b-41d4-a716-446655440001',
                startDate: '2026-01-01',
                endDate: '2026-12-31',
            });

            expect(result.success).toBe(true);
        });

        it('should reject invalid UUID for memberId', () => {
            const result = assignMembershipSchema.safeParse({
                memberId: 'not-a-uuid',
                planId: '550e8400-e29b-41d4-a716-446655440001',
                startDate: '2026-01-01',
                endDate: '2026-12-31',
            });

            expect(result.success).toBe(false);
        });

        it('should reject invalid date format', () => {
            const result = assignMembershipSchema.safeParse({
                memberId: '550e8400-e29b-41d4-a716-446655440000',
                planId: '550e8400-e29b-41d4-a716-446655440001',
                startDate: '01-01-2026', // Wrong format
                endDate: '2026-12-31',
            });

            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues[0]?.message).toContain('YYYY-MM-DD');
            }
        });
    });

    describe('cancelMembershipSchema', () => {
        it('should accept valid cancel date', () => {
            const result = cancelMembershipSchema.safeParse({
                cancelDate: '2026-06-15',
            });

            expect(result.success).toBe(true);
        });

        it('should reject invalid date format', () => {
            const result = cancelMembershipSchema.safeParse({
                cancelDate: '2026/06/15',
            });

            expect(result.success).toBe(false);
        });
    });

    describe('createCheckinSchema', () => {
        it('should accept valid member ID', () => {
            const result = createCheckinSchema.safeParse({
                memberId: '550e8400-e29b-41d4-a716-446655440000',
            });

            expect(result.success).toBe(true);
        });

        it('should reject invalid UUID', () => {
            const result = createCheckinSchema.safeParse({
                memberId: 'invalid-uuid',
            });

            expect(result.success).toBe(false);
        });
    });

    describe('uuidParamSchema', () => {
        it('should accept valid UUID', () => {
            const result = uuidParamSchema.safeParse({
                id: '550e8400-e29b-41d4-a716-446655440000',
            });

            expect(result.success).toBe(true);
        });

        it('should reject invalid UUID', () => {
            const result = uuidParamSchema.safeParse({
                id: '12345',
            });

            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues[0]?.message).toContain('Invalid ID');
            }
        });
    });
});
