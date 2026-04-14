import { request } from '@/api/client';
import type { ApiObjectData } from '@/api/types';

export const userApi = {
  getProfile<TData extends ApiObjectData = ApiObjectData>(userId: number | string) {
    return request<TData>({
      method: 'get',
      url: `/users/${userId}`,
    });
  },
};
