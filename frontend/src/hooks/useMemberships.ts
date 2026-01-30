import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import { queryKeys } from '../lib/queryKeys';
import type { AssignMembershipDto, CancelMembershipDto } from '@memberapp/shared';

export function useAssignMembership() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: AssignMembershipDto) => api.memberships.assign(data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.members.detail(variables.memberId) });
            queryClient.invalidateQueries({ queryKey: queryKeys.members.all });
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
            queryClient.invalidateQueries({ queryKey: queryKeys.members.all });
        },
    });
}
