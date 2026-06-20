import { useMutation, useQueryClient } from '@tanstack/react-query';

import { mypageApi, type CreateScrapFolderRequest } from '@/api';
import { MY_PAGE_SCRAPS_QUERY_KEY } from '@/features/mypage/hooks/useMyPageScraps';
import { SCRAP_FOLDERS_QUERY_KEY } from '@/features/mypage/hooks/useScrapFolders';

export function useCreateScrapFolder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (request: CreateScrapFolderRequest) => {
      const response = await mypageApi.createScrapFolder(request);

      return response.data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: MY_PAGE_SCRAPS_QUERY_KEY });
      void queryClient.invalidateQueries({ queryKey: SCRAP_FOLDERS_QUERY_KEY });
    },
  });
}
