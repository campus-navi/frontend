import { BackIcon } from '@/components/ui/HeaderIcons';
import { SvgIcon } from '@/components/ui/SvgIcon';

type ScrapFolderDetailHeaderProps = {
  folderName: string;
  isMultiSelectMode: boolean;
  scrapCount: number;
  onBack: () => void;
  onEnterMultiSelectMode: () => void;
};

export function ScrapFolderDetailHeader({
  folderName,
  isMultiSelectMode,
  scrapCount,
  onBack,
  onEnterMultiSelectMode,
}: ScrapFolderDetailHeaderProps) {
  return (
    <header className="bg-white pt-[max(20px,env(safe-area-inset-top))]">
      <div className="relative flex h-16 items-center px-4">
        <button
          type="button"
          onClick={onBack}
          className="z-10 flex h-10 w-10 items-center justify-center text-[#333333]"
          aria-label="뒤로 가기"
        >
          <BackIcon />
        </button>

        <div className="pointer-events-none absolute left-1/2 flex max-w-[calc(100%-160px)] -translate-x-1/2 items-center gap-1">
          <h1 className="min-w-0 truncate text-center text-base font-semibold leading-none text-[#333333]">
            {folderName}
          </h1>
          <span className="shrink-0 text-base font-semibold leading-none text-[#0BC798]">
            {scrapCount}
          </span>
        </div>

        {!isMultiSelectMode ? (
          <button
            type="button"
            className="z-10 ml-auto flex min-h-10 min-w-10 items-center justify-end text-[#FF5E47]"
            onClick={onEnterMultiSelectMode}
            aria-label="스크랩 다중 삭제"
          >
            <SvgIcon size={24} viewBox="0 0 24 24">
              <path
                d="M14 10V17M10 10V17M6 6V17.8C6 18.9201 6 19.4798 6.21799 19.9076C6.40973 20.2839 6.71547 20.5905 7.0918 20.7822C7.5192 21 8.07899 21 9.19691 21H14.8031C15.921 21 16.48 21 16.9074 20.7822C17.2837 20.5905 17.5905 20.2839 17.7822 19.9076C18 19.4802 18 18.921 18 17.8031V6M6 6H8M6 6H4M8 6H16M8 6C8 5.06812 8 4.60241 8.15224 4.23486C8.35523 3.74481 8.74432 3.35523 9.23438 3.15224C9.60192 3 10.0681 3 11 3H13C13.9319 3 14.3978 3 14.7654 3.15224C15.2554 3.35523 15.6447 3.74481 15.8477 4.23486C15.9999 4.6024 16 5.06812 16 6M16 6H18M18 6H20"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            </SvgIcon>
          </button>
        ) : (
          <div className="ml-auto min-h-10 min-w-10" aria-hidden="true" />
        )}
      </div>
    </header>
  );
}
