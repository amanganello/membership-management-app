import { membershipRepository } from '../repositories/membershipRepository.js';
import { memberRepository } from '../repositories/memberRepository.js';
import { planRepository } from '../repositories/planRepository.js';
import type { Membership, AssignMembershipDto } from '../types/index.js';
import { NotFoundError, ValidationError, ConflictError } from '../types/index.js';

export const membershipService = {
    async assign(data: AssignMembershipDto): Promise<Membership> {
        // Validate member exists
        const memberExists = await memberRepository.exists(data.memberId);
        if (!memberExists) {
            throw new NotFoundError('Member');
        }

        // Validate plan exists
        const planExists = await planRepository.exists(data.planId);
        if (!planExists) {
            throw new NotFoundError('Plan');
        }

        // Validate dates
        if (new Date(data.startDate) > new Date(data.endDate)) {
            throw new ValidationError('Start date must be before or equal to end date');
        }

        try {
            return await membershipRepository.create(data);
        } catch (error: unknown) {
            // Handle exclusion constraint violation (overlapping memberships)
            if (error instanceof Error && 'code' in error && error.code === '23P01') {
                throw new ConflictError('Member already has an overlapping membership for this period');
            }
            throw error;
        }
    },

    async cancel(membershipId: string, cancelDate: string): Promise<Membership> {
        // Validate membership exists
        const membership = await membershipRepository.findById(membershipId);
        if (!membership) {
            throw new NotFoundError('Membership');
        }

        // Check if membership is still active
        const today = new Date().toISOString().split('T')[0];
        if (membership.endDate < today!) {
            throw new ValidationError('Cannot cancel an already expired membership');
        }

        // Cancel date validation
        if (cancelDate < today!) {
            throw new ValidationError('Cancel date cannot be in the past');
        }

        const cancelled = await membershipRepository.cancel(membershipId, cancelDate);
        if (!cancelled) {
            throw new ValidationError('Failed to cancel membership');
        }

        return cancelled;
    }
};
