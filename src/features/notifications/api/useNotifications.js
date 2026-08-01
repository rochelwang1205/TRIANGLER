import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api/api';
import { queryKeys } from '@/lib/react-query/queryKeys';
import { useAuth } from '@/features/auth/context/AuthContext';

export function useNotifications(options = {}) {
  const { user } = useAuth();
  const { enabled = true, ...rest } = options;

  return useQuery({
    queryKey: [...queryKeys.notifications, user?.id ?? 'guest'],
    queryFn: () => api.getNotifications(),
    enabled: Boolean(user) && enabled,
    ...rest,
  });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => api.markNotificationRead(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.notifications }),
  });
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => api.markAllNotificationsRead(),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.notifications }),
  });
}
