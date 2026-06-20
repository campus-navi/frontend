import type { MyPageScrapFolder } from '@/api';
import { CtaButton } from '@/components/ui/CtaButton';
import { FolderScrapListItem } from '@/features/mypage/components/scraps/FolderScrapListItem';
import { ScrapFolderDetailHeader } from '@/features/mypage/components/scraps/ScrapFolderDetailHeader';
import { ScrapMoveBottomSheet } from '@/features/mypage/components/scraps/ScrapMoveBottomSheet';
import { ScrapRemovalSnackbar } from '@/features/mypage/components/scraps/ScrapRemovalSnackbar';
import type { MyPageFolderScrapListItem } from '@/features/mypage/types';

type MyPageScrapFolderViewProps = {
  availableMoveFolders: MyPageScrapFolder[];
  emptyMessage: string;
  errorMessage: string;
  folderName: string;
  invalidFolderMessage: string;
  isError: boolean;
  isInvalidFolderId: boolean;
  isLoading: boolean;
  isMoveFoldersLoading: boolean;
  isMoveScrapPending: boolean;
  isMoveSheetOpen: boolean;
  isMultiSelectMode: boolean;
  isRemoveScrapPending: boolean;
  isRemoveSelectedPending: boolean;
  isRemoveSelectedSnackbarVisible: boolean;
  items: MyPageFolderScrapListItem[];
  moveScrapErrorMessage: string | null;
  movingScrap: MyPageFolderScrapListItem | null;
  onBack: () => void;
  onCloseMoveSheet: () => void;
  onCloseRemoveSelectedSnackbar: () => void;
  onCloseScrapMoreMenu: () => void;
  onConfirmMoveScrap: () => void;
  onDeleteScrap: (item: MyPageFolderScrapListItem) => void;
  onEnterMultiSelectMode: () => void;
  onExitMultiSelectMode: () => void;
  onMoveScrap: (item: MyPageFolderScrapListItem) => void;
  onRemoveSelectedScraps: () => void;
  onScrapMoreClick: (item: MyPageFolderScrapListItem) => void;
  onSelectMoveTargetFolder: (folderId: number) => void;
  onToggleScrapSelection: (scrapId: number) => void;
  removeSelectedErrorMessage: string | null;
  removeScrapErrorMessage: string | null;
  removedScrapCount: number | null;
  scrapCount: number;
  selectedScrapCount: number;
  selectedScrapIds: number[];
  selectedTargetFolderId: number | null;
  selectedScrapMoreMenu: MyPageFolderScrapListItem | null;
  shouldShowEmptyMessage: boolean;
};

