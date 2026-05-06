import type { ApiError } from '@/api/errors';
import type {
  EmailVerificationState,
  EmailVerificationSendErrorReason,
  EmailVerificationVerifyErrorReason,
} from '@/features/signup/types';

export const EMAIL_VERIFICATION_MESSAGES = {
  alreadyRegistered: '이미 가입된 이메일입니다.',
  campusNotFound: '학교 정보를 찾을 수 없습니다. 학교를 다시 선택해주세요.',
  codeNotFound: '유효시간이 만료되었습니다. 인증코드를 다시 전송해주세요.',
  codeSent: '인증코드를 발송했습니다. 메일함을 확인해주세요.',
  codeVerified: '이메일 인증이 완료되었습니다.',
  cooldown: '이메일은 10초 후 다시 요청할 수 있어요.',
  domainMismatch: '학교 이메일 도메인을 확인해주세요.',
  ipBlocked: '보안을 위해 메일 발송이 일시적으로 제한되었습니다. 30분 뒤에 다시 시도해주세요.',
  invalidCode: '인증코드가 올바르지 않습니다.',
  invalidEmail: '올바른 학교 이메일 형식을 입력해주세요.',
  sendFailed: '이메일 발송에 실패했습니다. 잠시 후 다시 시도해주세요.',
  sendVerifyBlocked: '같은 이메일 주소로는 10분 동안 인증번호를 다시 보낼 수 없습니다. 이메일이 정확한지 확인해주세요.',
  verifyBlocked: '이메일을 다시 확인해주세요. 스팸메일함도 함께 확인한 뒤 10분 후 다시 시도해주세요.',
  unknown: '처리 중 문제가 발생했습니다. 다시 시도해주세요.',
} as const;

type EmailVerificationErrorModal = {
  confirmLabel?: string;
  description: string;
  scope: 'send' | 'verify';
  title: string;
};

export function createSchoolEmail(emailLocalPart: string, emailDomain: string) {
  return `${emailLocalPart.trim()}@${emailDomain.trim()}`;
}

export function normalizeEmailForComparison(email: string) {
  return email.trim().toLowerCase();
}

export function isSameEmailForComparison(currentEmail: string, targetEmail: string) {
  return normalizeEmailForComparison(currentEmail) === normalizeEmailForComparison(targetEmail);
}

export function isValidSchoolEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

type SendErrorMatchRule = {
  code: string;
  reason: EmailVerificationSendErrorReason;
  status: number;
};

type VerifyErrorMatchRule = {
  code: string;
  reason: EmailVerificationVerifyErrorReason;
  status: number;
};

const SEND_ERROR_RULES: readonly SendErrorMatchRule[] = [
  { code: 'DUPLICATE_EMAIL', reason: 'already_registered', status: 409 },
  { code: 'DOMAIN_MISMATCH', reason: 'domain_mismatch', status: 400 },
  { code: 'EMAIL_SEND_COOLDOWN', reason: 'resend_cooldown', status: 429 },
  { code: 'IP_BLOCKED', reason: 'ip_blocked', status: 429 },
  { code: 'EMAIL_VERIFY_BLOCKED', reason: 'verify_blocked', status: 429 },
  { code: 'EMAIL_SEND_ERROR', reason: 'send_failed', status: 500 },
  { code: 'CAMPUS_NOT_FOUND', reason: 'campus_not_found', status: 404 },
];

const VERIFY_ERROR_RULES: readonly VerifyErrorMatchRule[] = [
  { code: 'EMAIL_CODE_INVALID', reason: 'invalid_code', status: 400 },
  { code: 'EMAIL_CODE_NOT_FOUND', reason: 'code_not_found', status: 410 },
  { code: 'EMAIL_VERIFY_BLOCKED', reason: 'verify_blocked', status: 429 },
];

const SEND_STATUS_FALLBACKS: Readonly<Record<number, EmailVerificationSendErrorReason>> = {
  400: 'domain_mismatch',
  404: 'campus_not_found',
  409: 'already_registered',
  429: 'ip_blocked',
  500: 'send_failed',
};

const VERIFY_STATUS_FALLBACKS: Readonly<Record<number, EmailVerificationVerifyErrorReason>> = {
  400: 'invalid_code',
  410: 'code_not_found',
  429: 'verify_blocked',
};

function matchesRule(code: string, status: number | null, rule: SendErrorMatchRule | VerifyErrorMatchRule) {
  return rule.code === code && rule.status === status;
}

