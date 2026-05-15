import { useNavigate } from 'react-router-dom';

import { CtaButton } from '@/components/ui/CtaButton';
import { SvgIcon } from '@/components/ui/SvgIcon';

const onboardingCards = [
  [
    { label: '수강', icon: 'course' },
    { label: '학사', icon: 'calendar' },
    { label: '활동', icon: 'spark' },
    { label: '장학', icon: 'award' },
  ],
  [
    { label: '취업', icon: 'briefcase' },
    { label: '시설', icon: 'building' },
    { label: '학생 지원', icon: 'heart' },
    { label: '활동', icon: 'spark' },
    { label: '수강', icon: 'course' },
  ],
];

type OnboardingCardIcon = (typeof onboardingCards)[number][number]['icon'];

function OnboardingCardBadge({ icon }: { icon: OnboardingCardIcon }) {
  return (
    <span className="flex size-16 items-center justify-center text-[#292B2C]">
      <SvgIcon viewBox="0 0 32 32" size={38} decorative className="opacity-80">
        {icon === 'course' ? (
          <>
            <path d="M9 8.5h14a2 2 0 0 1 2 2v13H11a4 4 0 0 1-4-4v-9a2 2 0 0 1 2-2Z" fill="#31FFCC" />
            <path d="M11 8.5v15M14 13h7M14 17h5" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="1.7" />
          </>
        ) : null}
        {icon === 'calendar' ? (
          <>
            <rect x="7" y="9" width="18" height="16" rx="3" fill="#EBEDF0" />
            <path d="M7 14h18M12 7v4M20 7v4" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="1.7" />
            <path d="M12 18h2.5M17.5 18H20M12 22h2.5" stroke="#31FFCC" strokeLinecap="round" strokeWidth="2" />
          </>
        ) : null}
        {icon === 'spark' ? (
          <>
            <path d="M16 6l2.2 6.1L24 14.4l-5.8 2.4L16 23l-2.2-6.2L8 14.4l5.8-2.3L16 6Z" fill="#31FFCC" />
            <path d="M8.5 21.5l1 2.5 2.5 1-2.5 1-1 2.5-1-2.5-2.5-1 2.5-1 1-2.5ZM24 5l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8L24 5Z" fill="currentColor" opacity="0.72" />
          </>
        ) : null}
        {icon === 'award' ? (
          <>
            <circle cx="16" cy="13" r="7" fill="#31FFCC" />
            <path d="M12.5 19.2 10.5 27l5.5-3 5.5 3-2-7.8" fill="#EBEDF0" />
            <path d="m13.3 13.2 1.8 1.8 3.8-4" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
          </>
        ) : null}
        {icon === 'briefcase' ? (
          <>
            <rect x="7" y="12" width="18" height="13" rx="3" fill="#EBEDF0" />
            <path d="M12.5 12V9.5A2.5 2.5 0 0 1 15 7h2a2.5 2.5 0 0 1 2.5 2.5V12M7 16.5h18M15 17h2" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="1.7" />
            <path d="M10 21h12" stroke="#31FFCC" strokeLinecap="round" strokeWidth="2" />
          </>
        ) : null}
        {icon === 'building' ? (
          <>
            <path d="M9 25V9.5A2.5 2.5 0 0 1 11.5 7h9A2.5 2.5 0 0 1 23 9.5V25" fill="#EBEDF0" />
            <path d="M7 25h18M13 12h2M17 12h2M13 16h2M17 16h2M13 20h6" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="1.7" />
            <path d="M9 9.5A2.5 2.5 0 0 1 11.5 7h9A2.5 2.5 0 0 1 23 9.5" stroke="#31FFCC" strokeLinecap="round" strokeWidth="2" />
          </>
        ) : null}
        {icon === 'heart' ? (
          <>
            <path d="M16 25s-8-4.7-8-11a5 5 0 0 1 8-4 5 5 0 0 1 8 4c0 6.3-8 11-8 11Z" fill="#31FFCC" />
            <path d="M12 16h3l1-2.5 2 5 1-2.5h2" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" />
          </>
        ) : null}
      </SvgIcon>
    </span>
  );
}

export default function OnboardingPage() {
  const navigate = useNavigate();

  return (
    <main className="h-[100svh] overflow-hidden bg-white">
      <div className="mx-auto h-[100svh] w-full max-w-[393px] bg-white">
        <section className="mx-auto flex h-full w-full max-w-[393px] flex-col justify-between bg-white px-4 pb-[max(20px,env(safe-area-inset-bottom))]">
          <div className="-mx-4">
            <div className="flex h-[min(500px,58svh)] flex-col justify-end overflow-hidden bg-[#FAFBFD] pb-4 pt-[clamp(96px,16svh,135px)]">
              <div className="space-y-4" aria-hidden="true">
                {onboardingCards.map((cards, rowIndex) => {
                  const repeatedCards = [...cards, ...cards];

                  return (
                    <div
                      key={`onboarding-card-row-${rowIndex}`}
                      className={[
                        'onboarding-card-track flex w-max gap-4',
                        rowIndex === 0 ? 'onboarding-card-track-left' : 'onboarding-card-track-right',
                      ].join(' ')}
                    >
                      {repeatedCards.map(({ label, icon }, index) => (
                        <div
                          key={`${rowIndex}-${label}-${index}`}
                          className="flex h-32 w-28 shrink-0 flex-col items-center justify-end gap-2 rounded-xl bg-white px-4 pb-4 pt-5 text-center text-base font-normal leading-[1.4] text-[#292B2C] shadow-[0_0_8px_rgba(0,53,103,0.08)]"
                        >
                          <OnboardingCardBadge icon={icon} />
                          {label}
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>

            </div>

            <h1 className="pt-[clamp(40px,6svh,49px)] text-center text-[28px] font-normal leading-[1.4] tracking-normal text-[#292B2C]">
              <span className="block">우리 대학 정보를</span>
              <span className="block">
                <strong className="font-bold">한곳에 </strong>다 모았어요.
              </span>
            </h1>
          </div>

          <div className="w-full space-y-2 pt-[clamp(24px,6svh,58px)]">
            <CtaButton variant="primary" onClick={() => navigate('/login')}>
              로그인
            </CtaButton>
            <CtaButton variant="tertiary" onClick={() => navigate('/signup')}>
              회원가입
            </CtaButton>
          </div>
        </section>
      </div>
    </main>
  );
}
