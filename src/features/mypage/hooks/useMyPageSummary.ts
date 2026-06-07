import { useQuery } from '@tanstack/react-query';

import { mypageApi } from '@/api';

export const MY_PAGE_SUMMARY_QUERY_KEY = ['mypage', 'summary'] as const;

export function useMyPageSummary() {
  return useQuery({
    queryFn: async () => {
      const response = await mypageApi.getSummary();

      return response.data;
    },
    queryKey: MY_PAGE_SUMMARY_QUERY_KEY,
    retry: false,
  });
}
