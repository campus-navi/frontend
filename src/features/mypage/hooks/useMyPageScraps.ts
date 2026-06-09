import { useQuery } from '@tanstack/react-query';

import { mypageApi } from '@/api';

export const MY_PAGE_SCRAPS_QUERY_KEY = ['mypage', 'scraps'] as const;

export function useMyPageScraps() {
  return useQuery({
    queryFn: async () => {
      const response = await mypageApi.getScraps();

      return response.data;
    },
    queryKey: MY_PAGE_SCRAPS_QUERY_KEY,
    retry: false,
  });
}
