import type { ReactNode } from 'react';
import { useEffect, useId } from 'react';

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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-5"
      role="dialog"
      aria-modal="true"
      aria-labelledby={resolvedTitleId}
    >
      <div className="flex w-full max-w-[353px] flex-col items-start rounded-[28px] bg-white px-0 pb-4 pt-3 shadow-[0_20px_48px_rgba(0,0,0,0.18)]">
        <div className="relative flex h-12 w-full items-center justify-center px-5 py-3">
          <h2 id={resolvedTitleId} className="text-center text-[18px] font-semibold leading-[120%] text-[#131416]">
            {title}
          </h2>
        </div>

        {children}

        {footer ? (
          <div
            className={[
              'flex w-full items-start gap-2 px-5 pt-0',
              footerLayout === 'vertical' ? 'flex-col' : 'flex-row',
            ].join(' ')}
          >
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  );
}
