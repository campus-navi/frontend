import { useMutation, useQueryClient } from '@tanstack/react-query';

import { mypageApi, type RemoveScrapsFromFolderRequest } from '@/api';
import { getMyPageScrapFolderScrapsQueryKey } from '@/features/mypage/hooks/useMyPageScrapFolderScraps';
import { MY_PAGE_SCRAPS_QUERY_KEY } from '@/features/mypage/hooks/useMyPageScraps';
import { SCRAP_FOLDERS_QUERY_KEY } from '@/features/mypage/hooks/useScrapFolders';

type RemoveFolderScrapsMutationVariables = {
  folderId: number;
  request: RemoveScrapsFromFolderRequest;
};

export function useRemoveFolderScraps() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ folderId, request }: RemoveFolderScrapsMutationVariables) => {
      const response = await mypageApi.removeScrapsFromFolder(folderId, request);

      return response.data;
    },
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({
        queryKey: getMyPageScrapFolderScrapsQueryKey(variables.folderId),
      });
      void queryClient.invalidateQueries({ queryKey: MY_PAGE_SCRAPS_QUERY_KEY });
      void queryClient.invalidateQueries({ queryKey: SCRAP_FOLDERS_QUERY_KEY });
    },
  });
}
