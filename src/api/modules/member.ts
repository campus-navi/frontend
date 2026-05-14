import { request } from '@/api/client';
import { COMMON_ERROR_CODES } from '@/api/constants/errorCodes';
import { createApiError } from '@/api/errors';
import type { ApiObjectData } from '@/api/types';

export interface MemberMe extends ApiObjectData {
  hasSetInterests: boolean;
  nickname: string;
}

export interface UpdateMemberInterestsRequest extends ApiObjectData {
  interestIds: number[];
}

interface MemberMeResponse extends ApiObjectData {
  hasSetInterests?: boolean;
  nickname?: string;
}

function normalizeMemberMe(data: MemberMeResponse): MemberMe {
  if (typeof data.nickname !== 'string' || typeof data.hasSetInterests !== 'boolean') {
    throw createApiError({
      code: COMMON_ERROR_CODES.INVALID_RESPONSE,
      message: '회원 정보 응답 형식이 올바르지 않습니다.',
      status: 200,
    });
  }

  return {
    hasSetInterests: data.hasSetInterests,
    nickname: data.nickname,
  };
}

export const memberApi = {
  async getMe() {
    const response = await request<MemberMeResponse>({
      method: 'get',
      url: '/members/me',
    });

    return {
      ...response,
      data: normalizeMemberMe(response.data),
    };
  },

  async updateInterests(payload: UpdateMemberInterestsRequest) {
    return request<string>({
      data: payload,
      method: 'put',
      url: '/members/me/interests',
    });
  },
};
