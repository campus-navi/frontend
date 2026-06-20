import { useMutation, useQueryClient } from '@tanstack/react-query';

import { mypageApi, type UpdateScrapFolderRequest } from '@/api';
import { MY_PAGE_SCRAPS_QUERY_KEY } from '@/features/mypage/hooks/useMyPageScraps';
import { SCRAP_FOLDERS_QUERY_KEY } from '@/features/mypage/hooks/useScrapFolders';

type UpdateScrapFolderMutationVariables = {
  folderId: number;
  request: UpdateScrapFolderRequest;
};

export function useUpdateScrapFolder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ folderId, request }: UpdateScrapFolderMutationVariables) => {
      const response = await mypageApi.updateScrapFolder(folderId, request);

      return response.data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: MY_PAGE_SCRAPS_QUERY_KEY });
      void queryClient.invalidateQueries({ queryKey: SCRAP_FOLDERS_QUERY_KEY });
    },
  });
}
