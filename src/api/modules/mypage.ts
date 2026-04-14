import { request } from '@/api/client';
import type { ApiObjectData } from '@/api/types';

export const mypageApi = {
  getSummary<TData extends ApiObjectData = ApiObjectData>() {
    return request<TData>({
      method: 'get',
      url: '/mypage',
    });
  },
};
