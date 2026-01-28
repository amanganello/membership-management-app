// Domain Types for Fitness Member Management

export interface Member {
    id: string;
    name: string;
    email: string;
    joinDate: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface Plan {
    id: string;
    name: string;
    monthlyCost: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface Membership {
    id: string;
    memberId: string;
    planId: string;
    startDate: string;
    endDate: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface Checkin {
    id: string;
    memberId: string;
    checkedInAt: Date;
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
    startDate: string;
    endDate: string;
}

export interface CancelMembershipDto {
    cancelDate: string;
}

export interface CreateCheckinDto {
    memberId: string;
}

// Error Types
export class AppError extends Error {
    constructor(
        public statusCode: number,
        public override message: string,
        public code?: string
    ) {
        super(message);
        this.name = 'AppError';
    }
}

export class NotFoundError extends AppError {
    constructor(resource: string) {
        super(404, `${resource} not found`, 'NOT_FOUND');
    }
}

export class ValidationError extends AppError {
    constructor(message: string) {
        super(400, message, 'VALIDATION_ERROR');
    }
}

export class ConflictError extends AppError {
    constructor(message: string) {
        super(409, message, 'CONFLICT');
    }
}
