import type { CSSProperties, PointerEvent } from 'react';

import { AppHeader } from '@/components/ui/AppHeader';
import { CtaButton } from '@/components/ui/CtaButton';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ClearIcon } from '@/features/signup/components/SignupIcons';
import { SignupTextField } from '@/features/signup/components/SignupTextField';
import { useKeyboardCtaState } from '@/features/signup/hooks/useKeyboardCtaState';

type MyPageProfileNicknameEditViewProps = {
  canSubmit: boolean;
  helperText?: string;
  helperTone: 'default' | 'success' | 'error';
  isChecking: boolean;
  isLoading: boolean;
  loadErrorMessage: string | null;
  nickname: string;
  onChange: (value: string) => void;
  onClose: () => void;
  onSubmit: () => void;
  submitErrorMessage: string | null;
  submitting: boolean;
};

export function MyPageProfileNicknameEditView({
  canSubmit,
  helperText,
  helperTone,
  isChecking,
  isLoading,
  loadErrorMessage,
  nickname,
  onChange,
  onClose,
  onSubmit,
  submitErrorMessage,
  submitting,
}: MyPageProfileNicknameEditViewProps) {
  const { isKeyboardOpen, keyboardInset } = useKeyboardCtaState();
  const ctaStyle = {
    bottom: `${isKeyboardOpen ? keyboardInset : 0}px`,
  } as CSSProperties;

  const handlePointerDown = (event: PointerEvent<HTMLButtonElement>) => {
    if (!isKeyboardOpen || !canSubmit) {
      return;
    }

    event.preventDefault();
    void onSubmit();
  };

  return (
    <main className="h-[100svh] overflow-hidden bg-white">
      <div className="mx-auto flex h-[100svh] w-full max-w-[393px] flex-col overflow-hidden bg-white">
        <AppHeader variant="exit" title="닉네임 변경" onExit={onClose} />

        <form
          className="flex min-h-0 flex-1 flex-col px-5 pt-10"
          onSubmit={(event) => {
            event.preventDefault();
            void onSubmit();
          }}
        >
          {isLoading ? (
            <StatusMessage>프로필 정보를 불러오는 중이에요.</StatusMessage>
          ) : null}
          {loadErrorMessage ? (
            <StatusMessage tone="error">{loadErrorMessage}</StatusMessage>
          ) : null}

          <SignupTextField
            autoCapitalize="off"
            autoComplete="off"
            autoCorrect="off"
            label="닉네임"
            value={nickname}
            placeholder="닉네임을 입력해주세요"
            helperText={submitErrorMessage ?? helperText}
            helperTone={submitErrorMessage ? 'error' : helperTone}
            trailingActions={
              nickname ? (
                <>
                  {isChecking ? (
                    <LoadingSpinner
                      ariaLabel="닉네임 확인 중"
                      className="h-4 w-4 text-[#8D8D8D]"
                    />
                  ) : null}
                  <button
                    type="button"
                    aria-label="닉네임 지우기"
                    className="text-[#B3B3B3]"
                    onClick={() => onChange('')}
                  >
                    <ClearIcon />
                  </button>
                </>
              ) : null
            }
            onChange={onChange}
          />

          <div
            aria-hidden="true"
            className="mt-auto h-[calc(88px+max(24px,env(safe-area-inset-bottom)))] shrink-0"
          />
          <div
            className={[
              "fixed left-1/2 z-20 w-full max-w-[393px] -translate-x-1/2 bg-white before:pointer-events-none before:absolute before:inset-x-0 before:-top-4 before:bottom-0 before:bg-white before:content-['']",
              isKeyboardOpen
                ? 'px-0 pb-0 pt-0'
                : 'px-5 pb-[max(24px,env(safe-area-inset-bottom))] pt-2 transition-[bottom] duration-200 ease-out',
            ].join(' ')}
            style={ctaStyle}
          >
            <CtaButton
              type="submit"
              className={[
                'relative z-10',
                isKeyboardOpen ? '!rounded-none' : '',
              ].join(' ')}
              disabled={!canSubmit}
              onPointerDown={handlePointerDown}
            >
              {submitting ? (
                <LoadingSpinner ariaLabel="닉네임 수정 중" />
              ) : (
                '수정'
              )}
            </CtaButton>
          </div>
        </form>
      </div>
    </main>
  );
}

function StatusMessage({
  children,
  className = '',
  tone = 'default',
}: {
  children: string;
  className?: string;
  tone?: 'default' | 'error';
}) {
  return (
    <p
      className={[
        'mb-4 rounded-xl px-4 py-3 text-[14px] font-medium leading-[1.4]',
        tone === 'error'
          ? 'bg-[#FFF4F2] text-[#FF5E47]'
          : 'bg-[#F3F5FA] text-[#565656]',
        className,
      ].join(' ')}
      role={tone === 'error' ? 'alert' : undefined}
    >
      {children}
    </p>
  );
}
