import { useQuery } from '@tanstack/react-query';

import { memberApi } from '@/api';
import { MEMBER_ME_QUERY_KEY } from '@/features/home/memberMeQueryKey';

export function useMemberMe() {
  return useQuery({
    queryFn: async () => {
      const response = await memberApi.getMe();

      return response.data;
    },
    queryKey: MEMBER_ME_QUERY_KEY,
    retry: false,
  });
}
