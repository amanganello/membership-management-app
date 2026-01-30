import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import type { AssignMembershipDto, CancelMembershipDto } from '@memberapp/shared';

export function useAssignMembership() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: AssignMembershipDto) => api.memberships.assign(data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['member', variables.memberId] });
            queryClient.invalidateQueries({ queryKey: ['members'] });
        },
    });
}

export function useCancelMembership() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: CancelMembershipDto }) =>
            api.memberships.cancel(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['member'] });
            queryClient.invalidateQueries({ queryKey: ['members'] });
        },
    });
}
