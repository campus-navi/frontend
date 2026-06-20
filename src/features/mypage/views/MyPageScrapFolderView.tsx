import { FolderScrapListItem } from '@/features/mypage/components/scraps/FolderScrapListItem';
import { ScrapFolderDetailHeader } from '@/features/mypage/components/scraps/ScrapFolderDetailHeader';
import type { MyPageFolderScrapListItem } from '@/features/mypage/types';

type MyPageScrapFolderViewProps = {
  emptyMessage: string;
  errorMessage: string;
  folderName: string;
  invalidFolderMessage: string;
  isError: boolean;
  isInvalidFolderId: boolean;
  isLoading: boolean;
  isRemoveScrapPending: boolean;
  items: MyPageFolderScrapListItem[];
  onBack: () => void;
  onCloseScrapMoreMenu: () => void;
  onDeleteScrap: (item: MyPageFolderScrapListItem) => void;
  onEnterMultiSelectMode: () => void;
  onMoveScrap: (item: MyPageFolderScrapListItem) => void;
  onScrapMoreClick: (item: MyPageFolderScrapListItem) => void;
  removeScrapErrorMessage: string | null;
  scrapCount: number;
  selectedScrapMoreMenu: MyPageFolderScrapListItem | null;
  shouldShowEmptyMessage: boolean;
};

export function MyPageScrapFolderView({
  emptyMessage,
  errorMessage,
  folderName,
  invalidFolderMessage,
  isError,
  isInvalidFolderId,
  isLoading,
  isRemoveScrapPending,
  items,
  onBack,
  onCloseScrapMoreMenu,
  onDeleteScrap,
  onEnterMultiSelectMode,
  onMoveScrap,
  onScrapMoreClick,
  removeScrapErrorMessage,
  scrapCount,
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
              scrapCount={scrapCount}
              onBack={onBack}
              onEnterMultiSelectMode={onEnterMultiSelectMode}
            />
          </div>
        </div>
        <div className="h-[calc(64px+max(20px,env(safe-area-inset-top)))] shrink-0" aria-hidden="true" />

        <section className="flex flex-1 flex-col px-4 pb-[max(32px,env(safe-area-inset-bottom))] pt-5">
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

            {shouldShowEmptyMessage ? (
              <div className="flex flex-1 items-center justify-center px-4 text-center">
                <p className="text-sm font-medium leading-[1.4] text-[#8A9299]">{emptyMessage}</p>
              </div>
            ) : null}

            {items.length > 0 ? (
              <div className="flex flex-col gap-8" aria-label="폴더 스크랩 목록">
                {items.map((item) => (
                  <FolderScrapListItem
                    key={item.scrapId}
                    item={item}
                    isMoreMenuOpen={selectedScrapMoreMenu?.scrapId === item.scrapId}
                    isRemovePending={
                      isRemoveScrapPending &&
                      selectedScrapMoreMenu?.scrapId === item.scrapId
                    }
                    onCloseMoreMenu={onCloseScrapMoreMenu}
                    onDelete={onDeleteScrap}
                    onMoreClick={onScrapMoreClick}
                    onMove={onMoveScrap}
                  />
                ))}
              </div>
            ) : null}
          </div>
        </section>
      </div>
    </main>
  );
}
