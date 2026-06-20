import type { MyPageScrapFolder } from '@/api';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { CtaButton } from '@/components/ui/CtaButton';

type ScrapMoveBottomSheetProps = {
  errorMessage: string | null;
  folders: MyPageScrapFolder[];
  isLoading: boolean;
  isOpen: boolean;
  isPending: boolean;
  selectedTargetFolderId: number | null;
  onClose: () => void;
  onConfirm: () => void;
  onOpenCreateFolder: () => void;
  onSelectFolder: (folderId: number) => void;
};

export function ScrapMoveBottomSheet({
  errorMessage,
  folders,
  isLoading,
  isOpen,
  isPending,
  selectedTargetFolderId,
  onClose,
  onConfirm,
  onOpenCreateFolder,
  onSelectFolder,
}: ScrapMoveBottomSheetProps) {
  const isSubmitDisabled = selectedTargetFolderId === null || isPending;

  return (
    <BottomSheet
      isOpen={isOpen}
      title="폴더 이동"
      titleId="scrap-move-sheet-title"
      type="center"
      onClose={onClose}
      footer={
        <div className="flex w-full gap-2">
          <CtaButton
            type="button"
            variant="tertiary"
            size="xlg"
            state="default"
            disabled={isPending}
            onClick={onOpenCreateFolder}
          >
            새 폴더
          </CtaButton>
          <CtaButton
            type="button"
            variant="primary"
            size="xlg"
            state="default"
            disabled={isSubmitDisabled}
            onClick={onConfirm}
          >
            저장
          </CtaButton>
        </div>
      }
    >
      <div className="flex min-h-[232px] w-full flex-col px-4">
        {isLoading ? (
          <p className="flex min-h-24 items-center justify-center text-center text-sm font-medium leading-[1.4] text-[#8A9299]">
            이동 가능한 폴더를 불러오는 중이에요.
          </p>
        ) : null}

        {!isLoading && folders.length === 0 ? (
          <p className="flex min-h-24 items-center justify-center text-center text-sm font-medium leading-[1.4] text-[#8A9299]">
            이동 가능한 폴더가 없습니다.
          </p>
        ) : null}

        {!isLoading && folders.length > 0 ? (
          <div className="flex max-h-[288px] flex-col overflow-y-auto" role="radiogroup" aria-label="이동할 폴더 선택">
            {folders.map((folder) => {
              const isSelected = selectedTargetFolderId === folder.folderId;

              return (
                <button
                  key={folder.folderId}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  className="flex h-12 w-full shrink-0 items-center justify-between gap-3 py-3 text-left"
                  disabled={isPending}
                  onClick={() => onSelectFolder(folder.folderId)}
                >
                  <span className="min-w-0 flex-1 truncate text-[16px] font-medium leading-[1.4] text-[#292B2C]">
                    {folder.name}
                  </span>
                  <span
                    className={[
                      'flex h-6 min-h-6 max-h-6 w-6 min-w-6 max-w-6 shrink-0 items-center justify-center rounded-full border-[1.25px]',
                      isSelected
                        ? 'border-transparent bg-[#292B2C]'
                        : 'border-[#DCDFE2] bg-white',
                    ].join(' ')}
                    aria-hidden="true"
                  >
                    {isSelected ? <span className="h-2 w-2 rounded-full bg-white" /> : null}
                  </span>
                </button>
              );
            })}
          </div>
        ) : null}

        {errorMessage ? (
          <p className="mt-3 text-center text-sm font-medium leading-[1.4] text-[#FF5E47]" role="alert">
            {errorMessage}
          </p>
        ) : null}
      </div>
    </BottomSheet>
  );
}
