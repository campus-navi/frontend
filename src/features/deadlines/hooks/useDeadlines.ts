import { useQuery } from '@tanstack/react-query';

import { feedApi } from '@/api';

export function useDeadlines() {
  return useQuery({
    queryFn: async () => {
      const response = await feedApi.getDeadlines();

      return response.data;
    },
    queryKey: ['feed', 'deadlines'],
  });
}
