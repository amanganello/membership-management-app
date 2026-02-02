import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { z } from 'zod';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}
// Date formatting
export function formatDate(date: string | Date | number): string {
    if (!date) return '';
    // Use timeZone: 'UTC' because membership dates (start/end/join) are "pure dates" (YYYY-MM-DD)
    // treated as UTC midnight. Converting to local time can shift them to the previous/next day.
    return new Date(date).toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
        timeZone: 'UTC'
    });
}

export function formatDateTime(date: string | Date | number): string {
    if (!date) return '';
    return new Date(date).toLocaleString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
        hour: 'numeric',
        second: 'numeric',
    });
}

export function calculateNextDay(dateString: string): string {
    const date = new Date(dateString);
    const nextDay = new Date(date);
    nextDay.setUTCDate(date.getUTCDate() + 1);
    return nextDay.toISOString().split('T')[0];
}


export function calculateMinStartDate(currentEndDate?: string): string {
    const today = new Date().toISOString().split('T')[0];
    if (currentEndDate) {
        const nextStart = calculateNextDay(currentEndDate);
        return nextStart > today ? nextStart : today;
    }
    return today;
}

export const createValidationHandler = (message: string) => (e: React.FormEvent<HTMLInputElement>) => {
    (e.target as HTMLInputElement).setCustomValidity(message);
};

export const clearValidationHandler = (e: React.FormEvent<HTMLInputElement>) => {
    (e.target as HTMLInputElement).setCustomValidity('');
};

export const createMemberSchema = z.object({
    name: z.string().min(1, 'Name is required').max(255, 'Name too long'),
    email: z.string().email('Invalid email address').max(255, 'Email too long')
});

export type CreateMemberInput = z.infer<typeof createMemberSchema>;

export interface MembershipStatus {
    isCancelled: boolean;
    isFuture: boolean;
    isExpired: boolean;
    isActive: boolean;
    isEndsToday: boolean;
}

export function getMembershipStatus(membership: {
    startDate: string;
    endDate: string;
    cancelledAt: string | null;
}): MembershipStatus {
    const today = new Date().toISOString().split('T')[0]!;

    // Normalize DB dates to YYYY-MM-DD (remove time part)
    const startDate = membership.startDate.split('T')[0]!;
    const endDate = membership.endDate.split('T')[0]!;

    const isCancelled = !!membership.cancelledAt;
    const isFuture = startDate > today;
    const isExpired = endDate < today;
    const isActive = !isFuture && !isExpired && !isCancelled;
    const isEndsToday = !isCancelled && endDate === today;

    return { isCancelled, isFuture, isExpired, isActive, isEndsToday };
}
