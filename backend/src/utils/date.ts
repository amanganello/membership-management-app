/**
 * Returns the current date in the business timezone as YYYY-MM-DD.
 * This ensures that "today" respects the local business day, regardless of server UTC time.
 */
import { APP_CONFIG } from '../config/constants.js';

export function getBusinessDate(): string {
    // Current date in business timezone
    const now = new Date();
    const formatter = new Intl.DateTimeFormat('en-CA', {
        timeZone: APP_CONFIG.TIMEZONE,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
    return formatter.format(now);
}
