import type { EmailVerificationState, SignupForm, SignupPayload } from '@/features/signup/types';

export function buildSignupPayload(form: SignupForm, emailVerification: EmailVerificationState): SignupPayload {
  const verifiedToken = emailVerification.verifiedToken.value;

  if (form.departmentId === null) {
    throw new Error('departmentId가 없어 회원가입 요청을 진행할 수 없습니다.');
  }

  if (!verifiedToken) {
    throw new Error('verifiedToken이 없어 회원가입 요청을 진행할 수 없습니다.');
  }

  return {
    departmentId: form.departmentId,
    admissionYear: form.admissionYear,
    username: form.username,
    password: form.password,
    nickname: form.nickname,
    verifiedToken,
  };
}
