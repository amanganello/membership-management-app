import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';
import { queryKeys } from '@/lib/queryKeys';
import type { CreateMemberDto } from '@memberapp/shared';

export function useMembers(search?: string) {
    const hasSearch = !!search && search.trim().length > 0;

    return useQuery({
        queryKey: queryKeys.members.list(search),
        queryFn: () => api.members.list(search),
        // For search queries, always treat data as stale so we refetch
        // on key changes or remounts instead of relying on 1-minute cache.
        ...(hasSearch ? { staleTime: 0 } : {}),
    });
}

export function useCreateMember() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateMemberDto) => api.members.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.members.all });
        },
    });
}
