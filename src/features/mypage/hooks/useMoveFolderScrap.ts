import { useMutation, useQueryClient } from '@tanstack/react-query';

import { mypageApi } from '@/api';
import { getMyPageScrapFolderScrapsQueryKey } from '@/features/mypage/hooks/useMyPageScrapFolderScraps';
import { MY_PAGE_SCRAPS_QUERY_KEY } from '@/features/mypage/hooks/useMyPageScraps';
import { SCRAP_FOLDERS_QUERY_KEY } from '@/features/mypage/hooks/useScrapFolders';

type MoveFolderScrapMutationVariables = {
  postId: number;
  scrapId: number;
  sourceFolderId: number;
  targetFolderId: number;
};

export function useMoveFolderScrap() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      postId,
      scrapId,
      sourceFolderId,
      targetFolderId,
    }: MoveFolderScrapMutationVariables) => {
      await mypageApi.restoreScrapsToFolder(targetFolderId, {
        postIds: [postId],
      });

      return mypageApi.removeScrapsFromFolder(sourceFolderId, {
        scrapIds: [scrapId],
      });
    },
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({
        queryKey: getMyPageScrapFolderScrapsQueryKey(variables.sourceFolderId),
      });
      void queryClient.invalidateQueries({
        queryKey: getMyPageScrapFolderScrapsQueryKey(variables.targetFolderId),
      });
      void queryClient.invalidateQueries({ queryKey: MY_PAGE_SCRAPS_QUERY_KEY });
      void queryClient.invalidateQueries({ queryKey: SCRAP_FOLDERS_QUERY_KEY });
    },
  });
}
