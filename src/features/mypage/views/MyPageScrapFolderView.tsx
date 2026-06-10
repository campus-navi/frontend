import { AppHeader } from '@/components/ui/AppHeader';

type MyPageScrapFolderViewProps = {
  displayFolderId: string;
  emptyMessage: string;
  onBack: () => void;
  title: string;
};

export function MyPageScrapFolderView({
  displayFolderId,
  emptyMessage,
  onBack,
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

          <div className="flex flex-1 items-center justify-center px-4 text-center">
            <p className="text-sm font-medium leading-[1.4] text-[#8A9299]">{emptyMessage}</p>
          </div>
        </section>
      </div>
    </main>
  );
}
