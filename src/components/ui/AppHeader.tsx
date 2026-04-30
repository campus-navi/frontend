import type { ReactNode } from 'react';

import { BackIcon, CloseIcon } from '@/components/ui/HeaderIcons';
import { NaviLogo } from '@/components/ui/NaviLogo';

type AppHeaderVariant = 'back' | 'exit' | 'main';

type AppHeaderProps = {
  variant?: AppHeaderVariant;
  title?: string;
  onBack?: () => void;
  onExit?: () => void;
  rightSlot?: ReactNode;
  className?: string;
};

export function AppHeader({
  variant = 'back',
  title,
  onBack,
  onExit,
  rightSlot,
  className = '',
}: AppHeaderProps) {
  const isMain = variant === 'main';

  return (
    <header className={['pt-[max(20px,env(safe-area-inset-top))]', className].filter(Boolean).join(' ')}>
      <div className="relative flex h-16 items-center px-4">
        <div className="z-10 flex min-w-10 items-center">
          {variant === 'back' ? (
            <button
              type="button"
              onClick={onBack}
              className="flex h-10 w-10 items-center justify-center text-[#333333] disabled:opacity-40"
              disabled={!onBack}
              aria-label="뒤로 가기"
            >
              <BackIcon />
            </button>
          ) : null}

          {variant === 'exit' ? (
            <button
              type="button"
              onClick={onExit}
              className="flex h-10 w-10 items-center justify-center text-[#333333] disabled:opacity-40"
              disabled={!onExit}
              aria-label="닫기"
            >
              <CloseIcon />
            </button>
          ) : null}

          {isMain ? <NaviLogo className="h-8 w-[120px]" aria-label="NAVI" /> : null}
        </div>

        {!isMain && title ? (
          <h1 className="pointer-events-none absolute left-1/2 max-w-[calc(100%-128px)] -translate-x-1/2 truncate text-center text-base font-semibold leading-none text-[#333333]">
            {title}
          </h1>
        ) : null}

        <div className="z-10 ml-auto flex min-h-10 min-w-10 items-center justify-end">{rightSlot}</div>
      </div>
    </header>
  );
}
