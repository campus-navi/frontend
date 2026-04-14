import { request } from '@/api/client';
import type { ApiListData, ApiObjectData } from '@/api/types';

export interface DepartmentSummary extends ApiObjectData {
  id: number | string;
  name: string;
}

export const departmentApi = {
  search(params?: Record<string, unknown>) {
    return request<ApiListData<DepartmentSummary>>({
      method: 'get',
      params,
      requiresAuth: false,
      url: '/departments',
    });
  },
};
