import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';

export function useMemberSummary(id: string | null) {
    return useQuery({
        queryKey: ['member', id],
        queryFn: () => api.members.getSummary(id!),
        enabled: !!id,
    });
}
