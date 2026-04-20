import { useMemo } from 'react';

import { validateSignupPassword } from '@/features/signup/utils';

const PASSWORD_CONFIRM_DEFAULT_MESSAGE = '비밀번호 확인을 위해 다시 입력해주세요.';

export function usePasswordValidation(password: string, passwordConfirm: string) {
  const passwordValidation = useMemo(() => validateSignupPassword(password), [password]);
  const isConfirmFilled = passwordConfirm.length > 0;
  const isPasswordMatched = passwordValidation.isValid && isConfirmFilled && password === passwordConfirm;
  const shouldShowPasswordConfirmField = passwordValidation.isValid;
  const confirmHelperText = !shouldShowPasswordConfirmField
    ? undefined
    : !isConfirmFilled
      ? PASSWORD_CONFIRM_DEFAULT_MESSAGE
      : isPasswordMatched
        ? '비밀번호가 일치합니다.'
        : '비밀번호가 일치하지 않습니다.';
  const confirmHelperTone: 'default' | 'success' | 'error' = !shouldShowPasswordConfirmField
    ? 'default'
    : !isConfirmFilled
      ? 'default'
      : isPasswordMatched
        ? 'success'
        : 'error';
  const passwordHelperTone: 'default' | 'success' | 'error' =
    password.length === 0 ? 'default' : passwordValidation.isValid ? 'success' : 'error';

  return {
    confirmHelperText,
    confirmHelperTone,
    isConfirmFilled,
    isPasswordMatched,
    passwordHelperText: passwordValidation.message,
    passwordHelperTone,
    passwordValidation,
    shouldShowPasswordConfirmField,
  };
}
