import { useQuery } from '@tanstack/react-query';

import { officialPostApi, type OfficialPostListParams } from '@/api';

const DEFAULT_OFFICIAL_POST_LIST_PARAMS = {
  sort: 'LATEST',
} satisfies OfficialPostListParams;

export function useOfficialPostList(params: OfficialPostListParams = DEFAULT_OFFICIAL_POST_LIST_PARAMS) {
  return useQuery({
    queryFn: async () => {
      const response = await officialPostApi.list(params);

      return response.data;
    },
    queryKey: ['info', 'officialPostList', params],
  });
}
