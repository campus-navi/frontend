import { useQuery } from '@tanstack/react-query';

import { memberApi } from '@/api';

export function useMemberMe() {
  return useQuery({
    queryFn: async () => {
      const response = await memberApi.getMe();

      return response.data;
    },
    queryKey: ['members', 'me'],
    retry: false,
  });
}
