import { useState } from 'react';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

import { AppHeader } from '@/components/ui/AppHeader';
import { CtaButton } from '@/components/ui/CtaButton';

type NoticeInterest = {
  interestId: number;
  label: string;
  icon: ReactNode;
};

function CourseIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 28 28" className="h-7 w-7">
      <path
        d="M7 6.5h12.5A2.5 2.5 0 0 1 22 9v13H9.5A3.5 3.5 0 0 1 6 18.5V7.5a1 1 0 0 1 1-1Z"
        fill="none"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="2"
      />
      <path d="M10 11h8M10 15h6" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
    </svg>
  );
}

function AcademicIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 28 28" className="h-7 w-7">
      <path
        d="M4 10.5 14 6l10 4.5-10 4.5-10-4.5Z"
        fill="none"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="2"
      />
      <path d="M8 13v5.5c0 1.4 2.7 3 6 3s6-1.6 6-3V13" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M23 11v6" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
    </svg>
  );
}

function ActivityIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 28 28" className="h-7 w-7">
      <path
        d="M14 4.5 17 11l7 .8-5.2 4.7 1.4 6.9L14 19.9l-6.2 3.5 1.4-6.9L4 11.8l7-.8 3-6.5Z"
        fill="none"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function ScholarshipIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 28 28" className="h-7 w-7">
      <rect x="5" y="7" width="18" height="14" rx="3" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M5 12h18M10 17h4" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
      <circle cx="19" cy="17" r="1.5" fill="currentColor" />
    </svg>
  );
}

function FacilityIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 28 28" className="h-7 w-7">
      <path
        d="M6 22V9l8-4 8 4v13"
        fill="none"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="2"
      />
      <path d="M10 22v-6h8v6M10 11h1.5M16.5 11H18" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
    </svg>
  );
}

function StudentSupportIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 28 28" className="h-7 w-7">
      <circle cx="14" cy="9" r="4" fill="none" stroke="currentColor" strokeWidth="2" />
      <path
        d="M6.5 23c.9-4.1 3.5-6.5 7.5-6.5s6.6 2.4 7.5 6.5"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="2"
      />
      <path d="M22 7v4M20 9h4" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
    </svg>
  );
}

const noticeInterests: NoticeInterest[] = [
  { interestId: 0, label: '수강', icon: <CourseIcon /> },
  { interestId: 1, label: '학사', icon: <AcademicIcon /> },
  { interestId: 2, label: '활동', icon: <ActivityIcon /> },
  { interestId: 3, label: '장학/금융', icon: <ScholarshipIcon /> },
  { interestId: 4, label: '시설', icon: <FacilityIcon /> },
  { interestId: 5, label: '학생 지원', icon: <StudentSupportIcon /> },
];

export default function NoticeInterestsPage() {
  const navigate = useNavigate();
  const [interestIds, setInterestIds] = useState<number[]>([]);
  const isCtaEnabled = interestIds.length >= 3;

  const toggleInterest = (interestId: number) => {
    setInterestIds((currentInterestIds) => {
      if (currentInterestIds.includes(interestId)) {
        return currentInterestIds.filter((selectedInterestId) => selectedInterestId !== interestId);
      }

      return [...currentInterestIds, interestId];
    });
  };

  const handleNext = () => {
    // TODO: Connect the notification permission BottomSheet in a later issue.
    void interestIds;
  };

  return (
    <main className="min-h-[100svh] bg-white">
      <div className="mx-auto flex min-h-[100svh] w-full max-w-[393px] flex-col bg-white">
        <div>
          <AppHeader title="맞춤 공지 설정" onBack={() => navigate('/home')} />
          <div className="h-[3px] w-full bg-[#D9D9D9]">
            <div className="h-full w-full bg-[#6C6C6C]" />
          </div>
        </div>

        <section className="flex flex-1 flex-col px-5 pb-[112px] pt-12">
          <h1 className="whitespace-pre-line text-[24px] font-bold leading-[1.4] tracking-normal text-[#202020]">
            {'알림을 받고 싶은 공지 키워드를\n모두 골라주세요.'}
          </h1>
          <p className="mt-3 text-[15px] font-medium leading-[1.5] tracking-normal text-[#8E8E8E]">
            최소 3개 이상 선택
          </p>

          <div className="mt-12 grid grid-cols-3 gap-x-3 gap-y-8">
            {noticeInterests.map((interest) => {
              const isSelected = interestIds.includes(interest.interestId);

              return (
                <button
                  key={interest.interestId}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => toggleInterest(interest.interestId)}
                  className="group flex min-w-0 flex-col items-center gap-3 text-center"
                >
                  <span
                    className={[
                      'flex h-[72px] w-[72px] items-center justify-center rounded-[20px] transition-colors duration-200',
                      isSelected ? 'bg-[#1E2530] text-[#31FFCC]' : 'bg-[#F2F3F5] text-[#202020]',
                    ].join(' ')}
                  >
                    {interest.icon}
                  </span>
                  <span
                    className={[
                      'w-full break-keep text-[15px] leading-[1.35] tracking-normal transition-colors duration-200',
                      isSelected ? 'font-bold text-[#202020]' : 'font-medium text-[#505050]',
                    ].join(' ')}
                  >
                    {interest.label}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <div className="fixed bottom-0 left-1/2 z-20 w-full max-w-[393px] -translate-x-1/2 bg-white px-5 pb-[max(24px,env(safe-area-inset-bottom))] pt-3">
          <CtaButton
            type="button"
            variant="primary"
            state={isCtaEnabled ? 'default' : 'disabled'}
            size="xlg"
            disabled={!isCtaEnabled}
            onClick={handleNext}
          >
            다음
          </CtaButton>
        </div>
      </div>
    </main>
  );
}
