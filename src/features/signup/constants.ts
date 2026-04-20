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
