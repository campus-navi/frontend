import { useQuery } from '@tanstack/react-query';

import { departmentApi } from '@/api';

export function useDepartmentSearch(campusId: number | string | null | undefined) {
  return useQuery({
    enabled: campusId !== null && campusId !== undefined && `${campusId}`.length > 0,
    queryFn: async () => {
      const response = await departmentApi.getByCampusId(campusId as number | string);

      return response.data;
    },
    queryKey: ['signup', 'departments', campusId],
  });
}
