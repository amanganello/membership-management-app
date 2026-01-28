import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { NotFoundError, ValidationError } from '../../types/index.js';

// Mock the repositories before importing the service
jest.unstable_mockModule('../../repositories/memberRepository.js', () => ({
    memberRepository: {
        emailExists: jest.fn(),
        create: jest.fn(),
        findAll: jest.fn(),
        search: jest.fn(),
        findById: jest.fn(),
        exists: jest.fn(),
    }
}));

jest.unstable_mockModule('../../repositories/membershipRepository.js', () => ({
    membershipRepository: {
        findActiveByMemberId: jest.fn(),
        hasActiveMembership: jest.fn(),
    }
}));

jest.unstable_mockModule('../../repositories/checkinRepository.js', () => ({
    checkinRepository: {
        getStatsByMemberId: jest.fn(),
    }
}));

// Dynamic imports after mocks are set up
const { memberRepository } = await import('../../repositories/memberRepository.js');
const { membershipRepository } = await import('../../repositories/membershipRepository.js');
const { checkinRepository } = await import('../../repositories/checkinRepository.js');
const { memberService } = await import('../memberService.js');

const mockMemberRepository = memberRepository as jest.Mocked<typeof memberRepository>;
const mockMembershipRepository = membershipRepository as jest.Mocked<typeof membershipRepository>;
const mockCheckinRepository = checkinRepository as jest.Mocked<typeof checkinRepository>;

describe('memberService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('create()', () => {
        const validMemberData = { name: 'John Doe', email: 'john@example.com' };
        const createdMember = {
            id: 'uuid-1',
            name: 'John Doe',
            email: 'john@example.com',
            joinDate: '2026-01-28',
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        it('should create a member with valid data', async () => {
            mockMemberRepository.emailExists.mockResolvedValue(false);
            mockMemberRepository.create.mockResolvedValue(createdMember);

            const result = await memberService.create(validMemberData);

            expect(mockMemberRepository.emailExists).toHaveBeenCalledWith('john@example.com');
            expect(mockMemberRepository.create).toHaveBeenCalledWith(validMemberData);
            expect(result).toEqual(createdMember);
        });

        it('should throw ValidationError when email already exists', async () => {
            mockMemberRepository.emailExists.mockResolvedValue(true);

            await expect(memberService.create(validMemberData))
                .rejects
                .toThrow(ValidationError);

            expect(mockMemberRepository.create).not.toHaveBeenCalled();
        });
    });

    describe('list()', () => {
        const members = [
            { id: 'uuid-1', name: 'Alice', email: 'alice@example.com', joinDate: '2026-01-01', createdAt: new Date(), updatedAt: new Date() },
            { id: 'uuid-2', name: 'Bob', email: 'bob@example.com', joinDate: '2026-01-02', createdAt: new Date(), updatedAt: new Date() },
        ];

        it('should return all members when no search query is provided', async () => {
            mockMemberRepository.findAll.mockResolvedValue(members);

            const result = await memberService.list();

            expect(mockMemberRepository.findAll).toHaveBeenCalled();
            expect(mockMemberRepository.search).not.toHaveBeenCalled();
            expect(result).toEqual(members);
        });

        it('should search members when search query is provided', async () => {
            mockMemberRepository.search.mockResolvedValue([members[0]!]);

            const result = await memberService.list('Alice');

            expect(mockMemberRepository.search).toHaveBeenCalledWith('Alice');
            expect(mockMemberRepository.findAll).not.toHaveBeenCalled();
            expect(result).toEqual([members[0]]);
        });

        it('should return all members when search query is empty/whitespace', async () => {
            mockMemberRepository.findAll.mockResolvedValue(members);

            const result = await memberService.list('   ');

            expect(mockMemberRepository.findAll).toHaveBeenCalled();
            expect(mockMemberRepository.search).not.toHaveBeenCalled();
        });
    });

    describe('getSummary()', () => {
        const member = {
            id: 'uuid-1',
            name: 'John Doe',
            email: 'john@example.com',
            joinDate: '2026-01-01',
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const activeMembership = {
            id: 'membership-1',
            planName: 'Premium',
            startDate: '2026-01-01',
            endDate: '2026-12-31',
        };

        const checkinStats = {
            lastCheckinAt: '2026-01-28T10:00:00Z',
            checkinCount30Days: 15,
        };

        it('should return complete member summary with active membership', async () => {
            mockMemberRepository.findById.mockResolvedValue(member);
            mockMembershipRepository.findActiveByMemberId.mockResolvedValue(activeMembership);
            mockCheckinRepository.getStatsByMemberId.mockResolvedValue(checkinStats);

            const result = await memberService.getSummary('uuid-1');

            expect(result).toEqual({
                id: member.id,
                name: member.name,
                email: member.email,
                joinDate: member.joinDate,
                activeMembership,
                lastCheckinAt: checkinStats.lastCheckinAt,
                checkinCount30Days: checkinStats.checkinCount30Days,
            });
        });

        it('should throw NotFoundError when member does not exist', async () => {
            mockMemberRepository.findById.mockResolvedValue(null);

            await expect(memberService.getSummary('non-existent'))
                .rejects
                .toThrow(NotFoundError);

            expect(mockMembershipRepository.findActiveByMemberId).not.toHaveBeenCalled();
        });
    });
});
