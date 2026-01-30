import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import { queryKeys } from '../lib/queryKeys';
import type { CreateCheckinDto } from '@memberapp/shared';

export function useCreateCheckin() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateCheckinDto) => api.checkins.create(data),
        onSuccess: (_, variables) => {
            // Invalidate member summary to show updated check-in stats
            queryClient.invalidateQueries({ queryKey: queryKeys.members.detail(variables.memberId) });
        },
    });
}
