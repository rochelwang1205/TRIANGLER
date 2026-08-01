import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api/api';
import { queryKeys } from '@/lib/react-query/queryKeys';

export function useCourses(params = {}, options = {}) {
  return useQuery({
    queryKey: queryKeys.courses.list(params),
    queryFn: () => api.getCourses(params),
    ...options,
  });
}

export function useCourse(id, options = {}) {
  return useQuery({
    queryKey: queryKeys.courses.detail(id),
    queryFn: () => api.getCourse(id),
    enabled: Boolean(id),
    ...options,
  });
}

export function useThemes(options = {}) {
  return useQuery({
    queryKey: queryKeys.themes,
    queryFn: () => api.getThemes(),
    ...options,
  });
}

export function usePopularSearches(options = {}) {
  return useQuery({
    queryKey: queryKeys.popularSearches,
    queryFn: () => api.getPopularSearches(),
    ...options,
  });
}

export function useToggleLike() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ courseId, isSaved }) =>
      isSaved ? api.removeLikeGoods(courseId) : api.addLikeGoods(courseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.profile });
    },
  });
}
