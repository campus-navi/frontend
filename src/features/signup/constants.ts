export const admissionYears = Array.from({ length: 18 }, (_, index) => 2018 + index);

export const signupEmailVerificationPolicy = {
  codeExpiresInMs: 10 * 60 * 1000,
  ipBlockedMs: 30 * 60 * 1000,
  resendCooldownMs: 10 * 1000,
  verifyBlockedMs: 10 * 60 * 1000,
  verifyMaxAttempts: 5,
  verifiedTokenExpiresInMs: 10 * 60 * 1000,
} as const;
