import { useQuery } from '@tanstack/react-query';

import { feedApi } from '@/api';

export function useFeedCards() {
  return useQuery({
    queryFn: async () => {
      const response = await feedApi.getCards();

      return response.data;
    },
    queryKey: ['home', 'feedCards'],
  });
}
