import type { ReactNode } from 'react';

export const totalSignupSteps = 8;

export type SignupStep = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
export type RequestStatus = 'idle' | 'loading' | 'success' | 'error';
export type UsernameAvailabilityStatus = 'idle' | 'checking' | 'available' | 'duplicate' | 'error';
export type NicknameAvailabilityStatus = 'idle' | 'checking' | 'available' | 'duplicate' | 'error';
export type SignupGrade = 1 | 2 | 3 | 4;

export type SelectedUniversity = {
  campusId: number | string;
  emailDomain?: string;
  universityName: string;
};

export type SignupForm = {
  selectedUniversity: SelectedUniversity | null;
  emailLocalPart: string;
  department: string;
  departmentId: number | null;
  admissionYear: number;
  grade: SignupGrade | null;
  name: string;
  studentNumber: string;
  username: string;
  password: string;
  passwordConfirm: string;
  nickname: string;
};

export type SignupPayload = {
  departmentId: number;
  admissionYear: number;
  grade: SignupGrade;
  name: string;
  studentNumber: string;
  username: string;
  password: string;
  nickname: string;
  verifiedToken: string;
};

export type SignupCompleteSnapshot = {
  admissionYear: number;
  department: string;
  email: string;
  grade: SignupGrade;
  nickname: string;
  universityName: string;
  username: string;
};

export type UsernameValidationResult = {
  isValid: boolean;
  message: string | null;
};

export type PasswordValidationResult = {
  isValid: boolean;
  message: string | null;
  checks: {
    hasLetter: boolean;
    hasNumber: boolean;
    hasSpecialCharacter: boolean;
    hasWhitespace: boolean;
    isLengthValid: boolean;
  };
};

export type NicknameValidationResult = {
  isValid: boolean;
  message: string | null;
};

export type EmailVerificationSendErrorReason =
  | 'invalid_email'
  | 'already_registered'
  | 'domain_mismatch'
  | 'resend_cooldown'
  | 'ip_blocked'
  | 'verify_blocked'
  | 'campus_not_found'
  | 'send_failed'
  | 'unknown';

export type EmailVerificationVerifyErrorReason =
  | 'invalid_email'
  | 'invalid_code'
  | 'code_not_found'
  | 'verify_blocked'
  | 'unknown';

export type EmailVerificationSendState = {
  blockedEndsAt: number | null;
  cooldownEndsAt: number | null;
  errorMessage: string | null;
  errorReason: EmailVerificationSendErrorReason | null;
  expiresAt: number | null;
  lastSentEmail: string | null;
  status: RequestStatus;
};

export type EmailVerificationVerifyState = {
  blockedEndsAt: number | null;
  code: string;
  errorMessage: string | null;
  errorReason: EmailVerificationVerifyErrorReason | null;
  status: RequestStatus;
};

export type VerifiedTokenState = {
  email: string | null;
  expiresAt: number | null;
  isVerified: boolean;
  value: string | null;
};

export type EmailVerificationState = {
  send: EmailVerificationSendState;
  verify: EmailVerificationVerifyState;
  verifiedToken: VerifiedTokenState;
};

export type SignupState = {
  step: SignupStep;
  form: SignupForm;
  universityQuery: string;
  departmentQuery: string;
  emailVerification: EmailVerificationState;
};

export type SearchSelectStepProps = {
  label: string;
  title: ReactNode;
  placeholder: string;
  value: string;
  suggestions: Array<{
    id: number | string;
    label: string;
  }>;
  emptyMessage?: string;
  errorMessage?: string;
  hideEmptyState?: boolean;
  isLoading?: boolean;
  isResultsVisible?: boolean;
  loadingMessage?: string;
  onRetry?: () => void;
  resultsLabel?: string;
  selectedSuggestionId?: number | string | null;
  onChange: (value: string) => void;
  onClear: () => void;
  onSelect: (value: { id: number | string; label: string }) => void;
};
