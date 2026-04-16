import type { ReactNode } from 'react';

export const totalSignupSteps = 7;

export type SignupStep = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
export type RequestStatus = 'idle' | 'loading' | 'success' | 'error';

export type SelectedUniversity = {
  campusId: number | string;
  emailDomain?: string;
  universityName: string;
};

export type SignupForm = {
  selectedUniversity: SelectedUniversity | null;
  emailLocalPart: string;
  department: string;
  admissionYear: number;
  username: string;
  password: string;
  passwordConfirm: string;
  nickname: string;
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
  emailChangedAfterSend: boolean;
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
  suggestions: string[];
  onChange: (value: string) => void;
  onClear: () => void;
  onSelect: (value: string) => void;
};
