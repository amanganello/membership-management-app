import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';
import { queryKeys } from '@/lib/queryKeys';
import type { CreateMemberDto } from '@memberapp/shared';

export function useMembers(search?: string) {
    return useQuery({
        queryKey: queryKeys.members.list(search),
        queryFn: () => api.members.list(search),
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
