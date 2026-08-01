import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/api';
import { queryKeys } from '@/lib/react-query/queryKeys';

export function useFaqCategories(options = {}) {
  return useQuery({
    queryKey: queryKeys.faq,
    queryFn: () => api.getFaqCategories(),
    ...options,
  });
}
