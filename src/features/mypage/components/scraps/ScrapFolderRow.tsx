import type { MyPageScrapFolder } from '@/api';
import { MoreIcon } from '@/features/mypage/components/scraps/ScrapIcons';

type ScrapFolderRowProps = {
  folder: MyPageScrapFolder;
};

export function ScrapFolderRow({ folder }: ScrapFolderRowProps) {
  return (
    <article className="flex h-[72px] items-center justify-between px-4 py-3">
      <div className="min-w-0">
        <div className="flex items-center gap-1">
          <h3 className="truncate text-base font-medium leading-[1.4] tracking-normal text-[#292B2C]">
            {folder.name}
          </h3>
          <span className="text-base font-semibold leading-[1.4] tracking-normal text-[#0BC798]">
            {folder.scrapCount}
          </span>
        </div>
        <p className="mt-1.5 truncate text-sm font-normal leading-[1.4] tracking-normal text-[#BFC4C8]">
          {folder.description}
        </p>
      </div>

      <span className="ml-4 flex h-4 w-4 shrink-0 items-center justify-center text-[#292B2C]" aria-hidden="true">
        <MoreIcon />
      </span>
    </article>
  );
}
