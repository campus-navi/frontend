import { request } from '@/api/client';
import type { ApiListData, ApiObjectData } from '@/api/types';

export interface UniversitySummary extends ApiObjectData {
  id: number | string;
  name: string;
}

export const universityApi = {
  search(params?: Record<string, unknown>) {
    return request<ApiListData<UniversitySummary>>({
      method: 'get',
      params,
      requiresAuth: false,
      url: '/campuses',
    });
  },
};
