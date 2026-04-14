import { AUTH_ERROR_CODES } from '@/api/constants/errorCodes';
import type { ApiError } from '@/api/errors';

export type ErrorCodeMap = Record<string, string>;

export interface UiErrorHandlingOptions {
  alert?: (message: string) => void;
  onSessionExpired?: () => void;
  redirect?: (path: string) => void;
  redirectOnSessionExpiredTo?: string;
  toast?: (message: string) => void;
}

export function resolveDomainErrorMessage(error: ApiError, codeMap?: ErrorCodeMap) {
  return codeMap?.[error.code] ?? error.message;
}

export function handleUiError(error: ApiError, options: UiErrorHandlingOptions = {}) {
  const message = error.message;

  if (
    error.code === AUTH_ERROR_CODES.SESSION_EXPIRED ||
    error.code === AUTH_ERROR_CODES.REFRESH_TOKEN_EXPIRED
  ) {
    options.onSessionExpired?.();

    if (options.redirect && options.redirectOnSessionExpiredTo) {
      options.redirect(options.redirectOnSessionExpiredTo);
    }
  }

  if (options.toast) {
    options.toast(message);
    return message;
  }

  if (options.alert) {
    options.alert(message);
  }

  return message;
}
