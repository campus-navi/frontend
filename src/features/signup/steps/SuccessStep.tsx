import type { SignupForm } from '@/features/signup/types';

type SuccessStepProps = {
  form: SignupForm;
  emailDomain: string;
};

export function SuccessStep({ form, emailDomain }: SuccessStepProps) {
  return (
    <div className="flex h-full flex-col justify-center">
      <div className="relative overflow-hidden rounded-[32px] bg-[linear-gradient(160deg,#f5f7fb_0%,#eef3ff_55%,#ffffff_100%)] px-7 py-8 shadow-[0_18px_40px_rgba(31,41,55,0.08)]">
        <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-[#DDE8FF]/80 blur-2xl" />
        <div className="absolute -bottom-12 -left-10 h-32 w-32 rounded-full bg-[#E9F4E8]/80 blur-2xl" />
        <div className="relative">
          <h1 className="mt-3 text-[30px] font-bold leading-[1.25] tracking-[-0.03em] text-[#273041]">
            캠퍼스 계정 준비가
            <br />
            완료되었어요
          </h1>
          <p className="mt-4 text-[15px] leading-[1.6] text-[#667085]">
            학교 인증과 기본 정보 입력이 모두 끝났습니다. 이제 같은 학교 사람들과 연결될 준비가 되었어요.
          </p>

          <div className="mt-8 rounded-[24px] border border-white/70 bg-white/85 p-5 backdrop-blur">
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-[#F1F5FF] px-3 py-1.5 text-sm font-medium text-[#4460A8]">
                {form.selectedUniversity?.universityName ?? '대학교 미선택'}
              </span>
              <span className="rounded-full bg-[#F4F6F8] px-3 py-1.5 text-sm font-medium text-[#556070]">{form.department}</span>
              <span className="rounded-full bg-[#EDF9EF] px-3 py-1.5 text-sm font-medium text-[#2F7A45]">{form.admissionYear}학번</span>
            </div>

            <dl className="mt-5 space-y-3 text-left">
              <div className="flex items-center justify-between gap-4">
                <dt className="text-sm text-[#8B95A7]">학교 메일</dt>
                <dd className="text-sm font-semibold text-[#2A3342]">
                  {form.emailLocalPart}@{emailDomain}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="text-sm text-[#8B95A7]">아이디</dt>
                <dd className="text-sm font-semibold text-[#2A3342]">{form.username}</dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="text-sm text-[#8B95A7]">닉네임</dt>
                <dd className="text-sm font-semibold text-[#2A3342]">{form.nickname}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
