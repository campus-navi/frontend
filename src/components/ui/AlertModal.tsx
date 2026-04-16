import { useEffect } from 'react';

type AlertModalProps = {
  confirmLabel?: string;
  description: string;
  isOpen: boolean;
  placement?: 'bottom-sheet' | 'center';
  title: string;
  onConfirm: () => void;
};

export function AlertModal({
  confirmLabel = '확인',
  description,
  isOpen,
  placement = 'center',
  title,
  onConfirm,
}: AlertModalProps) {
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

  const isBottomSheet = placement === 'bottom-sheet';

  return (
    <div
      className={[
        'fixed inset-0 z-50 flex bg-black/45',
        isBottomSheet ? 'items-end justify-center px-0' : 'items-center justify-center px-5',
      ].join(' ')}
      role="dialog"
      aria-modal="true"
      aria-labelledby="alert-modal-title"
    >
      <div
        className={[
          'flex w-full flex-col items-start bg-white px-0 shadow-[0_20px_48px_rgba(0,0,0,0.18)]',
          isBottomSheet
            ? 'max-w-[393px] animate-[signup-sheet-up_280ms_cubic-bezier(0.22,1,0.36,1)] rounded-t-[24px] pb-[max(24px,env(safe-area-inset-bottom))] pt-4'
            : 'max-w-[353px] rounded-[16px] pb-4 pt-3',
        ].join(' ')}
      >
        {isBottomSheet ? <div className="mx-auto mb-2 h-1.5 w-12 rounded-full bg-[#D8D8D8]" aria-hidden="true" /> : null}
        <div className="relative flex h-12 w-full items-center justify-center px-5 py-3">
          <h2 id="alert-modal-title" className="text-center text-[16px] font-semibold leading-[120%] text-[#131416]">
            {title}
          </h2>
        </div>

        <div className="flex w-full items-start px-5 py-6">
          <div className="flex h-10 w-full items-center justify-center">
            <p className="text-center text-[14px] font-medium leading-[140%] text-[#5E5E5E]">{description}</p>
          </div>
        </div>

        <div className="flex w-full items-start gap-2 px-5 pt-0">
          <button
            type="button"
            onClick={onConfirm}
            className="flex h-14 w-full items-center justify-center rounded-[12px] bg-[#333333] px-4 py-5 text-[16px] font-semibold leading-none tracking-[0.015em] text-white transition-colors hover:bg-[#2b2b2b]"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
