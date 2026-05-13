import { useQuery } from '@tanstack/react-query';

import { officialPostApi } from '@/api';

export function getOfficialPostDetailQueryKey(postId: number | null) {
  return ['info', 'officialPostDetail', postId] as const;
}

export function useOfficialPostDetail(postId: number | null) {
  return useQuery({
    enabled: postId !== null,
    queryFn: async () => {
      if (postId === null) {
        throw new Error('postId가 필요합니다.');
      }

      const response = await officialPostApi.getDetail(postId);

      return response.data;
    },
    queryKey: getOfficialPostDetailQueryKey(postId),
  });
}
