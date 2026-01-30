/**
 * Query Key Factory
 * Centralized query keys for React Query to avoid magic strings
 * and enable type-safe invalidation.
 */

export const queryKeys = {
    // Members
    members: {
        all: ['members'] as const,
        list: (search?: string) => [...queryKeys.members.all, { search }] as const,
        detail: (id: string) => ['member', id] as const,
    },

    // Plans
    plans: {
        all: ['plans'] as const,
    },

    // Memberships (for future use)
    memberships: {
        all: ['memberships'] as const,
    },
} as const;
