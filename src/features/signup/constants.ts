const CURRENT_YEAR = new Date().getFullYear();
const ADMISSION_YEAR_START = 1980;
const ADMISSION_YEAR_END = CURRENT_YEAR + 1;

export const defaultAdmissionYear = CURRENT_YEAR;
export const admissionYears = Array.from(
  { length: ADMISSION_YEAR_END - ADMISSION_YEAR_START + 1 },
  (_, index) => ADMISSION_YEAR_START + index,
);

export const signupEmailVerificationPolicy = {
  codeExpiresInMs: 10 * 60 * 1000,
  ipBlockedMs: 30 * 60 * 1000,
  resendCooldownMs: 10 * 1000,
  verifyBlockedMs: 10 * 60 * 1000,
  verifyMaxAttempts: 5,
  verifiedTokenExpiresInMs: 10 * 60 * 1000,
} as const;

export const signupUsernamePolicy = {
  checkDebounceMs: 500,
  maxLength: 30,
  minLength: 4,
} as const;

export const signupNicknamePolicy = {
  checkDebounceMs: 500,
  maxLength: 20,
  minLength: 2,
} as const;

export const signupPasswordPolicy = {
  maxLength: 16,
  minLength: 8,
} as const;

export const signupValidationFeedbackClassNames = {
  border: {
    default: 'border-[#DCDFE2] focus-within:border-[#292B2C]',
    error: 'border-[#FF5E47] focus-within:border-[#FF5E47]',
  },
  helperText: {
    default: 'text-[#565656]',
    error: 'text-[#FF5E47]',
    success: 'text-[#5B82F5] opacity-80',
  },
} as const;
