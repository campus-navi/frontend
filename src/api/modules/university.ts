import { request } from '@/api/client';
import { COMMON_ERROR_CODES } from '@/api/constants/errorCodes';
import { createApiError } from '@/api/errors';
import type { ApiObjectData } from '@/api/types';

export interface UniversitySummary extends ApiObjectData {
  campusId: number | string;
  emailDomain?: string;
  universityName: string;
}

interface UniversitySummaryResponse extends ApiObjectData {
  domain?: string | null;
  id?: number | string;
  name?: string;
}

function normalizeUniversitySummary(item: UniversitySummaryResponse): UniversitySummary {
  const campusId = item.id;
  const universityName = item.name;

  if ((typeof campusId !== 'number' && typeof campusId !== 'string') || typeof universityName !== 'string') {
    throw createApiError({
      code: COMMON_ERROR_CODES.INVALID_RESPONSE,
      message: '대학 목록 응답 형식이 올바르지 않습니다.',
      status: 200,
    });
  }

  return {
    campusId,
    ...(typeof item.domain === 'string' && item.domain ? { emailDomain: item.domain } : {}),
    universityName,
  };
}

export const universityApi = {
  async getAll() {
    const response = await universityApi.search();

    return response.data;
  },
  async search(params?: Record<string, unknown>) {
    const response = await request<UniversitySummaryResponse[]>({
      method: 'get',
      params,
      requiresAuth: false,
      url: '/campuses',
    });

    return {
      ...response,
      data: response.data.map(normalizeUniversitySummary),
    };
  },
};
