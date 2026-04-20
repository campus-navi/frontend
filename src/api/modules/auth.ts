import { apiConfig } from '@/api/config';
import { request } from '@/api/client';
import type { ApiObjectData } from '@/api/types';
import { tokenStorage } from '@/shared/auth';

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
  nickname: string;
  password: string;
  username: string;
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
  async logout<TData extends ApiObjectData = ApiObjectData>() {
    const response = await request<TData>({
      method: 'post',
      withCredentials: true,
      url: '/auth/logout',
    });

    tokenStorage.clearAccessToken();
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
