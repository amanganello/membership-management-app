import axios, { AxiosError, type AxiosInstance } from 'axios';
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

// Create Axios instance with base configuration
const apiClient: AxiosInstance = axios.create({
    baseURL: '/api',
    timeout: 10000, // 10 second timeout
    headers: {
        'Content-Type': 'application/json',
    },
});

// Response interceptor for error handling
apiClient.interceptors.response.use(
    (response) => response,
    (error: AxiosError<ApiErrorResponse>) => {
        if (error.response) {
            // Server responded with error status
            const errorData = error.response.data?.error || {
                message: 'An unexpected error occurred',
                code: 'UNKNOWN_ERROR',
                statusCode: error.response.status,
            };

            console.error(`API Error [${error.response.status}]:`, errorData);

            throw new ApiRequestError(
                errorData.statusCode,
                errorData.code,
                errorData.message,
                errorData.details
            );
        } else if (error.request) {
            // Request made but no response received
            console.error('Network Error:', error.message);
            throw new ApiRequestError(0, 'NETWORK_ERROR', 'Unable to connect to the server');
        } else {
            // Error in request configuration
            console.error('Request Error:', error.message);
            throw new ApiRequestError(0, 'REQUEST_ERROR', error.message);
        }
    }
);

// ============ Members API ============

export const membersApi = {
    /**
     * Get all members, optionally filtered by search query
     */
    list: async (search?: string): Promise<Member[]> => {
        const params = search ? { q: search } : undefined;
        const { data } = await apiClient.get<Member[]>('/members', { params });
        return data;
    },

    /**
     * Get member summary by ID (includes active membership, check-in stats)
     */
    getSummary: async (id: string): Promise<MemberSummary> => {
        const { data } = await apiClient.get<MemberSummary>(`/members/${id}`);
        return data;
    },

    /**
     * Create a new member
     */
    create: async (payload: CreateMemberDto): Promise<Member> => {
        const { data } = await apiClient.post<Member>('/members', payload);
        return data;
    },
};

// ============ Plans API ============

export const plansApi = {
    /**
     * Get all available plans
     */
    list: async (): Promise<Plan[]> => {
        const { data } = await apiClient.get<Plan[]>('/plans');
        return data;
    },
};

// ============ Memberships API ============

export const membershipsApi = {
    /**
     * Assign a membership to a member
     */
    assign: async (payload: AssignMembershipDto): Promise<Membership> => {
        const { data } = await apiClient.post<Membership>('/memberships', payload);
        return data;
    },

    /**
     * Cancel a membership
     */
    cancel: async (id: string, payload: CancelMembershipDto): Promise<Membership> => {
        const { data } = await apiClient.patch<Membership>(`/memberships/${id}/cancel`, payload);
        return data;
    },
};

// ============ Check-ins API ============

export const checkinsApi = {
    /**
     * Create a check-in for a member
     */
    create: async (payload: CreateCheckinDto): Promise<Checkin> => {
        const { data } = await apiClient.post<Checkin>('/checkins', payload);
        return data;
    },
};

// Unified API export
export const api = {
    members: membersApi,
    plans: plansApi,
    memberships: membershipsApi,
    checkins: checkinsApi,
};

// Export the axios instance for advanced usage (e.g., adding auth headers)
export { apiClient };

export default api;
