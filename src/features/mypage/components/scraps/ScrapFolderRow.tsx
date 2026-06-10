import { Link } from 'react-router-dom';

import { MoreIcon } from '@/features/mypage/components/scraps/ScrapIcons';
import type { MyPageScrapFolderListItem } from '@/features/mypage/types';

type ScrapFolderRowProps = {
  folder: MyPageScrapFolderListItem;
  onMoreClick: () => void;
};

export function ScrapFolderRow({ folder, onMoreClick }: ScrapFolderRowProps) {
  return (
    <article className="flex h-[72px] items-center justify-between">
      <Link
        to={folder.detailPath}
        className="flex min-w-0 flex-1 items-center self-stretch py-3 pl-4"
        aria-label={`${folder.name} 스크랩 폴더 보기`}
      >
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
      </Link>

      <button
        type="button"
        className="ml-4 flex h-full w-12 shrink-0 items-center justify-center pr-4 text-[#292B2C]"
        onClick={onMoreClick}
        aria-label={`${folder.name} 폴더 더보기`}
      >
        <span className="flex h-4 w-4 items-center justify-center" aria-hidden="true">
          <MoreIcon />
        </span>
      </button>
    </article>
  );
}
