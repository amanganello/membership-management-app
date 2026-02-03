import { checkinRepository } from '../repositories/checkinRepository.js';
import { memberRepository } from '../repositories/memberRepository.js';
import { membershipRepository } from '../repositories/membershipRepository.js';
import type { Checkin, CreateCheckinDto } from '../types/index.js';
import { NotFoundError, ValidationError } from '../types/index.js';
import { getBusinessDate } from '../utils/date.js';

export const checkinService = {
    async recordCheckin(data: CreateCheckinDto): Promise<Checkin> {
        // Validate member exists
        const memberExists = await memberRepository.exists(data.memberId);
        if (!memberExists) {
            throw new NotFoundError('Member');
        }

        // CHECK-IN GATE: Validate member has active membership (using business date)
        const hasActiveMembership = await membershipRepository.hasActiveMembership(
            data.memberId,
            getBusinessDate()
        );
        if (!hasActiveMembership) {
            throw new ValidationError('Member does not have an active membership. Check-in denied.');
        }

        return checkinRepository.create(data);
    }
};
