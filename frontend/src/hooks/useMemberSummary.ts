import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';
import { queryKeys } from '@/lib/queryKeys';

export function useMemberSummary(id: string | null) {
    const memberId = id ?? null;

    return useQuery({
        queryKey: memberId
            ? queryKeys.members.detail(memberId)
            : queryKeys.members.detail('pending'),
        queryFn: async () => {
            if (!memberId) {
                throw new Error('Member ID is required to fetch summary');
            }
            return api.members.getSummary(memberId);
        },
        enabled: !!memberId,
    });
}
