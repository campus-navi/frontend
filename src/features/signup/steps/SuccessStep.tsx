import { Tags } from '@/components/ui/Tags';
import { ToolTip } from '@/components/ui/ToolTip';
import type { SignupCompleteSnapshot } from '@/features/signup/types';

type SuccessStepProps = {
  snapshot: SignupCompleteSnapshot;
};

const completeTitle = ['캠퍼스 네비', '가입이 완료되었어요!'];

export function SuccessStep({ snapshot }: SuccessStepProps) {
  const gradeLabel = snapshot.grade >= 4 ? '4학년 이상' : `${snapshot.grade}학년`;
  const nickname = snapshot.nickname.trim() || '익명';

  return (
    <div className="flex flex-col gap-6">
      <div className="flex h-[124px] flex-col justify-center gap-2.5 px-4 py-3">
        <h1 className="w-[240px] text-2xl font-semibold leading-[1.4] tracking-normal text-[#202020]">
          {completeTitle[0]}
          <br />
          {completeTitle[1]}
        </h1>
        <p className="text-base font-medium leading-[1.4] tracking-normal text-[#838383]">
          아래 정보가 맞는지 확인해주세요.
        </p>
      </div>

      <div className="px-4">
        <div className="relative h-[204px] rounded-2xl bg-white p-4 shadow-[0_0_16px_rgba(0,0,0,0.08)]">
          <div className="flex min-h-[72px] flex-wrap content-start items-center gap-2">
            <Tags size="lg" type="tertiary">
              {snapshot.universityName}
            </Tags>
            <Tags size="lg" type="tertiary">
              {snapshot.admissionYear}학번
            </Tags>
            <Tags size="lg" type="tertiary">
              {gradeLabel}
            </Tags>
            <Tags size="lg" type="tertiary">
              {snapshot.department}
            </Tags>
          </div>

          <div className="mt-3 h-px bg-[#F4F4F4]" />

          <dl className="mt-3 flex flex-col gap-2 text-left">
            <div className="flex h-5 items-center justify-between gap-4">
              <dt className="shrink-0 text-xs font-medium leading-[1.4] text-[#565656]/40">학교 메일</dt>
              <dd className="min-w-0 truncate text-right text-sm font-medium leading-[1.4] text-[#565656]">
                {snapshot.email}
              </dd>
            </div>
            <div className="flex h-5 items-center justify-between gap-4">
              <dt className="shrink-0 text-xs font-medium leading-[1.4] text-[#565656]/40">아이디</dt>
              <dd className="min-w-0 truncate text-right text-sm font-medium leading-[1.4] text-[#565656]">
                {snapshot.username}
              </dd>
            </div>
            <div className="flex h-5 items-center justify-between gap-4">
              <dt className="shrink-0 text-xs font-medium leading-[1.4] text-[#565656]/40">닉네임</dt>
              <dd className="min-w-0 truncate text-right text-sm font-medium leading-[1.4] text-[#565656]">
                {nickname}
              </dd>
            </div>
          </dl>

          <ToolTip
            id="signup-complete-nickname-tooltip"
            type="RightUp"
            className="absolute -bottom-[24px] right-[-8px] z-10 h-[30px] max-w-[329px] leading-[22px]"
          >
            닉네임은 기본적으로 "익명"으로 대체됩니다.
          </ToolTip>
          <span className="sr-only" aria-describedby="signup-complete-nickname-tooltip">
            닉네임 안내
          </span>
        </div>
      </div>
    </div>
  );
}
