import { apiClient, normalizeApiError } from '@/api';
import { validateApiResponse } from '@/api/response';
import type { ApiObjectData, ApiRequestConfig, ApiResponse } from '@/api/types';
import type { SignupPayload } from '@/features/signup/types';
import { extractAccessTokenFromHeaders, tokenStorage } from '@/shared/auth';

export async function submitSignup(payload: SignupPayload) {
  try {
    const response = await apiClient.request({
      data: payload,
      method: 'post',
      requiresAuth: false,
      url: '/auth/signup',
      withCredentials: true,
    } as ApiRequestConfig);
    const accessToken = extractAccessTokenFromHeaders(response.headers);

    validateApiResponse(response.status, response.data as ApiResponse<ApiObjectData>);

    if (!accessToken) {
      throw new Error('회원가입 성공 응답에서 access token을 찾을 수 없습니다.');
    }

    tokenStorage.setAccessToken(accessToken);
  } catch (error) {
    throw normalizeApiError(error);
  }
}
