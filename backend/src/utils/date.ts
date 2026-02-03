export const BUSINESS_TIMEZONE = process.env.BUSINESS_TIMEZONE || 'America/Argentina/Buenos_Aires';

/**
 * Returns the current date in the business timezone as YYYY-MM-DD.
 * This ensures that "today" respects the local business day, regardless of server UTC time.
 */
export function getBusinessDate(): string {
    // en-CA format is YYYY-MM-DD
    return new Date().toLocaleDateString('en-CA', { timeZone: BUSINESS_TIMEZONE });
}