export function MyPageScrapFolderView({
  availableMoveFolders,
  emptyMessage,
  errorMessage,
  folderName,
  invalidFolderMessage,
  isError,
  isInvalidFolderId,
  isLoading,
  isMoveFoldersLoading,
  isMoveScrapPending,
  isMoveSheetOpen,
  isMultiSelectMode,
  isRemoveScrapPending,
  isRemoveSelectedPending,
  isRemoveSelectedSnackbarVisible,
  items,
  moveScrapErrorMessage,
  movingScrap,
  onBack,
  onCloseMoveSheet,
  onCloseRemoveSelectedSnackbar,
  onCloseScrapMoreMenu,
  onConfirmMoveScrap,
  onDeleteScrap,
  onEnterMultiSelectMode,
  onExitMultiSelectMode,
  onMoveScrap,
  onRemoveSelectedScraps,
  onScrapMoreClick,
  onSelectMoveTargetFolder,
  onToggleScrapSelection,
  removeSelectedErrorMessage,
  removeScrapErrorMessage,
  removedScrapCount,
  scrapCount,
  selectedScrapCount,
  selectedScrapIds,
  selectedTargetFolderId,
  selectedScrapMoreMenu,
  shouldShowEmptyMessage,
}: MyPageScrapFolderViewProps) {
  return (
    <main className="min-h-[100svh] bg-white">
      <div className="mx-auto flex min-h-[100svh] w-full max-w-[393px] flex-col bg-white">
        <div className="fixed inset-x-0 top-0 z-20 bg-white">
          <div className="mx-auto w-full max-w-[393px] bg-white">
            <ScrapFolderDetailHeader
              folderName={folderName}
              isMultiSelectMode={isMultiSelectMode}
              scrapCount={scrapCount}
              onBack={onBack}
              onEnterMultiSelectMode={onEnterMultiSelectMode}
            />
          </div>
        </div>
        <div className="h-[calc(64px+max(20px,env(safe-area-inset-top)))] shrink-0" aria-hidden="true" />

        <section
          className={[
            'flex flex-1 flex-col px-4 pt-5',
            isMultiSelectMode
              ? 'pb-[calc(128px+env(safe-area-inset-bottom))]'
              : 'pb-[max(32px,env(safe-area-inset-bottom))]',
          ].join(' ')}
        >
          <div className="flex flex-1 flex-col">
            {isInvalidFolderId ? (
              <div className="rounded-xl bg-[#FFF4F2] px-4 py-3 text-sm font-medium leading-[1.4] text-[#FF5E47]">
                {invalidFolderMessage}
              </div>
            ) : null}

            {isLoading ? (
              <div className="rounded-xl bg-[#F6F7F9] px-4 py-3 text-sm font-medium leading-[1.4] text-[#565656]">
                스크랩 목록을 불러오는 중이에요.
              </div>
            ) : null}

            {isError ? (
              <div className="rounded-xl bg-[#FFF4F2] px-4 py-3 text-sm font-medium leading-[1.4] text-[#FF5E47]">
                {errorMessage}
              </div>
            ) : null}

            {removeScrapErrorMessage ? (
              <div
                className="mb-4 rounded-xl bg-[#FFF4F2] px-4 py-3 text-sm font-medium leading-[1.4] text-[#FF5E47]"
                role="alert"
              >
                {removeScrapErrorMessage}
              </div>
            ) : null}

            {removeSelectedErrorMessage ? (
              <div
                className="mb-4 rounded-xl bg-[#FFF4F2] px-4 py-3 text-sm font-medium leading-[1.4] text-[#FF5E47]"
                role="alert"
              >
                {removeSelectedErrorMessage}
              </div>
            ) : null}

            {shouldShowEmptyMessage ? (
              <div className="flex flex-1 items-center justify-center px-4 text-center">
                <p className="text-[16px] font-medium leading-[1.4] text-[#8A9299]">
                  {emptyMessage}
                </p>
              </div>
            ) : null}

            {items.length > 0 ? (
              <div className="flex flex-col gap-8" aria-label="폴더 스크랩 목록">
                {items.map((item) => (
                  <FolderScrapListItem
                    key={item.scrapId}
                    item={item}
                    isMultiSelectMode={isMultiSelectMode}
                    isMoreMenuOpen={selectedScrapMoreMenu?.scrapId === item.scrapId}
                    isRemovePending={
                      isRemoveScrapPending &&
                      selectedScrapMoreMenu?.scrapId === item.scrapId
                    }
                    isSelected={selectedScrapIds.includes(item.scrapId)}
                    isSelectionDisabled={isRemoveSelectedPending || isMoveScrapPending}
                    onCloseMoreMenu={onCloseScrapMoreMenu}
                    onDelete={onDeleteScrap}
                    onMoreClick={onScrapMoreClick}
                    onMove={onMoveScrap}
                    onToggleSelection={onToggleScrapSelection}
                  />
                ))}
              </div>
            ) : null}
          </div>
        </section>
      </div>

      {isMultiSelectMode ? (
        <div className="fixed inset-x-0 bottom-0 z-20 bg-white px-4 pb-[max(60px,calc(36px+env(safe-area-inset-bottom)))] pt-3">
          <div className="mx-auto flex w-full max-w-[361px] gap-2">
            <CtaButton
              type="button"
              variant="tertiary"
              size="xlg"
              state="default"
              fullWidth={false}
              className="w-[120px] shrink-0"
              disabled={isRemoveSelectedPending}
              onClick={onExitMultiSelectMode}
            >
              취소
            </CtaButton>
            <CtaButton
              type="button"
              variant="primary"
              size="xlg"
              state="default"
              fullWidth={false}
              className="flex-1"
              disabled={selectedScrapCount === 0 || isRemoveSelectedPending}
              onClick={onRemoveSelectedScraps}
            >
              {selectedScrapCount > 0 ? `제거하기 ${selectedScrapCount}` : '제거하기'}
            </CtaButton>
          </div>
        </div>
      ) : null}

      <ScrapMoveBottomSheet
        errorMessage={moveScrapErrorMessage}
        folders={availableMoveFolders}
        isLoading={isMoveFoldersLoading}
        isOpen={isMoveSheetOpen && movingScrap !== null}
        isPending={isMoveScrapPending}
        selectedTargetFolderId={selectedTargetFolderId}
        onClose={onCloseMoveSheet}
        onConfirm={onConfirmMoveScrap}
        onSelectFolder={onSelectMoveTargetFolder}
      />

      <ScrapRemovalSnackbar
        count={removedScrapCount ?? 0}
        isVisible={isRemoveSelectedSnackbarVisible}
        onClose={onCloseRemoveSelectedSnackbar}
      />
    </main>
  );
}
