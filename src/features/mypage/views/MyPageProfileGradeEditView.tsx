import { AppHeader } from '@/components/ui/AppHeader';
import { CtaButton } from '@/components/ui/CtaButton';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { RadioBtn } from '@/components/ui/RadioBtn';
import type { ProfileEditGrade } from '@/features/mypage/view-models/useMyPageProfileGradeEditViewModel';

type MyPageProfileGradeEditViewProps = {
  canSubmit: boolean;
  errorMessage: string | null;
  grade: ProfileEditGrade | null;
  isLoading: boolean;
  loadErrorMessage: string | null;
  onClose: () => void;
  onSelect: (grade: ProfileEditGrade) => void;
  onSubmit: () => void;
  submitting: boolean;
};

const GRADE_OPTIONS: { label: string; value: ProfileEditGrade }[] = [
  { label: '4학년 이상', value: 4 },
  { label: '3학년', value: 3 },
  { label: '2학년', value: 2 },
  { label: '1학년', value: 1 },
];

export function MyPageProfileGradeEditView({
  canSubmit,
  errorMessage,
  grade,
  isLoading,
  loadErrorMessage,
  onClose,
  onSelect,
  onSubmit,
  submitting,
}: MyPageProfileGradeEditViewProps) {
  return (
    <main className="h-[100svh] overflow-hidden bg-white">
      <div className="mx-auto flex h-[100svh] w-full max-w-[393px] flex-col overflow-hidden bg-white">
        <AppHeader variant="exit" title="학년 변경" onExit={onClose} />

        <form
          className="flex min-h-0 flex-1 flex-col px-4 pb-[max(60px,env(safe-area-inset-bottom))] pt-6"
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

          <h1 className="text-[24px] font-semibold leading-[1.4] text-[#202020]">
            현재 학년을
            <br />
            선택해주세요.
          </h1>

          <div className="mt-10 grid grid-cols-1 gap-3">
            {GRADE_OPTIONS.map((option) => {
              const isSelected = grade === option.value;

              return (
                <RadioBtn
                  key={option.value}
                  selected={isSelected}
                  className={
                    isSelected
                      ? '!border-[#0BC798] !bg-[rgba(33,232,183,0.2)] !text-[#0BC798]'
                      : '!border-[#DCDFE2] !bg-white !text-[#292B2C]'
                  }
                  onClick={() => onSelect(option.value)}
                >
                  {option.label}
                </RadioBtn>
              );
            })}
          </div>

          {errorMessage ? (
            <p className="mt-4 text-[14px] font-medium leading-[1.4] text-[#FF5E47]" role="alert">
              {errorMessage}
            </p>
          ) : null}

          <div className="mt-auto pt-8">
            <CtaButton type="submit" disabled={!canSubmit}>
              {submitting ? <LoadingSpinner ariaLabel="학년 수정 중" /> : '수정'}
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
