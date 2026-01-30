import type {
    Member,
    MemberSummary,
    CreateMemberDto,
    Plan,
    Membership,
    AssignMembershipDto,
    CancelMembershipDto,
    Checkin,
    CreateCheckinDto,
    ApiErrorResponse,
} from '@memberapp/shared';

const API_BASE = '/api';

// Custom error class for API errors
export class ApiRequestError extends Error {
    statusCode: number;
    code: string;
    details?: string;

    constructor(
        statusCode: number,
        code: string,
        message: string,
        details?: string
    ) {
        super(message);
        this.name = 'ApiRequestError';
        this.statusCode = statusCode;
        this.code = code;
        this.details = details;
    }
}

// Generic fetch wrapper with error handling
async function request<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const url = `${API_BASE}${endpoint}`;

    const config: RequestInit = {
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
        ...options,
    };

    try {
        const response = await fetch(url, config);

        if (!response.ok) {
            const errorData: ApiErrorResponse = await response.json().catch(() => ({
                error: {
                    message: 'An unexpected error occurred',
                    code: 'UNKNOWN_ERROR',
                    statusCode: response.status,
                },
            }));

            console.error(`API Error [${response.status}]:`, errorData.error);

            throw new ApiRequestError(
                errorData.error.statusCode,
                errorData.error.code,
                errorData.error.message,
                errorData.error.details
            );
        }

        return response.json();
    } catch (error) {
        if (error instanceof ApiRequestError) {
            throw error;
        }

        // Network or other errors
        console.error('Network Error:', error);
        throw new ApiRequestError(
            0,
            'NETWORK_ERROR',
            'Unable to connect to the server'
        );
    }
}

// ============ Members API ============

export const membersApi = {
    /**
     * Get all members
     */
    list: (): Promise<Member[]> => {
        return request<Member[]>('/members');
    },

    /**
     * Get member summary by ID (includes active membership, check-in stats)
     */
    getSummary: (id: string): Promise<MemberSummary> => {
        return request<MemberSummary>(`/members/${id}`);
    },

    /**
     * Create a new member
     */
    create: (data: CreateMemberDto): Promise<Member> => {
        return request<Member>('/members', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },
};

// ============ Plans API ============

export const plansApi = {
    /**
     * Get all available plans
     */
    list: (): Promise<Plan[]> => {
        return request<Plan[]>('/plans');
    },
};

// ============ Memberships API ============

export const membershipsApi = {
    /**
     * Assign a membership to a member
     */
    assign: (data: AssignMembershipDto): Promise<Membership> => {
        return request<Membership>('/memberships', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    /**
     * Cancel a membership
     */
    cancel: (id: string, data: CancelMembershipDto): Promise<Membership> => {
        return request<Membership>(`/memberships/${id}/cancel`, {
            method: 'PATCH',
            body: JSON.stringify(data),
        });
    },
};

// ============ Check-ins API ============

export const checkinsApi = {
    /**
     * Create a check-in for a member
     */
    create: (data: CreateCheckinDto): Promise<Checkin> => {
        return request<Checkin>('/checkins', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },
};

// Unified API export
export const api = {
    members: membersApi,
    plans: plansApi,
    memberships: membershipsApi,
    checkins: checkinsApi,
};

export default api;
