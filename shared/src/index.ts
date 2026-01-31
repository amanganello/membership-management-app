// ============================================
// Shared Types for Member Management App
// ============================================
// This package is the single source of truth for
// types shared between frontend and backend.
// ============================================

// Domain Entities
// Note: All date fields are strings (ISO format) as returned by API

export interface Member {
    id: string;
    name: string;
    email: string;
    joinDate: string;
    createdAt: string;
    updatedAt: string;
}

export interface Plan {
    id: string;
    name: string;
    monthlyCost: string; // PostgreSQL numeric comes as string
    durationValue: number;
    durationUnit: 'day' | 'month' | 'year';
    createdAt: string;
    updatedAt: string;
}

export interface Membership {
    id: string;
    memberId: string;
    planId: string;
    startDate: string;
    endDate: string;
    createdAt: string;
    updatedAt: string;
}

export interface Checkin {
    id: string;
    memberId: string;
    checkedInAt: string;
}

// API Response Types

export interface MemberSummary {
    id: string;
    name: string;
    email: string;
    joinDate: string;
    activeMembership: {
        id: string;
        planName: string;
        startDate: string;
        endDate: string;
    } | null;
    lastCheckinAt: string | null;
    checkinCount30Days: number;
}

// Request DTOs

export interface CreateMemberDto {
    name: string;
    email: string;
}

export interface AssignMembershipDto {
    memberId: string;
    planId: string;
    startDate: string; // YYYY-MM-DD
    endDate?: string;  // YYYY-MM-DD (Optional - calculated from plan duration if omitted)
}

export interface CancelMembershipDto {
    cancelDate: string; // YYYY-MM-DD
}

export interface CreateCheckinDto {
    memberId: string;
}

// API Error Response

export interface ApiErrorResponse {
    error: {
        message: string;
        code: string;
        statusCode: number;
        details?: string;
    };
}
