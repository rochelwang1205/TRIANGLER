import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api/api';
import { queryKeys } from '@/lib/react-query/queryKeys';
import { useAuth } from '@/features/auth/context/AuthContext';

export function useTeacherCourses(options = {}) {
  const { user } = useAuth();
  return useQuery({
    queryKey: queryKeys.teacher.courses(user?.id),
    queryFn: () => api.getTeacherCourses(),
    ...options,
  });
}

export function useCreateTeacherCourse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => api.createTeacherCourse(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teacher', 'courses'] });
    },
  });
}

export function useUpdateTeacherCourse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => api.updateTeacherCourse(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teacher', 'courses'] });
    },
  });
}

export function useSubmitTeacherCourse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => api.submitTeacherCourse(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teacher', 'courses'] });
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications });
    },
  });
}

export function useTeacherCourseStudents(courseId, options = {}) {
  return useQuery({
    queryKey: queryKeys.teacher.students(courseId),
    queryFn: () => api.getTeacherCourseStudents(courseId),
    enabled: Boolean(courseId),
    ...options,
  });
}
