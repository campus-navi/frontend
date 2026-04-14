import { request } from '@/api/client';
import { COMMON_ERROR_CODES } from '@/api/constants/errorCodes';
import { createApiError } from '@/api/errors';
import { getMockUniversities } from '@/api/mocks/universities';
import type { ApiListData, ApiObjectData } from '@/api/types';

export interface UniversitySummary extends ApiObjectData {
  campusId: number | string;
  emailDomain?: string;
  universityName: string;
}

interface UniversitySummaryResponse extends ApiObjectData {
  campusId?: number | string;
  emailDomain?: string | null;
  id?: number | string;
  name?: string;
  universityName?: string;
}

function normalizeUniversitySummary(item: UniversitySummaryResponse): UniversitySummary {
  const campusId = item.campusId ?? item.id;
  const universityName = item.universityName ?? item.name;

  if ((typeof campusId !== 'number' && typeof campusId !== 'string') || typeof universityName !== 'string') {
    throw createApiError({
      code: COMMON_ERROR_CODES.INVALID_RESPONSE,
      message: '대학 목록 응답 형식이 올바르지 않습니다.',
      status: 200,
    });
  }

  return {
    campusId,
    ...(typeof item.emailDomain === 'string' && item.emailDomain ? { emailDomain: item.emailDomain } : {}),
    universityName,
  };
}

function normalizeKeyword(value: unknown) {
  if (typeof value !== 'string') {
    return '';
  }

  return value
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(/[()]/g, '');
}

function filterMockUniversities(params?: Record<string, unknown>) {
  const keyword = normalizeKeyword(params?.keyword);
  const universities = getMockUniversities();

  if (!keyword) {
    return universities;
  }

  return universities.filter((university) => normalizeKeyword(university.universityName).includes(keyword));
}

function createMockUniversityResponse(params?: Record<string, unknown>) {
  const content = filterMockUniversities(params);

  return {
    code: 'UNIVERSITY_SEARCH_SUCCESS',
    data: {
      content,
      hasNext: false,
      page: 0,
      size: content.length,
      totalElements: content.length,
      totalPages: 1,
    },
    message: '대학 목록을 조회했습니다. (mock)',
    success: true,
  } as const;
}

function shouldUseMockUniversities() {
  return import.meta.env.VITE_USE_MOCK_UNIVERSITIES === 'true';
}

export const universityApi = {
  async getAll() {
    const response = await universityApi.search();

    return response.data.content;
  },
  async search(params?: Record<string, unknown>) {
    if (shouldUseMockUniversities()) {
      return createMockUniversityResponse(params);
    }

    try {
      const response = await request<ApiListData<UniversitySummaryResponse>>({
        method: 'get',
        params,
        requiresAuth: false,
        url: '/campuses',
      });

      return {
        ...response,
        data: {
          ...response.data,
          content: response.data.content.map(normalizeUniversitySummary),
        },
      };
    } catch {
      return createMockUniversityResponse(params);
    }
  },
};
