import { AppHeader } from '@/components/ui/AppHeader';
import { MobileGnb } from '@/components/ui/MobileGnb';
import { SvgIcon } from '@/components/ui/SvgIcon';
import { MyPageProfileAvatar } from '@/features/mypage/components/profile/MyPageProfileAvatar';
import type { ProfileGrade } from '@/features/mypage/view-models/useMyPageProfileEditViewModel';

type MyPageProfileEditViewProps = {
  department: string;
  email: string;
  grade: ProfileGrade;
  interestCount: number;
  isLoading: boolean;
  isLoggingOut: boolean;
  loadErrorMessage: string | null;
  nickname: string;
  onGradeClick: () => void;
  onLogout: () => void;
  onNicknameClick: () => void;
  onStudentNumberClick: () => void;
  studentNumber: string;
  submitErrorMessage: string | null;
};

const GRADE_OPTIONS: { label: string; value: ProfileGrade }[] = [
  { label: '1학년', value: 1 },
  { label: '2학년', value: 2 },
  { label: '3학년', value: 3 },
  { label: '4학년 이상', value: 4 },
];

export function MyPageProfileEditView({
  department,
  email,
  grade,
  interestCount,
  isLoading,
  isLoggingOut,
  loadErrorMessage,
  nickname,
  onGradeClick,
  onLogout,
  onNicknameClick,
  onStudentNumberClick,
  studentNumber,
  submitErrorMessage,
}: MyPageProfileEditViewProps) {
  const selectedGradeLabel =
    GRADE_OPTIONS.find((option) => option.value === grade)?.label ?? '1학년';

  return (
    <main className="min-h-[100svh]">
      <div className="mx-auto flex min-h-[100svh] w-full max-w-[393px] flex-col pb-[calc(86px+env(safe-area-inset-bottom))]">
        <AppHeader
          variant="main"
          className="fixed left-1/2 top-0 z-40 w-full max-w-[393px] -translate-x-1/2 bg-white"
        />
        <div
          className="h-[calc(60px+max(20px,env(safe-area-inset-top)))] shrink-0"
          aria-hidden="true"
        />

        <div className="flex flex-1 flex-col pb-8 pt-8">
          <section className="flex flex-col items-center gap-[13px]" aria-label="프로필">
            <MyPageProfileAvatar />
            <span className="flex h-[34px] items-center rounded-lg border border-[#DCDFE2] bg-white px-3 text-[14px] font-semibold leading-none tracking-[0.015em] text-[#292B2C]">
              프로필 변경
            </span>
          </section>

          <div className="mt-6 flex flex-col gap-3 px-4">
            {isLoading ? <StatusMessage>프로필 정보를 불러오는 중이에요.</StatusMessage> : null}
            {loadErrorMessage ? (
              <StatusMessage tone="error">{loadErrorMessage}</StatusMessage>
            ) : null}

            <div className="flex h-[52px] items-center justify-between rounded-xl bg-white px-3">
              <span className="text-[14px] font-medium leading-[1.4] text-[#292B2C]">
                맞춤 카테고리
              </span>
              <span className="flex items-center gap-1">
                <span className="text-[14px] font-medium leading-[1.4] text-[#0BC798]">
                  {interestCount}건
                </span>
                <ChevronIcon />
              </span>
            </div>

            <section className="rounded-xl bg-white px-4 pb-2" aria-labelledby="profile-basic-title">
              <h2
                id="profile-basic-title"
                className="flex h-11 items-center text-[14px] font-semibold leading-[1.4] tracking-[0.015em] text-[#BFC4C8]"
              >
                기본정보
              </h2>

              <ProfileMenuRow label="닉네임" value={nickname} onClick={onNicknameClick} />
              <ProfileMenuRow
                label="학번"
                value={studentNumber}
                onClick={onStudentNumberClick}
              />
              <ProfileMenuRow
                label="학년"
                value={selectedGradeLabel}
                onClick={onGradeClick}
              />
              <ReadOnlyRow label="학과" value={department || '-'} />
            </section>

            <section className="rounded-xl bg-white px-4 pb-2" aria-labelledby="profile-account-title">
              <h2
                id="profile-account-title"
                className="flex h-11 items-center text-[14px] font-semibold leading-[1.4] tracking-[0.015em] text-[#BFC4C8]"
              >
                계정
              </h2>
              <ReadOnlyRow label="이메일" value={email || '-'} />
              <AccountMenuRow label="아이디 변경" />
              <AccountMenuRow label="비밀번호 변경" />
            </section>

            {submitErrorMessage ? (
              <StatusMessage tone="error">{submitErrorMessage}</StatusMessage>
            ) : null}

            <div className="mt-3 flex h-5 items-center justify-center gap-3">
              <button
                type="button"
                className="text-[14px] font-medium leading-[1.4] text-[#636A70] disabled:cursor-not-allowed disabled:opacity-50"
                disabled={isLoggingOut}
                onClick={onLogout}
              >
                로그아웃
              </button>
              <span className="h-3 w-px bg-[#DCDFE2]" aria-hidden="true" />
              <button
                type="button"
                className="text-[14px] font-medium leading-[1.4] text-[#FF5E47]"
              >
                회원탈퇴
              </button>
            </div>
          </div>
        </div>
      </div>

      <MobileGnb activeItem="my" />
    </main>
  );
}

function ReadOnlyRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex min-h-11 items-center justify-between gap-4 py-3">
      <span className="shrink-0 text-[14px] font-medium leading-[1.4] text-[#292B2C]">
        {label}
      </span>
      <span className="min-w-0 truncate text-right text-[12px] font-medium leading-[1.2] text-[#BFC4C8]">
        {value}
      </span>
    </div>
  );
}

function ProfileMenuRow({
  label,
  onClick,
  value,
}: {
  label: string;
  onClick: () => void;
  value: string;
}) {
  return (
    <button
      type="button"
      className="flex min-h-11 w-full items-center justify-between gap-4 py-3 text-left"
      onClick={onClick}
    >
      <span className="shrink-0 text-[14px] font-medium leading-[1.4] text-[#292B2C]">
        {label}
      </span>
      <span className="flex min-w-0 items-center gap-1">
        <span className="truncate text-right text-[12px] font-medium leading-[1.2] text-[#BFC4C8]">
          {value}
        </span>
        <ChevronIcon />
      </span>
    </button>
  );
}

function AccountMenuRow({ label, value }: { label: string; value?: string }) {
  return (
    <button
      type="button"
      className="flex min-h-11 w-full items-center justify-between gap-4 py-3 text-left"
    >
      <span className="shrink-0 text-[14px] font-medium leading-[1.4] text-[#292B2C]">
        {label}
      </span>
      <span className="flex min-w-0 items-center gap-1">
        {value ? (
          <span className="truncate text-right text-[12px] font-medium leading-[1.2] text-[#BFC4C8]">
            {value}
          </span>
        ) : null}
        <ChevronIcon />
      </span>
    </button>
  );
}

function ChevronIcon() {
  return (
    <span className="flex h-5 w-5 shrink-0 items-center justify-center text-[#292B2C]" aria-hidden="true">
      <SvgIcon size={20} viewBox="0 0 20 20">
        <path
          d="M8.4 6.5 11.9 10l-3.5 3.5"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
        />
      </SvgIcon>
    </span>
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
        'rounded-xl px-4 py-3 text-[14px] font-medium leading-[1.4]',
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
