import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';
import { queryKeys } from '../lib/queryKeys';

export function useMemberSummary(id: string | null) {
    return useQuery({
        queryKey: queryKeys.members.detail(id!),
        queryFn: () => api.members.getSummary(id!),
        enabled: !!id,
    });
}
