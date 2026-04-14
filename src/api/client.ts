import axios, { AxiosError, AxiosHeaders, type AxiosInstance, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios';

import { markSessionExpired, resetSessionExpired } from '@/api/auth/session';
import { tokenStorage } from '@/api/auth/tokenStorage';
import { AUTH_ERROR_CODES } from '@/api/constants/errorCodes';
import { apiConfig } from '@/api/config';
import { createApiError, normalizeApiError } from '@/api/errors';
import { validateApiResponse } from '@/api/response';
import type { ApiObjectData, ApiRequestConfig, ApiResponse, ApiSuccessResponse, QueuedRequest } from '@/api/types';

declare module 'axios' {
  interface InternalAxiosRequestConfig {
    _retry?: boolean;
    requiresAuth?: boolean;
    skipAuthRefresh?: boolean;
  }
}

interface RefreshResponseData extends ApiObjectData {
  accessToken?: string;
  refreshToken?: string;
}

const DEFAULT_HEADERS = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
};

const refreshClient = axios.create({
  baseURL: apiConfig.baseURL,
  headers: DEFAULT_HEADERS,
  timeout: apiConfig.timeoutMs,
});

let isRefreshing = false;
let requestQueue: QueuedRequest[] = [];

function applyAccessToken(config: InternalAxiosRequestConfig, accessToken: string) {
  const headers = AxiosHeaders.from(config.headers ?? {});
  headers.set('Authorization', `Bearer ${accessToken}`);
  config.headers = headers;
}

function enqueueRequest(config: InternalAxiosRequestConfig) {
  return new Promise<AxiosResponse>((resolve, reject) => {
    requestQueue.push({
      config,
      reject,
      resolve,
    });
  });
}

function clearQueuedRequests(error: Error) {
  const pendingQueue = [...requestQueue];
  requestQueue = [];

  pendingQueue.forEach(({ reject }) => {
    reject(error);
  });
}

async function replayQueuedRequests(accessToken: string) {
  const pendingQueue = [...requestQueue];
  requestQueue = [];

  await Promise.allSettled(
    pendingQueue.map(async ({ config, reject, resolve }) => {
      try {
        applyAccessToken(config, accessToken);
        const response = await apiClient.request(config);
        resolve(response);
      } catch (error) {
        reject(normalizeApiError(error));
      }
    }),
  );
}

function getRefreshTokenOrThrow() {
  const refreshToken = tokenStorage.getRefreshToken();

  if (!refreshToken) {
    throw createApiError({
      code: AUTH_ERROR_CODES.REFRESH_TOKEN_MISSING,
      message: '리프레시 토큰이 없어 재로그인이 필요합니다.',
      status: 401,
    });
  }

  return refreshToken;
}

function extractAccessToken(data: RefreshResponseData) {
  const accessToken = typeof data.accessToken === 'string' ? data.accessToken : null;

  if (!accessToken) {
    throw createApiError({
      code: AUTH_ERROR_CODES.REFRESH_FAILED,
      message: 'access token 재발급 응답이 올바르지 않습니다.',
      status: 401,
    });
  }

  return accessToken;
}

function shouldRefreshUnauthorizedError(config: InternalAxiosRequestConfig) {
  return config.requiresAuth !== false && !config.skipAuthRefresh && !config._retry;
}

const REFRESH_AUTHENTICATION_ERROR_CODES: ReadonlySet<string> = new Set([
  AUTH_ERROR_CODES.UNAUTHORIZED,
  AUTH_ERROR_CODES.REFRESH_TOKEN_EXPIRED,
  AUTH_ERROR_CODES.REFRESH_TOKEN_MISSING,
]);

function isRefreshAuthenticationFailure(status: number | null, code: string) {
  return status === 401 || status === 403 || REFRESH_AUTHENTICATION_ERROR_CODES.has(code);
}

async function refreshAccessToken() {
  const refreshToken = getRefreshTokenOrThrow();
  const response = await refreshClient.post<ApiSuccessResponse<RefreshResponseData>>(
    apiConfig.refreshPath,
    {},
    {
      headers: {
        Authorization: `Bearer ${refreshToken}`,
        'X-Refresh-Token': refreshToken,
      },
    },
  );
  const validatedResponse = validateApiResponse(response.status, response.data as ApiResponse<RefreshResponseData>);
  const accessToken = extractAccessToken(validatedResponse.data);
  const nextRefreshToken = typeof validatedResponse.data.refreshToken === 'string' ? validatedResponse.data.refreshToken : refreshToken;

  tokenStorage.setTokens({
    accessToken,
    refreshToken: nextRefreshToken,
  });
  resetSessionExpired();

  return accessToken;
}

export const apiClient: AxiosInstance = axios.create({
  baseURL: apiConfig.baseURL,
  headers: DEFAULT_HEADERS,
  timeout: apiConfig.timeoutMs,
});

apiClient.interceptors.request.use((config) => {
  const accessToken = tokenStorage.getAccessToken();

  if (config.requiresAuth !== false && accessToken) {
    applyAccessToken(config, accessToken);
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalConfig = error.config;
    const normalizedError = normalizeApiError(error);

    if (!originalConfig) {
      return Promise.reject(normalizedError);
    }

    if (error.response?.status !== 401 || !shouldRefreshUnauthorizedError(originalConfig)) {
      return Promise.reject(normalizedError);
    }

    originalConfig._retry = true;

    if (isRefreshing) {
      return enqueueRequest(originalConfig);
    }

    isRefreshing = true;

    try {
      const accessToken = await refreshAccessToken();
      await replayQueuedRequests(accessToken);
      applyAccessToken(originalConfig, accessToken);
      return await apiClient.request(originalConfig);
    } catch (refreshError) {
      const normalizedRefreshError = normalizeApiError(refreshError);

      if (!isRefreshAuthenticationFailure(normalizedRefreshError.status, normalizedRefreshError.code)) {
        clearQueuedRequests(normalizedRefreshError);
        return Promise.reject(normalizedRefreshError);
      }

      const sessionExpiredError = createApiError({
        code: AUTH_ERROR_CODES.SESSION_EXPIRED,
        message: '로그인 세션이 만료되었습니다.',
        responseData: null,
        status: 401,
      });

      tokenStorage.clear();
      clearQueuedRequests(sessionExpiredError);
      markSessionExpired(sessionExpiredError);
      return Promise.reject(sessionExpiredError);
    } finally {
      isRefreshing = false;
    }
  },
);

export async function request<TData extends ApiObjectData = ApiObjectData>(config: ApiRequestConfig) {
  const response = await apiClient.request<ApiResponse<TData>>(config);
  return validateApiResponse(response.status, response.data);
}
