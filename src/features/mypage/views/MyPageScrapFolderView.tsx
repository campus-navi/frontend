import { AppHeader } from '@/components/ui/AppHeader';
import { FolderScrapListItem } from '@/features/mypage/components/scraps/FolderScrapListItem';
import type { MyPageFolderScrapListItem } from '@/features/mypage/types';

type MyPageScrapFolderViewProps = {
  displayFolderId: string;
  emptyMessage: string;
  errorMessage: string;
  invalidFolderMessage: string;
  isError: boolean;
  isInvalidFolderId: boolean;
  isLoading: boolean;
  items: MyPageFolderScrapListItem[];
  onBack: () => void;
  shouldShowEmptyMessage: boolean;
  title: string;
};

export function MyPageScrapFolderView({
  displayFolderId,
  emptyMessage,
  errorMessage,
  invalidFolderMessage,
  isError,
  isInvalidFolderId,
  isLoading,
  items,
  onBack,
  shouldShowEmptyMessage,
  title,
}: MyPageScrapFolderViewProps) {
  return (
    <main className="min-h-[100svh] bg-white">
      <div className="mx-auto flex min-h-[100svh] w-full max-w-[393px] flex-col bg-white">
        <AppHeader title="스크랩 폴더" onBack={onBack} className="bg-white" />

        <section className="flex flex-1 flex-col px-4 pb-[max(32px,env(safe-area-inset-bottom))] pt-4">
          <div className="border-b border-[#EEF0F2] pb-5">
            <p className="text-sm font-medium leading-[1.4] text-[#8A9299]">폴더 ID {displayFolderId}</p>
            <h1 className="mt-2 text-xl font-semibold leading-[1.4] tracking-normal text-[#292B2C]">
              {title}
            </h1>
          </div>

          <div className="flex flex-1 flex-col pt-4">
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

            {shouldShowEmptyMessage ? (
              <div className="flex flex-1 items-center justify-center px-4 text-center">
                <p className="text-sm font-medium leading-[1.4] text-[#8A9299]">{emptyMessage}</p>
              </div>
            ) : null}

            {items.length > 0 ? (
              <div className="flex flex-col gap-3" aria-label="폴더 스크랩 목록">
                {items.map((item) => (
                  <FolderScrapListItem key={item.scrapId} item={item} />
                ))}
              </div>
            ) : null}
          </div>
        </section>
      </div>
    </main>
  );
}
