import { useQuery } from '@tanstack/react-query';

import { universityApi } from '@/api';

export function useUniversitySearch() {
  return useQuery({
    queryFn: () => universityApi.getAll(),
    queryKey: ['signup', 'universities'],
  });
}
