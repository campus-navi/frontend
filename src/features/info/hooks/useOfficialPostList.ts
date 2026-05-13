import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { officialPostApi, type OfficialPostListParams } from '@/api';

export function useOfficialPostList(params: OfficialPostListParams) {
  const { cursor, sort, tagCode } = params;

  return useQuery({
    queryFn: async () => {
      const response = await officialPostApi.list(params);

      return response.data;
    },
    queryKey: ['info', 'officialPostList', { cursor, sort, tagCode }],
    placeholderData: keepPreviousData,
  });
}
