import type { ReactNode } from 'react';
import { useEffect, useId } from 'react';

type BottomSheetProps = {
  children: ReactNode;
  footer?: ReactNode;
  isOpen: boolean;
  title: ReactNode;
  titleId?: string;
};

export function BottomSheet({ children, footer, isOpen, title, titleId }: BottomSheetProps) {
  const generatedTitleId = useId();
  const resolvedTitleId = titleId ?? generatedTitleId;

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/45 px-0"
      role="dialog"
      aria-modal="true"
      aria-labelledby={resolvedTitleId}
    >
      <div className="flex w-full max-w-[393px] animate-[signup-sheet-up_280ms_cubic-bezier(0.22,1,0.36,1)] flex-col items-start rounded-t-[28px] bg-white px-0 pb-[max(24px,env(safe-area-inset-bottom))] pt-4 shadow-[0_20px_48px_rgba(0,0,0,0.18)]">
        <div className="mx-auto mb-2 h-1.5 w-12 rounded-full bg-[#D8D8D8]" aria-hidden="true" />

        <div className="relative flex h-12 w-full items-center justify-center px-5 py-3">
          <h2 id={resolvedTitleId} className="text-center text-[16px] font-semibold leading-[120%] text-[#131416]">
            {title}
          </h2>
        </div>

        {children}

        {footer ? <div className="flex w-full items-start gap-2 px-5 pt-0">{footer}</div> : null}
      </div>
    </div>
  );
}
