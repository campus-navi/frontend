import { request } from '@/api/client';
import type { ApiListData, ApiObjectData } from '@/api/types';

export interface PostSummary extends ApiObjectData {
  id: number | string;
  title: string;
}

export const postApi = {
  list(params?: Record<string, unknown>) {
    return request<ApiListData<PostSummary>>({
      method: 'get',
      params,
      url: '/posts',
    });
  },
};
