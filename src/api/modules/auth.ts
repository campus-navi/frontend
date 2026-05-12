import { apiConfig } from '@/api/config';
import { apiClient, request } from '@/api/client';
import { validateApiResponse } from '@/api/response';
import type { ApiObjectData, ApiRequestConfig, ApiResponse } from '@/api/types';
import { queryClient } from '@/app/queryClient';
import { MEMBER_ME_QUERY_KEY } from '@/features/home/memberMeQueryKey';
import { resetNoticeInterestPromptDismiss } from '@/features/home/noticeInterestPromptDismissState';
import { extractAccessTokenFromHeaders, tokenStorage } from '@/shared/auth';

export interface LoginPayload extends ApiObjectData {
  password: string;
  username: string;
}

export interface SendSignupEmailVerificationPayload extends ApiObjectData {
  campusId: number;
  email: string;
}

export interface CheckUsernameAvailabilityPayload extends ApiObjectData {
  username: string;
}

export interface CheckNicknameAvailabilityPayload extends ApiObjectData {
  nickname: string;
}

export interface VerifySignupEmailCodePayload extends ApiObjectData {
  code: string;
  email: string;
}

export interface VerifySignupEmailCodeResponseData extends ApiObjectData {
  verifiedToken: string;
}

export interface SignupPayload extends ApiObjectData {
  admissionYear: number;
  departmentId: number;
  grade: 1 | 2 | 3 | 4;
  nickname: string;
  password: string;
  username: string;
  verifiedToken: string;
}

function storeAccessTokenFromHeaders(headers: Parameters<typeof extractAccessTokenFromHeaders>[0], errorMessage: string) {
  const accessToken = extractAccessTokenFromHeaders(headers);

  if (!accessToken) {
    throw new Error(errorMessage);
  }

  tokenStorage.setAccessToken(accessToken);
}

export const authApi = {
  async login<TData extends ApiObjectData = ApiObjectData>(payload: LoginPayload) {
    const response = await apiClient.request<ApiResponse<TData>>({
      data: payload,
      method: 'post',
      requiresAuth: false,
      url: '/auth/login',
    } as ApiRequestConfig);
    const validatedResponse = validateApiResponse(response.status, response.data);

    storeAccessTokenFromHeaders(response.headers, '로그인 성공 응답에서 access token을 찾을 수 없습니다.');
    queryClient.removeQueries({ exact: true, queryKey: MEMBER_ME_QUERY_KEY });
    resetNoticeInterestPromptDismiss();

    return validatedResponse;
  },
  async logout<TData extends ApiObjectData = ApiObjectData>() {
    const response = await request<TData>({
      method: 'post',
      withCredentials: true,
      url: '/auth/logout',
    });

    tokenStorage.clearAccessToken();
    queryClient.removeQueries({ exact: true, queryKey: MEMBER_ME_QUERY_KEY });
    resetNoticeInterestPromptDismiss();
    return response;
  },
  sendSignupEmailVerification(payload: SendSignupEmailVerificationPayload) {
    return request<null>({
      data: payload,
      method: 'post',
      requiresAuth: false,
      url: '/auth/email/send',
    });
  },
  checkUsernameAvailability(payload: CheckUsernameAvailabilityPayload) {
    return request<string>({
      method: 'get',
      params: payload,
      requiresAuth: false,
      url: '/auth/check-username',
    });
  },
  checkNicknameAvailability(payload: CheckNicknameAvailabilityPayload) {
    return request<string>({
      method: 'get',
      params: payload,
      requiresAuth: false,
      url: '/auth/check-nickname',
    });
  },
  verifySignupEmailCode(payload: VerifySignupEmailCodePayload) {
    return request<VerifySignupEmailCodeResponseData>({
      data: payload,
      method: 'post',
      requiresAuth: false,
      url: '/auth/email/verify',
    });
  },
  signup<TData extends ApiObjectData = ApiObjectData>(payload: SignupPayload) {
    return request<TData>({
      data: payload,
      method: 'post',
      requiresAuth: false,
      url: '/auth/signup',
    });
  },
  reissueAccessToken<TData extends ApiObjectData = ApiObjectData>() {
    return request<TData>({
      method: 'post',
      requiresAuth: false,
      skipAuthRefresh: true,
      withCredentials: true,
      url: apiConfig.refreshPath,
    });
  },
};
