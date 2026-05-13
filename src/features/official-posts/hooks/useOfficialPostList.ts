import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { officialPostApi, type OfficialPostListParams } from '@/api';

export function useOfficialPostList(
  params: OfficialPostListParams,
  options: { enabled?: boolean } = {},
) {
  const { cursor, q, sort, tagCode } = params;

  return useQuery({
    enabled: options.enabled,
    queryFn: async () => {
      const response = await officialPostApi.list(params);

      return response.data;
    },
    queryKey: ['info', 'officialPostList', { cursor, q, sort, tagCode }],
    placeholderData: keepPreviousData,
  });
}
