import type { ReactNode } from 'react';
import { useId } from 'react';

import { DimmedOverlay } from '@/components/ui/DimmedOverlay';
import { useBodyScrollLock } from '@/components/ui/useBodyScrollLock';

type ModalFooterLayout = 'horizontal' | 'vertical';

type ModalProps = {
  children: ReactNode;
  footer?: ReactNode;
  footerLayout?: ModalFooterLayout;
  isOpen: boolean;
  title: ReactNode;
  titleId?: string;
};

export function Modal({ children, footer, footerLayout = 'horizontal', isOpen, title, titleId }: ModalProps) {
  const generatedTitleId = useId();
  const resolvedTitleId = titleId ?? generatedTitleId;

  useBodyScrollLock(isOpen);

  if (!isOpen) {
    return null;
  }

  return (
    <DimmedOverlay
      className="fixed inset-0 z-[70] flex items-center justify-center px-5"
      role="dialog"
      aria-modal="true"
      aria-labelledby={resolvedTitleId}
    >
      <div className="flex w-full max-w-[353px] flex-col items-start rounded-[28px] bg-white px-0 pb-5 pt-3 shadow-[0_20px_48px_rgba(0,0,0,0.18)]">
        <div className="relative flex h-[49px] w-full items-center justify-center px-5 py-3">
          <h2 id={resolvedTitleId} className="text-center text-[18px] font-semibold leading-[140%] text-[#292B2C]">
            {title}
          </h2>
        </div>

        {children}

        {footer ? (
          <div
            className={[
              'flex w-full items-start gap-2 px-5 pt-2',
              footerLayout === 'vertical' ? 'flex-col' : 'flex-row',
            ].join(' ')}
          >
            {footer}
          </div>
        ) : null}
      </div>
    </DimmedOverlay>
  );
}
