import { useQuery } from '@tanstack/react-query';

import { academicPlanApi, isDepartmentPlanType, type AcademicPlanType } from '@/api';

type UseAcademicPlanTargetOptionsParams = {
  campusId: number | null;
  planType: AcademicPlanType | null;
};

export function useAcademicPlanTargetOptions({
  campusId,
  planType,
}: UseAcademicPlanTargetOptionsParams) {
  return useQuery({
    enabled: campusId !== null && planType !== null,
    queryFn: async () => {
      if (campusId === null || planType === null) {
        return [];
      }

      const response = isDepartmentPlanType(planType)
        ? await academicPlanApi.getTargetDepartments(campusId, planType)
        : await academicPlanApi.getTargetMajors(campusId, planType);

      return response.data;
    },
    queryKey: ['academicPlans', 'targetOptions', { campusId, planType }],
  });
}
