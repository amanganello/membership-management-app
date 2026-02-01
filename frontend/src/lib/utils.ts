import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

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
