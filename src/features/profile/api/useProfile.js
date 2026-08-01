import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/api';
import { queryKeys } from '@/lib/react-query/queryKeys';
import { useAuth } from '@/features/auth/context/AuthContext';

export function useProfile(options = {}) {
  const { user } = useAuth();
  const { enabled = true, ...rest } = options;

  return useQuery({
    queryKey: [...queryKeys.profile, user?.id ?? 'guest'],
    queryFn: () => api.getProfile(),
    enabled: Boolean(user) && enabled,
    ...rest,
  });
}
