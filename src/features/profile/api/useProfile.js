import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/api';
import { queryKeys } from '@/lib/react-query/queryKeys';

export function useProfile(options = {}) {
  return useQuery({
    queryKey: queryKeys.profile,
    queryFn: () => api.getProfile(),
    ...options,
  });
}
