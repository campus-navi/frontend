import { useQuery } from '@tanstack/react-query';

import { academicPlanApi } from '@/api';

export function useAcademicPlanTargetCampuses() {
  return useQuery({
    queryFn: async () => {
      const response = await academicPlanApi.getTargetCampuses();

      return response.data;
    },
    queryKey: ['academicPlans', 'targetCampuses'],
  });
}
