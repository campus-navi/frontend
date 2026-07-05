import { useQuery } from '@tanstack/react-query';

import { studioApi } from '@/api';

export const STUDIO_DOCUMENTS_QUERY_KEY = ['studio', 'documents'] as const;

export function useStudioDocuments() {
  return useQuery({
    queryFn: async () => {
      const response = await studioApi.getDocuments();

      return response.data;
    },
    queryKey: STUDIO_DOCUMENTS_QUERY_KEY,
    retry: false,
  });
}
