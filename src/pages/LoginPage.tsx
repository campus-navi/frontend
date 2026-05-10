import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { authApi, normalizeApiError } from '@/api';
import { AppHeader } from '@/components/ui/AppHeader';
import { CtaButton } from '@/components/ui/CtaButton';
import { NaviLogo } from '@/components/ui/NaviLogo';
import { ClearIcon, EyeIcon, EyeOffIcon } from '@/features/signup/components/SignupIcons';

const LOGIN_ERROR_MESSAGES = {
  passwordRequired: '비밀번호를 입력해주세요.',
  unauthorized: '아이디 또는 비밀번호가 일치하지 않습니다.',
  usernameRequired: '아이디를 입력해주세요.',
} as const;

function LoginCheckbox({
  checked,
  onToggle,
}: {
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <button type="button" onClick={onToggle} className="flex items-center gap-3 text-left" aria-pressed={checked}>
      <span
        className={[
          'flex h-[22px] w-[22px] items-center justify-center rounded-full border transition-colors',
          checked ? 'border-[#565656] bg-[#565656] text-white' : 'border-[#D9D9D9] bg-white text-transparent',
        ].join(' ')}
        aria-hidden="true"
      >
        <svg viewBox="0 0 20 20" className="h-3.5 w-3.5">
          <path d="M4.5 10.5 8 14l7.5-8" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </svg>
      </span>
      <span className="font-semibold leading-none tracking-[-0.02em] text-[#3D3D3D]">자동 로그인</span>
    </button>
  );
}

export default function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [autoLogin, setAutoLogin] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [isLoginPending, setIsLoginPending] = useState(false);

  const handleUsernameChange = (value: string) => {
    setUsername(value);
    setUsernameError(null);
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    setPasswordError(null);
  };

  const handleLogin = async () => {
    if (isLoginPending) {
      return;
    }

    const isUsernameEmpty = username.trim().length === 0;
    const isPasswordEmpty = password.trim().length === 0;

    setUsernameError(isUsernameEmpty ? LOGIN_ERROR_MESSAGES.usernameRequired : null);
    setPasswordError(isPasswordEmpty ? LOGIN_ERROR_MESSAGES.passwordRequired : null);

    if (isUsernameEmpty || isPasswordEmpty) {
      return;
    }

    setIsLoginPending(true);

    try {
      await authApi.login({
        password,
        username,
      });
      navigate('/home', { replace: true });
    } catch (error) {
      const normalizedError = normalizeApiError(error);

      if (normalizedError.status === 401) {
        setPasswordError(LOGIN_ERROR_MESSAGES.unauthorized);
      } else {
        setPasswordError(normalizedError.message);
      }
    } finally {
      setIsLoginPending(false);
    }
  };

  return (
    <main className="min-h-[100svh] bg-white">
      <div className="mx-auto flex min-h-[100svh] w-full max-w-[393px] flex-col bg-white">
        <AppHeader title="로그인" onBack={() => navigate(-1)} />

        <section className="flex flex-1 flex-col px-5 pb-[max(24px,env(safe-area-inset-bottom))] pt-8">
          <div className="pt-5">
            <NaviLogo className="mx-auto h-8 w-[120px]" />
          </div>

          <div className="mt-[56px] space-y-8">
            <div>
              <div className="border-b-2 border-[#E3E3E3] focus-within:border-[#1F1F1F]">
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={username}
                    onChange={(event) => handleUsernameChange(event.target.value)}
                    placeholder="아이디를 작성해주세요"
                    className="h-14 min-w-0 flex-1 border-0 bg-transparent px-0 text-[#202020] placeholder:text-[#B6B6B6] focus:outline-none"
                  />
                  {username ? (
                    <button
                      type="button"
                      onClick={() => handleUsernameChange('')}
                      className="flex h-8 w-8 items-center justify-center text-[#C6C6C6] transition-colors hover:text-[#8E8E8E]"
                      aria-label="아이디 지우기"
                    >
                      <ClearIcon />
                    </button>
                  ) : null}
                </div>
              </div>
              {usernameError ? <p className="mt-3 text-[13px] leading-5 text-[#D34B4B]">{usernameError}</p> : null}
            </div>

            <div>
              <div className="border-b-2 border-[#E3E3E3] focus-within:border-[#1F1F1F]">
                <div className="flex items-center gap-1">
                  <input
                    type={isPasswordVisible ? 'text' : 'password'}
                    value={password}
                    onChange={(event) => handlePasswordChange(event.target.value)}
                    placeholder="비밀번호를 작성해주세요."
                    className="h-14 min-w-0 flex-1 border-0 bg-transparent px-0 text-[#202020] placeholder:text-[#B6B6B6] focus:outline-none"
                  />
                  {password ? (
                    <>
                      <button
                        type="button"
                        onClick={() => setIsPasswordVisible((current) => !current)}
                        className="px-1 text-[#8A8A8A] transition-colors hover:text-[#4F4F4F]"
                        aria-label={isPasswordVisible ? '비밀번호 숨기기' : '비밀번호 보기'}
                        aria-pressed={isPasswordVisible}
                      >
                        {isPasswordVisible ? <EyeIcon /> : <EyeOffIcon />}
                      </button>
                      <button
                        type="button"
                        onClick={() => handlePasswordChange('')}
                        className="flex h-8 w-8 items-center justify-center text-[#B3B3B3] transition-colors hover:text-[#7A7A7A]"
                        aria-label="비밀번호 지우기"
                      >
                        <ClearIcon />
                      </button>
                    </>
                  ) : null}
                </div>
              </div>
              {passwordError ? <p className="mt-3 text-[13px] leading-5 text-[#D34B4B]">{passwordError}</p> : null}
            </div>
          </div>

          <div className="mt-8">
            <LoginCheckbox checked={autoLogin} onToggle={() => setAutoLogin((current) => !current)} />
          </div>

          <div className="mt-auto pt-8">
            <CtaButton onClick={() => void handleLogin()}>
              {isLoginPending ? (
                <span
                  aria-label="로그인 중"
                  className="h-4 w-4 animate-spin rounded-full border-2 border-[#BBBBBB] border-t-transparent"
                  role="status"
                />
              ) : (
                '로그인'
              )}
            </CtaButton>

            <div className="mt-10 flex items-center justify-center gap-3 text-[15px] text-[#9A9A9A]">
              <button type="button" className="transition-colors hover:text-[#565656]">
                아이디 찾기
              </button>
              <span aria-hidden="true">·</span>
              <button type="button" className="transition-colors hover:text-[#565656]">
                비밀번호 찾기
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
