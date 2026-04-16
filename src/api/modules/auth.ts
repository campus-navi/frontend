import { apiConfig } from '@/api/config';
import { request } from '@/api/client';
import type { ApiObjectData } from '@/api/types';

export interface LoginPayload extends ApiObjectData {
  password: string;
  username: string;
}

export interface SendSignupEmailVerificationPayload extends ApiObjectData {
  campusId: number;
  email: string;
}

export interface VerifySignupEmailCodePayload extends ApiObjectData {
  code: string;
  email: string;
}

export interface VerifySignupEmailCodeResponseData extends ApiObjectData {
  verifiedToken: string;
}

export const authApi = {
  getMe<TData extends ApiObjectData = ApiObjectData>() {
    return request<TData>({
      method: 'get',
      url: '/auth/me',
    });
  },
  login<TData extends ApiObjectData = ApiObjectData>(payload: LoginPayload) {
    return request<TData>({
      data: payload,
      method: 'post',
      requiresAuth: false,
      url: '/auth/login',
    });
  },
  logout<TData extends ApiObjectData = ApiObjectData>() {
    return request<TData>({
      method: 'post',
      url: '/auth/logout',
    });
  },
  sendSignupEmailVerification(payload: SendSignupEmailVerificationPayload) {
    return request<null>({
      data: payload,
      method: 'post',
      requiresAuth: false,
      url: '/auth/email/send',
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
  reissueAccessToken<TData extends ApiObjectData = ApiObjectData>(refreshToken: string) {
    return request<TData>({
      headers: {
        Authorization: `Bearer ${refreshToken}`,
        'X-Refresh-Token': refreshToken,
      },
      method: 'post',
      requiresAuth: false,
      skipAuthRefresh: true,
      url: apiConfig.refreshPath,
    });
  },
};
