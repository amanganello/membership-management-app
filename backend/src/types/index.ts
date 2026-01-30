// Re-export shared types
export type {
    Member,
    Plan,
    Membership,
    Checkin,
    MemberSummary,
    CreateMemberDto,
    AssignMembershipDto,
    CancelMembershipDto,
    CreateCheckinDto,
    ApiErrorResponse,
} from '@memberapp/shared';

// Backend-specific error classes (not shared)

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
