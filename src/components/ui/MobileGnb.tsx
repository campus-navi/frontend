import type { CSSProperties, ReactNode } from 'react';
import { NavLink } from 'react-router-dom';

import { SvgIcon } from '@/components/ui/SvgIcon';

type MobileGnbItem = 'home' | 'community' | 'date' | 'info' | 'my';

type MobileGnbProps = {
  activeItem: MobileGnbItem;
};

const items: Array<{ id: MobileGnbItem; label: string; path?: string; icon: ReactNode }> = [
  { id: 'home', label: '홈', path: '/home', icon: <HomeIcon /> },
  { id: 'community', label: '커뮤니티', icon: <CommunityIcon /> },
  { id: 'date', label: '시간표', icon: <CalendarIcon /> },
  { id: 'info', label: '교내정보', path: '/info', icon: <InfoIcon /> },
  { id: 'my', label: '마이페이지', icon: <MyIcon /> },
];

const mobileGnbSafeAreaStyle = {
  '--mobile-gnb-safe-area': 'max(32px, env(safe-area-inset-bottom))',
} as CSSProperties;

export function MobileGnb({ activeItem }: MobileGnbProps) {
  return (
    <>
      <div
        className="pointer-events-none fixed bottom-[calc(var(--mobile-gnb-safe-area)*-1)] left-1/2 z-30 h-[calc(54px+var(--mobile-gnb-safe-area)+var(--mobile-gnb-safe-area))] w-full max-w-[393px] -translate-x-1/2 bg-white"
        style={mobileGnbSafeAreaStyle}
        aria-hidden="true"
      />
      <nav
        className="fixed bottom-0 left-1/2 z-40 h-[calc(54px+var(--mobile-gnb-safe-area))] w-full max-w-[393px] -translate-x-1/2 border-t border-[#DCDFE2] bg-white px-1 pb-[var(--mobile-gnb-safe-area)] pt-2"
        style={mobileGnbSafeAreaStyle}
        aria-label="주요 메뉴"
      >
        <ul className="grid h-full grid-cols-5">
          {items.map((item) => {
            const baseClassName =
              'flex h-full w-full flex-col items-center justify-center gap-1 text-[14px] font-normal leading-[18px] tracking-[-0.02em] transition-colors';

            return (
              <li key={item.id} className="min-w-0">
                {item.path ? (
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      [baseClassName, isActive || item.id === activeItem ? 'text-[#292B2C]' : 'text-[#BFC4C8]']
                        .filter(Boolean)
                        .join(' ')
                    }
                  >
                    {item.icon}
                    <span className="whitespace-nowrap">{item.label}</span>
                  </NavLink>
                ) : (
                  <button
                    type="button"
                    className={[baseClassName, 'cursor-default text-[#BFC4C8]'].join(' ')}
                    aria-disabled="true"
                  >
                    {item.icon}
                    <span className="whitespace-nowrap">{item.label}</span>
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}

function HomeIcon() {
  return (
    <SvgIcon size={24} viewBox="0 0 24 24">
      <path
        d="M4.5 11.4 12 5l7.5 6.4v7.1a1.5 1.5 0 0 1-1.5 1.5h-3.2v-5.3H9.2V20H6a1.5 1.5 0 0 1-1.5-1.5v-7.1Z"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </SvgIcon>
  );
}

function CommunityIcon() {
  return (
    <SvgIcon size={24} viewBox="0 0 24 24">
      <path
        d="M12 11.2a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4ZM6.2 19.2a5.8 5.8 0 0 1 11.6 0M5.6 9.6a2.4 2.4 0 1 0 0-4.8M2.8 17.1a4.2 4.2 0 0 1 3.6-3.8M18.4 9.6a2.4 2.4 0 1 0 0-4.8M21.2 17.1a4.2 4.2 0 0 0-3.6-3.8"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </SvgIcon>
  );
}

function CalendarIcon() {
  return (
    <SvgIcon size={24} viewBox="0 0 24 24">
      <path
        d="M7.2 4.2v3M16.8 4.2v3M5 9.2h14M6.5 5.8h11A1.5 1.5 0 0 1 19 7.3v11.2a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 5 18.5V7.3a1.5 1.5 0 0 1 1.5-1.5Z"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </SvgIcon>
  );
}

function InfoIcon() {
  return (
    <SvgIcon size={24} viewBox="0 0 24 24">
      <path
        d="M5.2 5h12.6A1.2 1.2 0 0 1 19 6.2v11.6a1.2 1.2 0 0 1-1.2 1.2H5.2A1.2 1.2 0 0 1 4 17.8V6.2A1.2 1.2 0 0 1 5.2 5ZM8.2 5v14M11.2 9h4.5M11.2 12h4.5"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </SvgIcon>
  );
}

function MyIcon() {
  return (
    <SvgIcon size={24} viewBox="0 0 24 24">
      <path
        d="M12 11.2a3.8 3.8 0 1 0 0-7.6 3.8 3.8 0 0 0 0 7.6ZM5.2 20.4a6.8 6.8 0 0 1 13.6 0"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </SvgIcon>
  );
}
