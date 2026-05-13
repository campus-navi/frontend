import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { officialPostApi, type OfficialPostListParams } from '@/api';

type UseOfficialPostListOptions = {
  enabled?: boolean;
  placeholderData?: 'keep' | 'keepSameQuery' | 'none';
};

export function useOfficialPostList(
  params: OfficialPostListParams,
  options: UseOfficialPostListOptions = {},
) {
  const { cursor, q, sort, tagCode } = params;
  const placeholderData = options.placeholderData ?? 'keep';

  return useQuery({
    enabled: options.enabled,
    queryFn: async () => {
      const response = await officialPostApi.list(params);

      return response.data;
    },
    queryKey: ['info', 'officialPostList', { cursor, q, sort, tagCode }],
    placeholderData:
      placeholderData === 'none'
        ? undefined
        : placeholderData === 'keepSameQuery'
          ? (previousData, previousQuery) => {
              const previousParams = previousQuery?.queryKey[2];
              const previousQueryText =
                typeof previousParams === 'object' && previousParams !== null && 'q' in previousParams
                  ? previousParams.q
                  : undefined;

              return previousQueryText === q ? previousData : undefined;
            }
          : keepPreviousData,
  });
}
