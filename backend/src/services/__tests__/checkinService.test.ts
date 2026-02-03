import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { NotFoundError, ValidationError } from '../../types/index.js';

// Mock the repositories before importing the service
jest.unstable_mockModule('../../repositories/checkinRepository.js', () => ({
    checkinRepository: {
        create: jest.fn(),
    }
}));

jest.unstable_mockModule('../../repositories/memberRepository.js', () => ({
    memberRepository: {
        exists: jest.fn(),
    }
}));

jest.unstable_mockModule('../../repositories/membershipRepository.js', () => ({
    membershipRepository: {
        hasActiveMembership: jest.fn(),
    }
}));

// Dynamic imports after mocks are set up
const { checkinRepository } = await import('../../repositories/checkinRepository.js');
const { memberRepository } = await import('../../repositories/memberRepository.js');
const { membershipRepository } = await import('../../repositories/membershipRepository.js');
const { checkinService } = await import('../checkinService.js');

const mockCheckinRepository = checkinRepository as jest.Mocked<typeof checkinRepository>;
const mockMemberRepository = memberRepository as jest.Mocked<typeof memberRepository>;
const mockMembershipRepository = membershipRepository as jest.Mocked<typeof membershipRepository>;

describe('checkinService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('recordCheckin()', () => {
        const checkinData = { memberId: 'member-uuid' };
        const createdCheckin = {
            id: 'checkin-uuid',
            memberId: 'member-uuid',
            checkedInAt: '2026-01-28T10:00:00.000Z',
        };

        it('should record check-in for member with active membership', async () => {
            mockMemberRepository.exists.mockResolvedValue(true);
            mockMembershipRepository.hasActiveMembership.mockResolvedValue(true);
            mockCheckinRepository.create.mockResolvedValue(createdCheckin);

            const result = await checkinService.recordCheckin(checkinData);

            expect(mockMemberRepository.exists).toHaveBeenCalledWith('member-uuid');
            // hasActiveMembership now receives both memberId and a business date
            expect(mockMembershipRepository.hasActiveMembership).toHaveBeenCalledWith(
                'member-uuid',
                expect.any(String)
            );
            expect(mockCheckinRepository.create).toHaveBeenCalledWith(checkinData);
            expect(result).toEqual(createdCheckin);
        });

        it('should throw NotFoundError when member does not exist', async () => {
            mockMemberRepository.exists.mockResolvedValue(false);

            await expect(checkinService.recordCheckin(checkinData))
                .rejects
                .toThrow(NotFoundError);

            expect(mockMembershipRepository.hasActiveMembership).not.toHaveBeenCalled();
            expect(mockCheckinRepository.create).not.toHaveBeenCalled();
        });

        it('should throw ValidationError when member has no active membership (check-in gate)', async () => {
            mockMemberRepository.exists.mockResolvedValue(true);
            mockMembershipRepository.hasActiveMembership.mockResolvedValue(false);

            await expect(checkinService.recordCheckin(checkinData))
                .rejects
                .toThrow(ValidationError);

            expect(mockCheckinRepository.create).not.toHaveBeenCalled();
        });
    });
});
