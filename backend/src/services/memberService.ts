import { memberRepository } from '../repositories/memberRepository.js';
import { membershipRepository } from '../repositories/membershipRepository.js';
import { checkinRepository } from '../repositories/checkinRepository.js';
import type { Member, MemberSummary, CreateMemberDto } from '../types/index.js';
import { NotFoundError, ValidationError } from '../types/index.js';

export const memberService = {
    async create(data: CreateMemberDto): Promise<Member> {
        // Check for duplicate email
        const emailExists = await memberRepository.emailExists(data.email);
        if (emailExists) {
            throw new ValidationError('Email already exists');
        }

        return memberRepository.create(data);
    },

    async list(searchQuery?: string): Promise<Member[]> {
        if (searchQuery && searchQuery.trim()) {
            return memberRepository.search(searchQuery.trim());
        }
        return memberRepository.findAll();
    },

    async getSummary(id: string): Promise<MemberSummary> {
        const member = await memberRepository.findById(id);
        if (!member) {
            throw new NotFoundError('Member');
        }

        // Get active membership
        const activeMembership = await membershipRepository.findActiveByMemberId(id);

        // Get checkin stats
        const checkinStats = await checkinRepository.getStatsByMemberId(id);

        return {
            id: member.id,
            name: member.name,
            email: member.email,
            joinDate: member.joinDate,
            activeMembership,
            lastCheckinAt: checkinStats.lastCheckinAt,
            checkinCount30Days: checkinStats.checkinCount30Days
        };
    }
};
