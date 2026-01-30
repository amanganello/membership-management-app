import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { NotFoundError, ValidationError, ConflictError } from '../../types/index.js';

// Mock the repositories before importing the service
jest.unstable_mockModule('../../repositories/membershipRepository.js', () => ({
    membershipRepository: {
        create: jest.fn(),
        findById: jest.fn(),
        findActiveByMemberId: jest.fn(),
        hasActiveMembership: jest.fn(),
        cancel: jest.fn(),
    }
}));

jest.unstable_mockModule('../../repositories/memberRepository.js', () => ({
    memberRepository: {
        exists: jest.fn(),
    }
}));

jest.unstable_mockModule('../../repositories/planRepository.js', () => ({
    planRepository: {
        exists: jest.fn(),
    }
}));

// Dynamic imports after mocks are set up
const { membershipRepository } = await import('../../repositories/membershipRepository.js');
const { memberRepository } = await import('../../repositories/memberRepository.js');
const { planRepository } = await import('../../repositories/planRepository.js');
const { membershipService } = await import('../membershipService.js');

const mockMembershipRepository = membershipRepository as jest.Mocked<typeof membershipRepository>;
const mockMemberRepository = memberRepository as jest.Mocked<typeof memberRepository>;
const mockPlanRepository = planRepository as jest.Mocked<typeof planRepository>;

describe('membershipService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('assign()', () => {
        const validAssignData = {
            memberId: 'member-uuid',
            planId: 'plan-uuid',
            startDate: '2026-01-01',
            endDate: '2026-12-31',
        };

        const createdMembership = {
            id: 'membership-uuid',
            memberId: 'member-uuid',
            planId: 'plan-uuid',
            startDate: '2026-01-01',
            endDate: '2026-12-31',
            createdAt: '2026-01-01T00:00:00.000Z',
            updatedAt: '2026-01-01T00:00:00.000Z',
        };

        it('should create membership with valid data', async () => {
            mockMemberRepository.exists.mockResolvedValue(true);
            mockPlanRepository.exists.mockResolvedValue(true);
            mockMembershipRepository.create.mockResolvedValue(createdMembership);

            const result = await membershipService.assign(validAssignData);

            expect(mockMemberRepository.exists).toHaveBeenCalledWith('member-uuid');
            expect(mockPlanRepository.exists).toHaveBeenCalledWith('plan-uuid');
            expect(mockMembershipRepository.create).toHaveBeenCalledWith(validAssignData);
            expect(result).toEqual(createdMembership);
        });

        it('should throw NotFoundError when member does not exist', async () => {
            mockMemberRepository.exists.mockResolvedValue(false);

            await expect(membershipService.assign(validAssignData))
                .rejects
                .toThrow(NotFoundError);

            expect(mockPlanRepository.exists).not.toHaveBeenCalled();
            expect(mockMembershipRepository.create).not.toHaveBeenCalled();
        });

        it('should throw NotFoundError when plan does not exist', async () => {
            mockMemberRepository.exists.mockResolvedValue(true);
            mockPlanRepository.exists.mockResolvedValue(false);

            await expect(membershipService.assign(validAssignData))
                .rejects
                .toThrow(NotFoundError);

            expect(mockMembershipRepository.create).not.toHaveBeenCalled();
        });

        it('should throw ValidationError when start date is after end date', async () => {
            mockMemberRepository.exists.mockResolvedValue(true);
            mockPlanRepository.exists.mockResolvedValue(true);

            const invalidData = {
                ...validAssignData,
                startDate: '2026-12-31',
                endDate: '2026-01-01',
            };

            await expect(membershipService.assign(invalidData))
                .rejects
                .toThrow(ValidationError);

            expect(mockMembershipRepository.create).not.toHaveBeenCalled();
        });

        it('should throw ConflictError for overlapping memberships', async () => {
            mockMemberRepository.exists.mockResolvedValue(true);
            mockPlanRepository.exists.mockResolvedValue(true);

            const dbError = new Error('exclusion constraint violation') as Error & { code: string };
            dbError.code = '23P01';
            mockMembershipRepository.create.mockRejectedValue(dbError);

            await expect(membershipService.assign(validAssignData))
                .rejects
                .toThrow(ConflictError);
        });
    });

    describe('cancel()', () => {
        const today = new Date().toISOString().split('T')[0]!;
        const futureDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]!;
        const pastDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]!;

        const activeMembership = {
            id: 'membership-uuid',
            memberId: 'member-uuid',
            planId: 'plan-uuid',
            startDate: '2026-01-01',
            endDate: futureDate,
            createdAt: '2026-01-01T00:00:00.000Z',
            updatedAt: '2026-01-01T00:00:00.000Z',
        };

        it('should cancel an active membership', async () => {
            mockMembershipRepository.findById.mockResolvedValue(activeMembership);
            mockMembershipRepository.cancel.mockResolvedValue({ ...activeMembership, endDate: today });

            const result = await membershipService.cancel('membership-uuid', today);

            expect(mockMembershipRepository.cancel).toHaveBeenCalledWith('membership-uuid', today);
            expect(result.endDate).toBe(today);
        });

        it('should throw NotFoundError when membership does not exist', async () => {
            mockMembershipRepository.findById.mockResolvedValue(null);

            await expect(membershipService.cancel('non-existent', today))
                .rejects
                .toThrow(NotFoundError);

            expect(mockMembershipRepository.cancel).not.toHaveBeenCalled();
        });

        it('should throw ValidationError for already expired membership', async () => {
            const expiredMembership = { ...activeMembership, endDate: pastDate };
            mockMembershipRepository.findById.mockResolvedValue(expiredMembership);

            await expect(membershipService.cancel('membership-uuid', today))
                .rejects
                .toThrow(ValidationError);

            expect(mockMembershipRepository.cancel).not.toHaveBeenCalled();
        });

        it('should throw ValidationError when cancel date is in the past', async () => {
            mockMembershipRepository.findById.mockResolvedValue(activeMembership);

            await expect(membershipService.cancel('membership-uuid', pastDate))
                .rejects
                .toThrow(ValidationError);

            expect(mockMembershipRepository.cancel).not.toHaveBeenCalled();
        });
    });
});
