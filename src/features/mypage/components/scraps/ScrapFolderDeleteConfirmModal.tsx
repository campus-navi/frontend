import { CtaButton } from '@/components/ui/CtaButton';
import { Modal } from '@/components/ui/Modal';

type ScrapFolderDeleteConfirmModalProps = {
  errorMessage: string | null;
  folderName: string;
  isOpen: boolean;
  isPending: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export function ScrapFolderDeleteConfirmModal({
  errorMessage,
  folderName,
  isOpen,
  isPending,
  onCancel,
  onConfirm,
}: ScrapFolderDeleteConfirmModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      title="폴더를 제거할까요?"
      titleId="scrap-folder-delete-modal-title"
      footer={
        <>
          <CtaButton
            type="button"
            variant="tertiary"
            size="xlg"
            state="default"
            disabled={isPending}
            onClick={onCancel}
          >
            취소
          </CtaButton>
          <CtaButton
            type="button"
            variant="primary"
            size="xlg"
            state="error"
            disabled={isPending}
            onClick={onConfirm}
          >
            제거
          </CtaButton>
        </>
      }
    >
      <div className="flex w-full flex-col items-center px-5 pb-6 pt-3">
        <p className="whitespace-pre-line text-center text-[16px] font-medium leading-[1.4] text-[#5E5E5E]">
          {`${folderName} 폴더를 제거하면\n목록에서 삭제돼요.`}
        </p>
        {errorMessage ? (
          <p className="mt-3 text-center text-sm font-medium leading-[1.4] text-[#FF5E47]" role="alert">
            {errorMessage}
          </p>
        ) : null}
      </div>
    </Modal>
  );
}
