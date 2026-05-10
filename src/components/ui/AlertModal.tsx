import { BottomSheet } from '@/components/ui/BottomSheet';
import { CtaButton } from '@/components/ui/CtaButton';
import { Modal } from '@/components/ui/Modal';

type AlertModalProps = {
  confirmLabel?: string;
  description: string;
  isConfirmCta?: boolean;
  isOpen: boolean;
  placement?: 'bottom-sheet' | 'center';
  title: string;
  onConfirm: () => void;
};

export function AlertModal({
  confirmLabel = '확인',
  description,
  isConfirmCta = false,
  isOpen,
  placement = 'center',
  title,
  onConfirm,
}: AlertModalProps) {
  const body = (
    <div className="flex w-full items-start px-5 py-6">
      <div className="flex h-10 w-full items-center justify-center">
        <p className="text-center text-[14px] font-medium leading-[140%] text-[#5E5E5E]">{description}</p>
      </div>
    </div>
  );

  const footer = isConfirmCta ? (
    <CtaButton type="button" variant="primary" state="default" size="xlg" onClick={onConfirm}>
      {confirmLabel}
    </CtaButton>
  ) : (
    <button
      type="button"
      onClick={onConfirm}
      className="flex h-14 w-full items-center justify-center rounded-[12px] bg-[#333333] px-4 py-5 text-[16px] font-semibold leading-none tracking-[0.015em] text-white transition-colors hover:bg-[#2b2b2b]"
    >
      {confirmLabel}
    </button>
  );

  if (placement === 'bottom-sheet') {
    return (
      <BottomSheet isOpen={isOpen} title={title} titleId="alert-modal-title" footer={footer}>
        {body}
      </BottomSheet>
    );
  }

  return (
    <Modal isOpen={isOpen} title={title} titleId="alert-modal-title" footer={footer}>
      {body}
    </Modal>
  );
}
