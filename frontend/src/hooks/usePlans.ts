import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';

export function usePlans() {
    return useQuery({
        queryKey: ['plans'],
        queryFn: () => api.plans.list(),
        staleTime: 1000 * 60 * 10, // Plans don't change often, cache for 10 min
    });
}
