import { request } from '@/api/client';
import { COMMON_ERROR_CODES } from '@/api/constants/errorCodes';
import { createApiError } from '@/api/errors';
import type { ApiObjectData } from '@/api/types';

export type AcademicPlanType =
  | 'DOUBLE_MAJOR'
  | 'COMPLEX_MAJOR'
  | 'CONVERGENCE_MAJOR'
  | 'STUDENT_DESIGN';

export interface AcademicPlanTargetOption extends ApiObjectData {
  id: number;
  name: string;
}

interface AcademicPlanTargetOptionResponse extends ApiObjectData {
  id?: number | string;
  name?: string;
}

function normalizeAcademicPlanTargetOption(
  item: AcademicPlanTargetOptionResponse,
): AcademicPlanTargetOption {
  const targetId = item.id;
  const targetName = item.name;

  if ((typeof targetId !== 'number' && typeof targetId !== 'string') || typeof targetName !== 'string') {
    throw createApiError({
      code: COMMON_ERROR_CODES.INVALID_RESPONSE,
      message: '학업계획서 대상 목록 응답 형식이 올바르지 않습니다.',
      status: 200,
    });
  }

  return {
    id: Number(targetId),
    name: targetName,
  };
}

export function isDepartmentPlanType(type: AcademicPlanType) {
  return type === 'DOUBLE_MAJOR' || type === 'COMPLEX_MAJOR';
}

export const academicPlanApi = {
  async getTargetCampuses() {
    const response = await request<AcademicPlanTargetOptionResponse[]>({
      method: 'get',
      url: '/academic-plans/target/campuses',
    });

    return {
      ...response,
      data: response.data.map(normalizeAcademicPlanTargetOption),
    };
  },
  async getTargetDepartments(campusId: number | string, type: Extract<AcademicPlanType, 'DOUBLE_MAJOR' | 'COMPLEX_MAJOR'>) {
    const response = await request<AcademicPlanTargetOptionResponse[]>({
      method: 'get',
      params: { type },
      url: `/academic-plans/target/campuses/${campusId}/departments`,
    });

    return {
      ...response,
      data: response.data.map(normalizeAcademicPlanTargetOption),
    };
  },
  async getTargetMajors(campusId: number | string, type: Extract<AcademicPlanType, 'CONVERGENCE_MAJOR' | 'STUDENT_DESIGN'>) {
    const response = await request<AcademicPlanTargetOptionResponse[]>({
      method: 'get',
      params: { type },
      url: `/academic-plans/target/campuses/${campusId}/majors`,
    });

    return {
      ...response,
      data: response.data.map(normalizeAcademicPlanTargetOption),
    };
  },
};
