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

  const headerClassName = isMain ? className : ['pt-[max(20px,env(safe-area-inset-top))]', className].filter(Boolean).join(' ');
  const innerClassName = isMain ? 'relative flex h-[60px] items-center px-4' : 'relative flex h-16 items-center px-4';
  const leadingClassName = isMain ? 'z-10 flex h-8 w-[75px] items-center' : 'z-10 flex min-w-10 items-center';
  const trailingClassName = isMain
    ? 'z-10 ml-auto flex h-7 w-7 items-center justify-end'
    : 'z-10 ml-auto flex min-h-10 min-w-10 items-center justify-end';

  return (
    <header className={headerClassName}>
      <div className={innerClassName}>
        <div className={leadingClassName}>
          {variant === 'back' ? (
            onBack ? (
              <button
                type="button"
                onClick={onBack}
                className="flex h-10 w-10 items-center justify-center text-[#333333]"
                aria-label="뒤로 가기"
              >
                <BackIcon />
              </button>
            ) : (
              <div className="h-10 w-10" aria-hidden="true" />
            )
          ) : null}

          {variant === 'exit' ? (
            onExit ? (
              <button
                type="button"
                onClick={onExit}
                className="flex h-10 w-10 items-center justify-center text-[#333333]"
                aria-label="닫기"
              >
                <CloseIcon />
              </button>
            ) : (
              <div className="h-10 w-10" aria-hidden="true" />
            )
          ) : null}

          {isMain ? <NaviLogo className="h-8 w-[75px]" aria-label="NAVI" /> : null}
        </div>

        {!isMain && title ? (
          <h1 className="pointer-events-none absolute left-1/2 max-w-[calc(100%-128px)] -translate-x-1/2 truncate text-center text-base font-semibold leading-none text-[#333333]">
            {title}
          </h1>
        ) : null}

        <div className={trailingClassName}>{rightSlot}</div>
      </div>
    </header>
  );
}
