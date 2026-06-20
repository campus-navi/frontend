import { useQuery } from '@tanstack/react-query';

import { mypageApi, type MyPageScrapFolderSort } from '@/api';

export const SCRAP_FOLDERS_QUERY_KEY = ['scrap-folders'] as const;

export function useScrapFolders(
  sort: MyPageScrapFolderSort = 'RECENT_SAVED',
) {
  return useQuery({
    queryFn: async () => {
      const response = await mypageApi.getScrapFolders(sort);

      return response.data;
    },
    queryKey: [...SCRAP_FOLDERS_QUERY_KEY, sort],
    retry: false,
    staleTime: 0,
  });
}
