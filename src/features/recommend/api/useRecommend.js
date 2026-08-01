import { useQuery, useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api/api';
import { queryKeys } from '@/lib/react-query/queryKeys';

export function useQuizQuestions(options = {}) {
  return useQuery({
    queryKey: queryKeys.quiz,
    queryFn: () => api.getQuizQuestions(),
    ...options,
  });
}

export function useSubmitRecommend(options = {}) {
  return useMutation({
    mutationFn: (answers) => api.submitRecommend(answers),
    ...options,
  });
}
