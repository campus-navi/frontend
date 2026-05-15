import { useEffect, useMemo, useRef, useState } from 'react';

import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ClearIcon, EyeIcon, EyeOffIcon } from '@/features/signup/components/SignupIcons';
import { SignupTextField } from '@/features/signup/components/SignupTextField';

type AccountStepProps = {
  confirmHelperText?: string;
  confirmHelperTone?: 'default' | 'success' | 'error';
  helperText: string;
  helperTone?: 'default' | 'success' | 'error';
  isUsernameChecking?: boolean;
  password: string;
  passwordConfirm: string;
  passwordHelperText: string | null;
  passwordHelperTone: 'default' | 'success' | 'error';
  shouldShowPasswordField: boolean;
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
  isUsernameChecking = false,
  password,
  passwordConfirm,
  passwordHelperText,
  passwordHelperTone,
  shouldShowPasswordField,
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
  const previousPasswordFieldVisibleRef = useRef(false);
  const previousPasswordConfirmFieldVisibleRef = useRef(false);

  useEffect(() => {
    if (shouldShowPasswordField && !previousPasswordFieldVisibleRef.current) {
      passwordInputRef.current?.focus();
    }

    previousPasswordFieldVisibleRef.current = shouldShowPasswordField;
  }, [shouldShowPasswordField]);

  useEffect(() => {
    if (shouldShowPasswordConfirmField && !previousPasswordConfirmFieldVisibleRef.current) {
      passwordConfirmInputRef.current?.focus();
    }

    previousPasswordConfirmFieldVisibleRef.current = shouldShowPasswordConfirmField;
  }, [shouldShowPasswordConfirmField]);

  useEffect(() => {
    if (!shouldShowPasswordField) {
      setIsPasswordVisible(false);
    }
  }, [shouldShowPasswordField]);

  useEffect(() => {
    if (!shouldShowPasswordConfirmField) {
      setIsPasswordConfirmVisible(false);
    }
  }, [shouldShowPasswordConfirmField]);

  const usernameActions = useMemo(
    () =>
      username ? (
        <>
          {isUsernameChecking ? <LoadingSpinner ariaLabel="아이디 확인 중" className="h-4 w-4 text-[#8D8D8D]" /> : null}
          <button
            type="button"
            aria-label="아이디 지우기"
            onClick={() => onChange('')}
            className="text-[#B3B3B3] transition-colors hover:text-[#7A7A7A]"
          >
            <ClearIcon />
          </button>
        </>
      ) : null,
    [isUsernameChecking, onChange, username],
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
            {isPasswordVisible ? <EyeIcon /> : <EyeOffIcon />}
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
            {isPasswordConfirmVisible ? <EyeIcon /> : <EyeOffIcon />}
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
  return (
    <div>
      <h1 className="text-[22px] font-bold leading-[1.45] tracking-[-0.03em] text-[#303030]">
        회원가입을 위한
        <br />
        정보를 입력해주세요.
      </h1>
      <div className="mt-10">
        {shouldShowPasswordConfirmField ? (
          <div className="signup-slide-down mb-8">
            <SignupTextField
              inputRef={passwordConfirmInputRef}
              layout="account"
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
        ) : null}

        {shouldShowPasswordField ? (
          <div className="signup-slide-down mb-8">
            <SignupTextField
              inputRef={passwordInputRef}
              layout="account"
              label="비밀번호"
              type={isPasswordVisible ? 'text' : 'password'}
              value={password}
              placeholder="비밀번호를 작성해주세요."
              helperText={passwordHelperText ?? undefined}
              helperTone={passwordHelperTone}
              trailingActions={passwordActions}
              onChange={onPasswordChange}
            />
          </div>
        ) : null}

        <SignupTextField
          layout="account"
          label="아이디"
          value={username}
          placeholder="아이디를 작성해주세요."
          helperText={helperText}
          helperTone={helperTone}
          trailingActions={usernameActions}
          onChange={onChange}
        />
      </div>
    </div>
  );
}
