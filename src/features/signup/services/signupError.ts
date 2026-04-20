import { COMMON_ERROR_CODES } from '@/api/constants/errorCodes';
import type { ApiError } from '@/api/errors';

const DUPLICATE_SIGNUP_ERROR_CODES = new Set([
  'DUPLICATE_USERNAME',
  'DUPLICATE_EMAIL',
  'DUPLICATE_NICKNAME',
]);

const VERIFIED_TOKEN_EXPIRED_CODES = new Set([
  'VERIFIED_TOKEN_EXPIRED',
  'SIGNUP_VERIFIED_TOKEN_EXPIRED',
  'EMAIL_VERIFIED_TOKEN_EXPIRED',
  'EMAIL_VERIFY_TOKEN_EXPIRED',
  'EMAIL_NOT_VERIFIED',
]);

export type SignupSubmitErrorAction =
  | {
      type: 'duplicate_restart';
      title: string;
      description: string;
    }
  | {
      type: 'verification_expired';
      title: string;
      description: string;
    }
  | {
      type: 'retryable';
      title: string;
      description: string;
    };

function isVerifiedTokenExpiredError(error: ApiError) {
  if (VERIFIED_TOKEN_EXPIRED_CODES.has(error.code)) {
    return true;
  }

  if (error.status !== 401 && error.status !== 403 && error.status !== 410) {
    return false;
  }

  return error.code.includes('VERIFIED_TOKEN') || error.code.includes('VERIFY_TOKEN');
}

export function mapSignupSubmitError(error: ApiError): SignupSubmitErrorAction {
  if (error.status === 409 && DUPLICATE_SIGNUP_ERROR_CODES.has(error.code)) {
    return {
      type: 'duplicate_restart',
      title: '회원가입 정보를 다시 확인해주세요',
      description: '이미 사용 중인 정보가 있어 처음 단계부터 다시 진행해주세요.',
    };
  }

  if (isVerifiedTokenExpiredError(error)) {
    return {
      type: 'duplicate_restart',
      title: '이메일 인증이 만료되었습니다',
      description: '인증 정보가 만료되어 처음 단계부터 다시 진행해주세요.',
    };
  }

  if (error.code === COMMON_ERROR_CODES.NETWORK_ERROR || error.status === null || (error.status !== null && error.status >= 500)) {
    return {
      type: 'retryable',
      title: '회원가입에 실패했습니다',
      description: '일시적인 오류가 발생했습니다. 입력한 내용은 유지되며 잠시 후 다시 시도할 수 있습니다.',
    };
  }

  return {
    type: 'retryable',
    title: '회원가입에 실패했습니다',
    description: '처리 중 문제가 발생했습니다. 입력한 내용은 유지되며 다시 시도할 수 있습니다.',
  };
}
