import { useQuery } from '@tanstack/react-query';

import { mypageApi } from '@/api';

export const MY_PAGE_SCRAP_FOLDER_QUERY_KEY = ['mypage', 'scrap-folder'] as const;

export function getMyPageScrapFolderScrapsQueryKey(folderId: number | null) {
  return [...MY_PAGE_SCRAP_FOLDER_QUERY_KEY, folderId, 'scraps'] as const;
}

export function useMyPageScrapFolderScraps(folderId: number | null) {
  return useQuery({
    enabled: folderId !== null,
    queryFn: async () => {
      if (folderId === null) {
        throw new Error('유효한 스크랩 폴더 ID가 필요합니다.');
      }

      const response = await mypageApi.getFolderScraps(folderId);

      return response.data;
    },
    queryKey: getMyPageScrapFolderScrapsQueryKey(folderId),
    retry: false,
  });
}
