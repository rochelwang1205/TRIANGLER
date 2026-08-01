import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api/api';
import { queryKeys } from '@/lib/react-query/queryKeys';

export function useAdminStats(options = {}) {
  return useQuery({
    queryKey: queryKeys.admin.stats,
    queryFn: () => api.getAdminStats(),
    ...options,
  });
}

export function useAdminCourses(params = {}, options = {}) {
  return useQuery({
    queryKey: queryKeys.admin.courses(params),
    queryFn: () => api.getAdminCourses(params),
    ...options,
  });
}

export function useReviewCourse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, action, reason }) => api.reviewAdminCourse(id, { action, reason }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'courses'] });
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications });
      queryClient.invalidateQueries({ queryKey: queryKeys.courses.all });
    },
  });
}

export function useAdminOrders(options = {}) {
  return useQuery({
    queryKey: queryKeys.admin.orders,
    queryFn: () => api.getAdminOrders(),
    ...options,
  });
}

export function useUpdateAdminOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }) => api.updateAdminOrder(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.orders });
    },
  });
}

export function useAdminUsers(options = {}) {
  return useQuery({
    queryKey: queryKeys.admin.users,
    queryFn: () => api.getAdminUsers(),
    ...options,
  });
}

export function useUpdateAdminUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => api.updateAdminUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.users });
    },
  });
}

export function useAdminAds(options = {}) {
  return useQuery({
    queryKey: queryKeys.admin.ads,
    queryFn: () => api.getAdminAds(),
    ...options,
  });
}

export function useCreateAdminAd() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => api.createAdminAd(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.ads });
    },
  });
}

export function useUpdateAdminAd() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => api.updateAdminAd(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.ads });
    },
  });
}

export function useDeleteAdminAd() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => api.deleteAdminAd(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.ads });
    },
  });
}
