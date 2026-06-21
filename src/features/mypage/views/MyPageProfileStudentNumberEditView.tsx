import type { CSSProperties, PointerEvent } from 'react';

import { AppHeader } from '@/components/ui/AppHeader';
import { CtaButton } from '@/components/ui/CtaButton';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ClearIcon } from '@/features/signup/components/SignupIcons';
import { SignupTextField } from '@/features/signup/components/SignupTextField';
import { AdmissionYearStep } from '@/features/signup/steps/AdmissionYearStep';
import { admissionYears } from '@/features/signup/constants';
import { useKeyboardCtaState } from '@/features/signup/hooks/useKeyboardCtaState';

type MyPageProfileStudentNumberEditViewProps = {
  admissionYear: number;
  canSubmit: boolean;
  helperText?: string;
  helperTone: 'default' | 'error';
  isLoading: boolean;
  loadErrorMessage: string | null;
  onAdmissionYearChange: (year: number) => void;
  onBack: () => void;
  onChange: (value: string) => void;
  onSubmit: () => void;
  studentNumber: string;
  step: 'admission-year' | 'student-number';
  submitting: boolean;
};

export function MyPageProfileStudentNumberEditView({
  admissionYear,
  canSubmit,
  helperText,
  helperTone,
  isLoading,
  loadErrorMessage,
  onAdmissionYearChange,
  onBack,
  onChange,
  onSubmit,
  studentNumber,
  step,
  submitting,
}: MyPageProfileStudentNumberEditViewProps) {
  const { isKeyboardOpen, keyboardInset } = useKeyboardCtaState();
  const isStudentNumberStep = step === 'student-number';
  const isCtaDisabled = isStudentNumberStep ? !canSubmit : isLoading || Boolean(loadErrorMessage);
  const ctaStyle = {
    bottom: `${isStudentNumberStep && isKeyboardOpen ? keyboardInset : 0}px`,
  } as CSSProperties;

  const handlePointerDown = (event: PointerEvent<HTMLButtonElement>) => {
    if (!isStudentNumberStep || !isKeyboardOpen || !canSubmit) {
      return;
    }

    event.preventDefault();
    void onSubmit();
  };

  return (
    <main className="h-[100svh] overflow-hidden bg-white">
      <div className="mx-auto flex h-[100svh] w-full max-w-[393px] flex-col overflow-hidden bg-white">
        {isStudentNumberStep ? (
          <AppHeader variant="back" title="학번" onBack={onBack} />
        ) : (
          <AppHeader variant="exit" title="입학년도 선택" onExit={onBack} />
        )}

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

          {isStudentNumberStep ? (
            <div>
              <h1 className="-mx-1 mb-5 px-0 py-3 text-[24px] font-semibold leading-[1.4] text-[#202020]">
                학번을 입력해주세요.
              </h1>
              <SignupTextField
                autoComplete="off"
                inputMode="numeric"
                label="학번"
                layout="account"
                value={studentNumber}
                placeholder="학번을 작성해주세요."
                helperText={helperText}
                helperTone={helperTone}
                trailingActions={
                  studentNumber ? (
                    <button
                      type="button"
                      aria-label="학번 지우기"
                      className="text-[#B3B3B3]"
                      onClick={() => onChange('')}
                    >
                      <ClearIcon />
                    </button>
                  ) : null
                }
                onChange={onChange}
              />
            </div>
          ) : (
            <div className="min-h-0 flex-1">
              <AdmissionYearStep
                selectedYear={admissionYear}
                years={admissionYears}
                onSelect={onAdmissionYearChange}
              />
            </div>
          )}

          <div
            aria-hidden="true"
            className="mt-auto h-[calc(88px+max(24px,env(safe-area-inset-bottom)))] shrink-0"
          />
          <div
            className={[
              "fixed left-1/2 z-20 w-full max-w-[393px] -translate-x-1/2 bg-white before:pointer-events-none before:absolute before:inset-x-0 before:-top-4 before:bottom-0 before:bg-white before:content-['']",
              isStudentNumberStep && isKeyboardOpen
                ? 'px-0 pb-0 pt-0'
                : 'px-5 pb-[max(24px,env(safe-area-inset-bottom))] pt-2 transition-[bottom] duration-200 ease-out',
            ].join(' ')}
            style={ctaStyle}
          >
            <CtaButton
              type="submit"
              className={[
                'relative z-10',
                isStudentNumberStep && isKeyboardOpen ? '!rounded-none' : '',
              ].join(' ')}
              disabled={isCtaDisabled}
              onPointerDown={handlePointerDown}
            >
              {submitting ? (
                <LoadingSpinner ariaLabel="학번 수정 중" />
              ) : isStudentNumberStep ? (
                '수정'
              ) : (
                '다음'
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
  tone = 'default',
}: {
  children: string;
  tone?: 'default' | 'error';
}) {
  return (
    <p
      className={[
        'mb-4 rounded-xl px-4 py-3 text-[14px] font-medium leading-[1.4]',
        tone === 'error'
          ? 'bg-[#FFF4F2] text-[#FF5E47]'
          : 'bg-[#F3F5FA] text-[#565656]',
      ].join(' ')}
      role={tone === 'error' ? 'alert' : undefined}
    >
      {children}
    </p>
  );
}
