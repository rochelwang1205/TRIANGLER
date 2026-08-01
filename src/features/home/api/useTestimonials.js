import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/api';
import { queryKeys } from '@/lib/react-query/queryKeys';

export function useTestimonials(options = {}) {
  return useQuery({
    queryKey: queryKeys.testimonials,
    queryFn: () => api.getTestimonials(),
    ...options,
  });
}