function getFallbackUnknownMessage(error: ApiError) {
  return error.message?.trim() || EMAIL_VERIFICATION_MESSAGES.unknown;
}

export function mapSendEmailVerificationError(error: ApiError) {
  const matchedReason =
    SEND_ERROR_RULES.find((rule) => matchesRule(error.code, error.status, rule))?.reason ??
    (error.status != null ? SEND_STATUS_FALLBACKS[error.status] : undefined) ??
    'unknown';

  return {
    message: matchedReason === 'unknown' ? getFallbackUnknownMessage(error) : getSendEmailVerificationErrorMessage(matchedReason),
    reason: matchedReason,
  };
}

export function mapVerifyEmailVerificationError(error: ApiError) {
  const matchedReason =
    VERIFY_ERROR_RULES.find((rule) => matchesRule(error.code, error.status, rule))?.reason ??
    (error.status != null ? VERIFY_STATUS_FALLBACKS[error.status] : undefined) ??
    'unknown';

  return {
    message: matchedReason === 'unknown' ? getFallbackUnknownMessage(error) : getVerifyEmailVerificationErrorMessage(matchedReason),
    reason: matchedReason,
  };
}

export function getSendEmailVerificationErrorMessage(reason: EmailVerificationSendErrorReason) {
  switch (reason) {
    case 'invalid_email':
      return EMAIL_VERIFICATION_MESSAGES.invalidEmail;
    case 'already_registered':
      return EMAIL_VERIFICATION_MESSAGES.alreadyRegistered;
    case 'campus_not_found':
      return EMAIL_VERIFICATION_MESSAGES.campusNotFound;
    case 'domain_mismatch':
      return EMAIL_VERIFICATION_MESSAGES.domainMismatch;
    case 'resend_cooldown':
      return EMAIL_VERIFICATION_MESSAGES.cooldown;
    case 'ip_blocked':
      return EMAIL_VERIFICATION_MESSAGES.ipBlocked;
    case 'verify_blocked':
      return EMAIL_VERIFICATION_MESSAGES.sendVerifyBlocked;
    case 'send_failed':
      return EMAIL_VERIFICATION_MESSAGES.sendFailed;
    default:
      return EMAIL_VERIFICATION_MESSAGES.unknown;
  }
}

export function getVerifyEmailVerificationErrorMessage(reason: EmailVerificationVerifyErrorReason) {
  switch (reason) {
    case 'invalid_email':
      return EMAIL_VERIFICATION_MESSAGES.invalidEmail;
    case 'invalid_code':
      return EMAIL_VERIFICATION_MESSAGES.invalidCode;
    case 'code_not_found':
      return EMAIL_VERIFICATION_MESSAGES.codeNotFound;
    case 'verify_blocked':
      return EMAIL_VERIFICATION_MESSAGES.verifyBlocked;
    default:
      return EMAIL_VERIFICATION_MESSAGES.unknown;
  }
}

function getEmailVerificationErrorModalTitle(reason: EmailVerificationSendErrorReason | EmailVerificationVerifyErrorReason | null) {
  switch (reason) {
    case 'ip_blocked':
      return '이메일 인증번호 횟수 초과';
    case 'verify_blocked':
      return '인증번호 확인 횟수 초과';
    default:
      return '에러';
  }
}

export function getEmailVerificationErrorModal(
  verification: EmailVerificationState,
): EmailVerificationErrorModal | null {
  if (
    verification.send.status === 'error' &&
    verification.send.errorMessage &&
    verification.send.errorReason !== 'already_registered' &&
    verification.send.errorReason !== 'resend_cooldown'
  ) {
    return {
      confirmLabel: verification.send.errorReason === 'ip_blocked' ? '처음으로' : '확인',
      description: verification.send.errorMessage,
      scope: 'send',
      title: getEmailVerificationErrorModalTitle(verification.send.errorReason),
    };
  }

  if (
    verification.verify.status === 'error' &&
    verification.verify.errorMessage &&
    verification.verify.errorReason !== 'invalid_code' &&
    verification.verify.errorReason !== 'code_not_found'
  ) {
    return {
      confirmLabel: '확인',
      description: verification.verify.errorMessage,
      scope: 'verify',
      title: getEmailVerificationErrorModalTitle(verification.verify.errorReason),
    };
  }

  return null;
}
