import { COMMON_ERROR_CODES } from '@/api/constants/errorCodes';
import { createApiError } from '@/api/errors';
import type { ApiFailureResponse, ApiObjectData, ApiResponse, ApiSuccessResponse } from '@/api/types';

export function isSuccessResponse<TData extends ApiObjectData>(response: unknown): response is ApiSuccessResponse<TData> {
  if (!response || typeof response !== 'object') {
    return false;
  }

  const success = response as Partial<ApiSuccessResponse<TData>>;

  return Boolean(
    typeof success.code === 'string' &&
      typeof success.message === 'string' &&
      success.data &&
      typeof success.data === 'object' &&
      !Array.isArray(success.data) &&
      success.success !== false,
  );
}

export function isFailureResponse(response: unknown): response is ApiFailureResponse {
  if (!response || typeof response !== 'object') {
    return false;
  }

  const failure = response as Partial<ApiFailureResponse>;
  return failure.success === false && typeof failure.code === 'string' && typeof failure.message === 'string';
}

export function validateApiResponse<TData extends ApiObjectData>(status: number, response: ApiResponse<TData>) {
  if (status >= 200 && status < 300 && isSuccessResponse<TData>(response)) {
    return response;
  }

  if (isFailureResponse(response)) {
    throw createApiError({
      code: response.code,
      message: response.message,
      responseData: response,
      status,
    });
  }

  throw createApiError({
    code: COMMON_ERROR_CODES.INVALID_RESPONSE,
    message: '응답 형식이 올바르지 않습니다.',
    status,
  });
}
