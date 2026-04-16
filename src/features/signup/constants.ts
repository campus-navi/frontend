export const admissionYears = Array.from({ length: 18 }, (_, index) => 2018 + index);

export const departments = [
  '경영학과',
  '경제학과',
  '국어국문학과',
  '기계공학과',
  '도시공학과',
  '물리학과',
  '미디어학부',
  '법학과',
  '사학과',
  '산업공학과',
  '생명공학과',
  '서어서문학과',
  '소프트웨어학과',
  '수학과',
  '신소재공학과',
  '심리학과',
  '언론정보학과',
  '영어영문학과',
  '의예과',
  '인공지능학과',
  '자유전공학부',
  '전기전자공학부',
  '정치외교학과',
  '정보보호학과',
  '정치시기 학과',
  '정밀시기 학과',
  '정밀기계공학과',
  '철학과',
  '컴퓨터공학과',
  '통계학과',
  '화학과',
  '환경공학과',
] as const;

export const signupEmailVerificationPolicy = {
  codeExpiresInMs: 10 * 60 * 1000,
  ipBlockedMs: 30 * 60 * 1000,
  resendCooldownMs: 10 * 1000,
  verifyBlockedMs: 10 * 60 * 1000,
  verifyMaxAttempts: 5,
  verifiedTokenExpiresInMs: 10 * 60 * 1000,
} as const;

// TODO: 백엔드 정책 확정 후 수정 가능
// - 30분 제한 모달 표시 조건
// - 잠금 종료 시각 반환 여부
// - verifiedToken 만료 시점의 사용자 경험 처리
