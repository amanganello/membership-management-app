import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import type { CreateMemberDto } from '@memberapp/shared';

export function useMembers(search?: string) {
    return useQuery({
        queryKey: ['members', search],
        queryFn: () => api.members.list(),
        // Filter client-side for now (backend supports ?q= param)
        select: (members) => {
            if (!search) return members;
            const lowerSearch = search.toLowerCase();
            return members.filter(
                (m) =>
                    m.name.toLowerCase().includes(lowerSearch) ||
                    m.email.toLowerCase().includes(lowerSearch)
            );
        },
    });
}

export function useCreateMember() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateMemberDto) => api.members.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['members'] });
        },
    });
}
