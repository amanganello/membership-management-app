import { membershipRepository } from '../repositories/membershipRepository.js';
import { memberRepository } from '../repositories/memberRepository.js';
import { planRepository } from '../repositories/planRepository.js';
import type { Membership, AssignMembershipDto } from '../types/index.js';
import { NotFoundError, ValidationError, ConflictError } from '../types/index.js';

function addDuration(startDate: string, value: number, unit: 'day' | 'month' | 'year'): string {
    const date = new Date(startDate);
    const originalDay = date.getDate();

    if (unit === 'day') {
        date.setDate(date.getDate() + value);
    } else if (unit === 'month') {
        date.setMonth(date.getMonth() + value);
        // Handle month end overflow (e.g. Jan 31 + 1 month -> Feb 28/29)
        if (date.getDate() !== originalDay) {
            // Go to the last day of the previous month (which is the target month)
            date.setDate(0);
        }
    } else if (unit === 'year') {
        date.setFullYear(date.getFullYear() + value);
        // Handle leap year case: Feb 29 + 1 year -> Feb 28
        if (originalDay === 29 && date.getMonth() === 2) { // Month is 0-indexed, 2 is March
            // If we landed on March 1st (non-leap year), go back to Feb 28
            date.setDate(0);
        }
    }

    // A membership usually runs UNTIL that date.
    // If "1 Month" starts Jan 1, it implies functionality through Jan 31.
    // So if calculation gave Feb 1, we subtract 1 day.
    // However, if unit is 'day' and value is 1 (Day Pass), Jan 1 + 1 day = Jan 2.
    // A Day Pass starting Jan 1 should end Jan 1? Or Jan 2?
    // Usually a "1 Day" pass is just for that day. So start=end.
    // So yes, subtract 1 day from the result.
    date.setDate(date.getDate() - 1);

    return date.toISOString().split('T')[0] as string;
}

export const membershipService = {
    async assign(data: AssignMembershipDto): Promise<Membership> {
        // Validate member exists
        const memberExists = await memberRepository.exists(data.memberId);
        if (!memberExists) {
            throw new NotFoundError('Member');
        }

        // Fetch plan details (needed for duration)
        const plan = await planRepository.findById(data.planId);
        if (!plan) {
            throw new NotFoundError('Plan');
        }

        let endDate = data.endDate;

        // If no end date provided, calculate it from the plan duration
        if (!endDate) {
            endDate = addDuration(data.startDate, plan.durationValue, plan.durationUnit);
        }

        // Validate dates
        if (new Date(data.startDate) > new Date(endDate)) {
            throw new ValidationError('Start date must be before or equal to end date');
        }

        const membershipData: AssignMembershipDto & { endDate: string } = {
            ...data,
            endDate: endDate! // We ensured it has a value above
        };

        try {
            return await membershipRepository.create(membershipData);
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
