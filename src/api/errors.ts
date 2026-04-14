import { AxiosError } from 'axios';

import { COMMON_ERROR_CODES } from '@/api/constants/errorCodes';
import type { ApiFailureResponse, ApiObjectData } from '@/api/types';

interface ApiErrorParams {
  cause?: unknown;
  code: string;
  message: string;
  responseData?: ApiFailureResponse | null;
  status: number | null;
}

export class ApiError extends Error {
  cause?: unknown;
  code: string;
  responseData: ApiFailureResponse | null;
  status: number | null;

  constructor({ cause, code, message, responseData = null, status }: ApiErrorParams) {
    super(message);
    this.name = 'ApiError';
    this.cause = cause;
    this.code = code;
    this.responseData = responseData;
    this.status = status;
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

export function createApiError(params: ApiErrorParams) {
  return new ApiError(params);
}

function normalizeFailureResponse(data: unknown): ApiFailureResponse | null {
  if (!data || typeof data !== 'object') {
    return null;
  }

  const failure = data as Partial<ApiFailureResponse>;

  if (failure.success !== false || typeof failure.code !== 'string' || typeof failure.message !== 'string') {
    return null;
  }

  return {
    code: failure.code,
    data: (failure.data as ApiObjectData | null | undefined) ?? null,
    message: failure.message,
    success: false,
  };
}

function getDefaultErrorCode(axiosCode?: string) {
  if (axiosCode === AxiosError.ERR_NETWORK) {
    return COMMON_ERROR_CODES.NETWORK_ERROR;
  }

  return COMMON_ERROR_CODES.UNKNOWN;
}

export function normalizeApiError(error: unknown) {
  if (isApiError(error)) {
    return error;
  }

  if (error instanceof AxiosError) {
    const status = error.response?.status ?? null;
    const failureResponse = normalizeFailureResponse(error.response?.data);
    const code = failureResponse?.code ?? getDefaultErrorCode(error.code);
    const message = failureResponse?.message ?? error.message ?? '알 수 없는 API 오류가 발생했습니다.';

    return createApiError({
      cause: error,
      code,
      message,
      responseData: failureResponse,
      status,
    });
  }

  if (error instanceof Error) {
    return createApiError({
      cause: error,
      code: COMMON_ERROR_CODES.UNKNOWN,
      message: error.message,
      status: null,
    });
  }

  return createApiError({
    cause: error,
    code: COMMON_ERROR_CODES.UNKNOWN,
    message: '알 수 없는 API 오류가 발생했습니다.',
    status: null,
  });
}
