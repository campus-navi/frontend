import { request } from '@/api/client';
import type { ApiListData, ApiObjectData } from '@/api/types';

export interface CommentSummary extends ApiObjectData {
  id: number | string;
  content: string;
}

export const commentApi = {
  listByPost(postId: number | string, params?: Record<string, unknown>) {
    return request<ApiListData<CommentSummary>>({
      method: 'get',
      params,
      url: `/posts/${postId}/comments`,
    });
  },
};
