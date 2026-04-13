import type { ReactNode } from 'react';

import { BackIcon } from '@/features/signup/components/SignupIcons';

type AppHeaderProps = {
  title?: string;
  onBack?: () => void;
  rightSlot?: ReactNode;
  className?: string;
};

export function AppHeader({ title, onBack, rightSlot, className = '' }: AppHeaderProps) {
  return (
    <header className={['pt-[max(20px,env(safe-area-inset-top))]', className].filter(Boolean).join(' ')}>
      <div className="grid h-[60px] grid-cols-[40px_1fr_40px] items-center px-5">
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            className="flex h-10 w-10 items-center justify-center text-[#2B2B2B]"
            aria-label="뒤로 가기"
          >
            <BackIcon />
          </button>
        ) : (
          <div className="h-10 w-10" aria-hidden="true" />
        )}

        {title ? <h1 className="text-center font-semibold leading-none tracking-[-0.02em] text-[#2B2B2B]">{title}</h1> : null}

        <div className="flex h-10 w-10 items-center justify-center">{rightSlot}</div>
      </div>
    </header>
  );
}
