import { useEffect, useMemo, useRef, useState } from 'react';

import { ClearIcon, EyeIcon, EyeOffIcon } from '@/features/signup/components/SignupIcons';
import { SignupTextField } from '@/features/signup/components/SignupTextField';
import { useDebouncedValue } from '@/features/signup/hooks/useDebouncedValue';

type AccountStepProps = {
  confirmHelperText?: string;
  confirmHelperTone?: 'default' | 'success' | 'error';
  helperText: string;
  helperTone?: 'default' | 'success' | 'error';
  isUsernameAvailable: boolean;
  password: string;
  passwordConfirm: string;
  passwordHelperText: string | null;
  passwordHelperTone: 'default' | 'success' | 'error';
  shouldShowPasswordConfirmField: boolean;
  username: string;
  onChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onPasswordConfirmChange: (value: string) => void;
};

export function AccountStep({
  confirmHelperText,
  confirmHelperTone = 'default',
  helperText,
  helperTone = 'default',
  isUsernameAvailable,
  password,
  passwordConfirm,
  passwordHelperText,
  passwordHelperTone,
  shouldShowPasswordConfirmField,
  username,
  onChange,
  onPasswordChange,
  onPasswordConfirmChange,
}: AccountStepProps) {
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const passwordConfirmInputRef = useRef<HTMLInputElement>(null);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isPasswordConfirmVisible, setIsPasswordConfirmVisible] = useState(false);
  const debouncedPasswordFieldVisible = useDebouncedValue(isUsernameAvailable, 800);
  const debouncedPasswordConfirmFieldVisible = useDebouncedValue(shouldShowPasswordConfirmField, 800);
  const previousPasswordFieldVisibleRef = useRef(false);
  const previousPasswordConfirmFieldVisibleRef = useRef(false);

  useEffect(() => {
    if (debouncedPasswordFieldVisible && !previousPasswordFieldVisibleRef.current) {
      passwordInputRef.current?.focus();
    }

    previousPasswordFieldVisibleRef.current = debouncedPasswordFieldVisible;
  }, [debouncedPasswordFieldVisible]);

  useEffect(() => {
    if (debouncedPasswordConfirmFieldVisible && !previousPasswordConfirmFieldVisibleRef.current) {
      passwordConfirmInputRef.current?.focus();
    }

    previousPasswordConfirmFieldVisibleRef.current = debouncedPasswordConfirmFieldVisible;
  }, [debouncedPasswordConfirmFieldVisible]);

  useEffect(() => {
    if (!debouncedPasswordFieldVisible) {
      setIsPasswordVisible(false);
    }
  }, [debouncedPasswordFieldVisible]);

  useEffect(() => {
    if (!debouncedPasswordConfirmFieldVisible) {
      setIsPasswordConfirmVisible(false);
    }
  }, [debouncedPasswordConfirmFieldVisible]);

  const usernameActions = useMemo(
    () =>
      username ? (
        <button
          type="button"
          aria-label="아이디 지우기"
          onClick={() => onChange('')}
          className="text-[#B3B3B3] transition-colors hover:text-[#7A7A7A]"
        >
          <ClearIcon />
        </button>
      ) : null,
    [onChange, username],
  );

  const passwordActions = useMemo(
    () => (
      <>
        {password ? (
          <button
            type="button"
            aria-label={isPasswordVisible ? '비밀번호 숨기기' : '비밀번호 보기'}
            onClick={() => setIsPasswordVisible((prev) => !prev)}
            className="px-1 text-[#8A8A8A] transition-colors hover:text-[#4F4F4F]"
          >
            {isPasswordVisible ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        ) : null}
        {password ? (
          <button
            type="button"
            aria-label="비밀번호 지우기"
            onClick={() => onPasswordChange('')}
            className="text-[#B3B3B3] transition-colors hover:text-[#7A7A7A]"
          >
            <ClearIcon />
          </button>
        ) : null}
      </>
    ),
    [isPasswordVisible, onPasswordChange, password],
  );

  const passwordConfirmActions = useMemo(
    () => (
      <>
        {passwordConfirm ? (
          <button
            type="button"
            aria-label={isPasswordConfirmVisible ? '비밀번호 확인 숨기기' : '비밀번호 확인 보기'}
            onClick={() => setIsPasswordConfirmVisible((prev) => !prev)}
            className="px-1 text-[#8A8A8A] transition-colors hover:text-[#4F4F4F]"
          >
            {isPasswordConfirmVisible ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        ) : null}
        {passwordConfirm ? (
          <button
            type="button"
            aria-label="비밀번호 확인 지우기"
            onClick={() => onPasswordConfirmChange('')}
            className="text-[#B3B3B3] transition-colors hover:text-[#7A7A7A]"
          >
            <ClearIcon />
          </button>
        ) : null}
      </>
    ),
    [isPasswordConfirmVisible, onPasswordConfirmChange, passwordConfirm],
  );
  const animatedFieldClassName =
    'overflow-hidden transition-[max-height,opacity,transform,margin] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-[max-height,opacity,transform]';
  const passwordConfirmFieldClassName = [
    animatedFieldClassName,
    debouncedPasswordConfirmFieldVisible ? 'mb-8 max-h-[168px] translate-y-0 opacity-100' : 'mb-0 max-h-0 -translate-y-3 opacity-0 pointer-events-none',
  ].join(' ');
  const passwordFieldClassName = [
    animatedFieldClassName,
    debouncedPasswordFieldVisible ? 'mb-8 max-h-[164px] translate-y-0 opacity-100' : 'mb-0 max-h-0 -translate-y-3 opacity-0 pointer-events-none',
  ].join(' ');

  return (
    <div>
      <h1 className="text-[22px] font-bold leading-[1.45] tracking-[-0.03em] text-[#303030]">
        회원가입을 위한
        <br />
        정보를 입력해주세요.
      </h1>
      <div className="mt-10">
        <div className={passwordConfirmFieldClassName} aria-hidden={!debouncedPasswordConfirmFieldVisible}>
          <SignupTextField
            inputRef={passwordConfirmInputRef}
            label="비밀번호 확인"
            type={isPasswordConfirmVisible ? 'text' : 'password'}
            value={passwordConfirm}
            placeholder="비밀번호를 다시 입력해주세요"
            helperText={confirmHelperText}
            helperTone={confirmHelperTone}
            trailingActions={passwordConfirmActions}
            onChange={onPasswordConfirmChange}
          />
        </div>

        <div className={passwordFieldClassName} aria-hidden={!debouncedPasswordFieldVisible}>
          <SignupTextField
            inputRef={passwordInputRef}
            label="비밀번호"
            type={isPasswordVisible ? 'text' : 'password'}
            value={password}
            placeholder="영문, 숫자, 특수문자를 포함한 8~16자"
            helperText={passwordHelperText ?? undefined}
            helperTone={passwordHelperTone}
            trailingActions={passwordActions}
            onChange={onPasswordChange}
          />
        </div>

        <SignupTextField
          label="아이디"
          value={username}
          placeholder="영문 소문자, 숫자 포함 4자 이상"
          helperText={helperText}
          helperTone={helperTone}
          trailingActions={usernameActions}
          onChange={onChange}
        />
      </div>
    </div>
  );
}
