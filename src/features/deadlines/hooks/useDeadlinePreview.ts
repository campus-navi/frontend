import { useQuery } from '@tanstack/react-query';

import { feedApi } from '@/api';

export function useDeadlinePreview() {
  return useQuery({
    queryFn: async () => {
      const response = await feedApi.getDeadlinePreview();

      return response.data;
    },
    queryKey: ['home', 'deadlinePreview'],
  });
}
