import { useMutation, useQueryClient } from '@tanstack/react-query';

import { mypageApi } from '@/api';
import { MY_PAGE_SCRAPS_QUERY_KEY } from '@/features/mypage/hooks/useMyPageScraps';
import { SCRAP_FOLDERS_QUERY_KEY } from '@/features/mypage/hooks/useScrapFolders';

export function useDeleteScrapFolder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (folderId: number) => {
      const response = await mypageApi.deleteScrapFolder(folderId);

      return response.data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: MY_PAGE_SCRAPS_QUERY_KEY });
      void queryClient.invalidateQueries({ queryKey: SCRAP_FOLDERS_QUERY_KEY });
    },
  });
}
