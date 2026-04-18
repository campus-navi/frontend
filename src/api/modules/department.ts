import { request } from '@/api/client';
import { COMMON_ERROR_CODES } from '@/api/constants/errorCodes';
import { createApiError } from '@/api/errors';
import type { ApiListData, ApiObjectData } from '@/api/types';

export interface DepartmentSummary extends ApiObjectData {
  id: number;
  name: string;
}

interface DepartmentSummaryResponse extends ApiObjectData {
  id?: number | string;
  name?: string;
}

function normalizeDepartmentSummary(item: DepartmentSummaryResponse): DepartmentSummary {
  const departmentId = item.id;
  const departmentName = item.name;

  if (
    (typeof departmentId !== 'number' && typeof departmentId !== 'string') ||
    typeof departmentName !== 'string'
  ) {
    throw createApiError({
      code: COMMON_ERROR_CODES.INVALID_RESPONSE,
      message: '학과 목록 응답 형식이 올바르지 않습니다.',
      status: 200,
    });
  }

  return {
    id: Number(departmentId),
    name: departmentName,
  };
}

export const departmentApi = {
  async getByCampusId(campusId: number | string) {
    const response = await request<DepartmentSummaryResponse[]>({
      method: 'get',
      requiresAuth: false,
      url: `/campuses/${campusId}/departments`,
    });

    return {
      ...response,
      data: response.data.map(normalizeDepartmentSummary),
    };
  },
  search(params?: Record<string, unknown>) {
    return request<ApiListData<DepartmentSummary>>({
      method: 'get',
      params,
      requiresAuth: false,
      url: '/departments',
    });
  },
};
