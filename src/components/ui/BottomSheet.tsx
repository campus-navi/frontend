import type { ReactNode } from 'react';
import { useId } from 'react';

import { DimmedOverlay } from '@/components/ui/DimmedOverlay';
import { SvgIcon } from '@/components/ui/SvgIcon';
import { useBodyScrollLock } from '@/components/ui/useBodyScrollLock';

type BottomSheetType = 'accent' | 'center' | 'left';

type BottomSheetProps = {
  children: ReactNode;
  footer?: ReactNode;
  footerClassName?: string;
  isOpen: boolean;
  title: ReactNode;
  titleId?: string;
  type?: BottomSheetType;
  onClose?: () => void;
};

function BottomSheetCloseButton({ isVisible, onClose }: { isVisible: boolean; onClose?: () => void }) {
  if (!isVisible) {
    return <div className="h-6 w-6 shrink-0" aria-hidden="true" />;
  }

  return (
    <button
      type="button"
      className="flex h-6 w-6 shrink-0 items-center justify-center text-[#292B2C]"
      aria-label="닫기"
      onClick={onClose}
    >
      <SvgIcon size={24} viewBox="0 0 24 24">
        <path d="M6 6L18 18M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </SvgIcon>
    </button>
  );
}

export function BottomSheet({
  children,
  footer,
  footerClassName = '',
  isOpen,
  title,
  titleId,
  type = 'accent',
  onClose,
}: BottomSheetProps) {
  const generatedTitleId = useId();
  const resolvedTitleId = titleId ?? generatedTitleId;
  const shouldShowCloseButton = type !== 'accent';

  useBodyScrollLock(isOpen);

  if (!isOpen) {
    return null;
  }

  return (
    <DimmedOverlay
      className="fixed inset-0 z-[70] flex justify-center overflow-hidden px-0"
      role="dialog"
      aria-modal="true"
      aria-labelledby={resolvedTitleId}
    >
      <div className="flex h-full w-full max-w-[393px] items-end overflow-hidden">
        <div className="flex max-h-[100svh] w-full animate-[signup-sheet-up_280ms_cubic-bezier(0.22,1,0.36,1)] flex-col items-start gap-4 overflow-hidden rounded-t-[28px] bg-white px-0 shadow-[0_20px_48px_rgba(0,0,0,0.18)]">
          <div className="flex h-[77px] w-full flex-col items-start">
            <div className="flex h-5 w-full flex-col items-start pt-4">
              <div className="flex h-1 w-full items-center justify-center px-2.5">
                <div className="h-1 w-12 max-w-16 rounded-full bg-[#DCDFE2]" aria-hidden="true" />
              </div>
            </div>

            {type === 'center' ? (
              <div className="grid h-[57px] w-full grid-cols-[24px_1fr_24px] items-center bg-white px-5 py-4">
                <BottomSheetCloseButton isVisible={shouldShowCloseButton} onClose={onClose} />
                <h2 id={resolvedTitleId} className="min-w-0 text-center text-[18px] font-semibold leading-[140%] text-[#292B2C]">
                  {title}
                </h2>
                <div className="h-6 w-6" aria-hidden="true" />
              </div>
            ) : null}

            {type === 'left' ? (
              <div className="flex h-[57px] w-full items-center justify-between bg-white px-5 py-4">
                <h2 id={resolvedTitleId} className="min-w-0 text-left text-[18px] font-semibold leading-[140%] text-[#292B2C]">
                  {title}
                </h2>
                <BottomSheetCloseButton isVisible={shouldShowCloseButton} onClose={onClose} />
              </div>
            ) : null}

            {type === 'accent' ? (
              <div className="flex h-[57px] w-full items-center justify-center bg-white px-5 py-4">
                <h2 id={resolvedTitleId} className="min-w-0 text-center text-[18px] font-semibold leading-[140%] text-[#292B2C]">
                  {title}
                </h2>
              </div>
            ) : null}
          </div>

          {children}

          {footer ? (
            <div
              className={[
                'flex w-full flex-col items-center justify-center gap-2 px-4 pb-[max(40px,env(safe-area-inset-bottom))] pt-3',
                footerClassName,
              ]
                .filter(Boolean)
                .join(' ')}
            >
              {footer}
            </div>
          ) : null}
        </div>
      </div>
    </DimmedOverlay>
  );
}
