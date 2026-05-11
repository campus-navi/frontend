import { useState } from 'react';

import { BottomSheet } from '@/components/ui/BottomSheet';
import { CtaButton } from '@/components/ui/CtaButton';
import { SvgIcon } from '@/components/ui/SvgIcon';

export type SignupTermId = 'privacy' | 'age' | 'externalApi';

type SignupTerm = {
  id: SignupTermId;
  title: string;
  detailTitle: string;
  content: string[];
};

type SignupTermsAgreementSheetProps = {
  agreedTermIds: SignupTermId[];
  isOpen: boolean;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: () => void;
  onToggleTerm: (termId: SignupTermId) => void;
  onToggleAll: () => void;
};

const signupTerms: SignupTerm[] = [
  {
    id: 'privacy',
    title: '[필수] 개인정보 수집 및 이용 동의',
    detailTitle: '[필수] 개인정보 수집 및 이용 동의',
    content: [
      '1. 수집 항목: 아이디, 비밀번호, 닉네임, 대학교/캠퍼스, 학과, 입학년도, 학년, 학교 이메일',
      '2. 수집 및 이용 목적: 캠퍼스 네비 맞춤형 학사 공지 큐레이션, 커뮤니티 이용 자격(소속 대학) 확인 및 유저 식별',
      '3. 보유 및 이용 기간: 회원 탈퇴 시 지체 없이 파기. 단, 통신비밀보호법에 따라 접속 로그 및 IP 정보는 3개월간 보존합니다.',
      '4. 동의 거부 권리: 사용자는 동의를 거부할 수 있으나, 거부 시 맞춤형 캠퍼스 정보 제공 서비스 이용이 제한됩니다.',
    ],
  },
  {
    id: 'age',
    title: '[필수] 만 14세 이상 이용 동의',
    detailTitle: '[필수] 만 14세 이상 이용 동의',
    content: [
      '본 서비스는 대학생을 위한 정보 큐레이션 서비스로, 「개인정보 보호법」에 따라 만 14세 이상만 가입 및 이용이 가능합니다.',
    ],
  },
  {
    id: 'externalApi',
    title: '[필수] 외부 API 위탁 동의',
    detailTitle: '[필수] 외부 API 위탁 동의',
    content: [
      'AI 모델 위탁: 캠퍼스 네비는 지능형 에이전트 서비스(질의응답 및 텍스트 생성) 제공을 위해 입력된 데이터를 OpenAI에 전송할 수 있습니다. 단, 사용자의 프롬프트 원문은 외부 업체의 AI 모델 학습에 활용되지 않습니다.',
    ],
  },
];

function CheckIcon({ isChecked }: { isChecked: boolean }) {
  return (
    <span
      className={[
        'flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-colors duration-200',
        isChecked
          ? 'border-[#31FFCC] bg-[#31FFCC] text-[#292B2C]'
          : 'border-[#D6D6D6] bg-white text-transparent',
      ].join(' ')}
      aria-hidden="true"
    >
      <SvgIcon size={16} viewBox="0 0 16 16">
        <path
          d="M3.5 8.1 6.5 11 12.5 5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </SvgIcon>
    </span>
  );
}

function ChevronRightIcon() {
  return (
    <SvgIcon size={20} viewBox="0 0 20 20">
      <path
        d="m7.5 4 5 6-5 6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </SvgIcon>
  );
}

function CloseIcon() {
  return (
    <SvgIcon size={24} viewBox="0 0 24 24">
      <path
        d="M6 6 18 18M18 6 6 18"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </SvgIcon>
  );
}

export function SignupTermsAgreementSheet({
  agreedTermIds,
  isOpen,
  isSubmitting,
  onClose,
  onSubmit,
  onToggleAll,
  onToggleTerm,
}: SignupTermsAgreementSheetProps) {
  const [detailTerm, setDetailTerm] = useState<SignupTerm | null>(null);
  const isAllRequiredAgreed = signupTerms.every((term) => agreedTermIds.includes(term.id));

  return (
    <>
      <BottomSheet
        isOpen={isOpen}
        title="회원가입 동의가 필요해요."
        type="left"
        onClose={onClose}
        footer={
          <CtaButton
            type="button"
            variant="primary"
            size="xlg"
            state={isAllRequiredAgreed && !isSubmitting ? 'default' : 'disabled'}
            disabled={!isAllRequiredAgreed || isSubmitting}
            onClick={onSubmit}
          >
            동의하고 가입완료
          </CtaButton>
        }
      >
        <div className="flex w-full flex-col px-5 pb-2">
          <p className="text-[15px] font-medium leading-[1.5] text-[#6C6C6C]">
            회원가입을 진행하려면 아래 약관에 동의해 주세요
          </p>

          <div className="mt-6 flex flex-col">
            {signupTerms.map((term) => {
              const isChecked = agreedTermIds.includes(term.id);

              return (
                <div key={term.id} className="flex h-12 items-center gap-3">
                  <button
                    type="button"
                    className="flex min-w-0 flex-1 items-center gap-3 text-left"
                    aria-pressed={isChecked}
                    onClick={() => onToggleTerm(term.id)}
                  >
                    <CheckIcon isChecked={isChecked} />
                    <span className="min-w-0 flex-1 break-keep text-[15px] font-medium leading-[1.4] text-[#292B2C]">
                      {term.title}
                    </span>
                  </button>
                  <button
                    type="button"
                    className="flex h-10 w-10 shrink-0 items-center justify-center text-[#8D8D8D]"
                    aria-label={`${term.title} 상세 보기`}
                    onClick={() => setDetailTerm(term)}
                  >
                    <ChevronRightIcon />
                  </button>
                </div>
              );
            })}
          </div>

          <div className="my-4 h-px w-full bg-[#ECEEEF]" aria-hidden="true" />

          <button
            type="button"
            className="flex h-12 w-full items-center gap-3 text-left"
            aria-pressed={isAllRequiredAgreed}
            onClick={onToggleAll}
          >
            <CheckIcon isChecked={isAllRequiredAgreed} />
            <span className="text-[16px] font-semibold leading-[1.4] text-[#292B2C]">
              전체 동의
            </span>
          </button>
        </div>
      </BottomSheet>

      {detailTerm ? (
        <div className="fixed inset-0 z-[60] bg-white">
          <div className="mx-auto flex h-[100svh] w-full max-w-[393px] flex-col bg-white">
            <header className="flex h-16 shrink-0 items-center justify-between gap-4 px-4 py-5">
              <h1 className="min-w-0 flex-1 truncate text-left text-[16px] font-medium leading-[1.4] text-[#292B2C]">
                {detailTerm.detailTitle}
              </h1>
              <button
                type="button"
                className="flex h-6 w-6 shrink-0 items-center justify-center text-[#292B2C]"
                aria-label="닫기"
                onClick={() => setDetailTerm(null)}
              >
                <CloseIcon />
              </button>
            </header>
            <section className="min-h-0 flex-1 overflow-y-auto px-4 py-5">
              <div className="flex flex-col gap-4 px-2">
                {detailTerm.content.map((paragraph) => (
                  <p
                    key={paragraph}
                    className="whitespace-pre-line break-keep text-[14px] font-normal leading-[1.4] text-[#565656]"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>
          </div>
        </div>
      ) : null}
    </>
  );
}
