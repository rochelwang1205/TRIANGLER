import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api/api';
import { queryKeys } from '@/lib/react-query/queryKeys';
import { useAuth } from '@/features/auth/context/AuthContext';

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const { login } = useAuth();

  return useMutation({
    mutationFn: (data) => api.updateProfile(data),
    onSuccess: (profile) => {
      const token = localStorage.getItem('token');
      login(profile.user, token);
      queryClient.invalidateQueries({ queryKey: queryKeys.profile });
    },
  });
}

export function useUpdatePassword() {
  return useMutation({
    mutationFn: (data) => api.updatePassword(data),
  });
}
