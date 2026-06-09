import { type KeyboardEvent } from 'react';
import { Link } from 'react-router-dom';

import type { MyPageRecentScrapCardItem } from '@/features/mypage/types';

type RecentScrapCardProps = {
  scrap: MyPageRecentScrapCardItem;
};

export function RecentScrapCard({ scrap }: RecentScrapCardProps) {
  const handleKeyDown = (event: KeyboardEvent<HTMLAnchorElement>) => {
    if (event.key !== ' ') {
      return;
    }

    event.preventDefault();
    event.currentTarget.click();
  };

  return (
    <Link
      to={scrap.detailPath}
      aria-label={`${scrap.title} 공지 상세 보기`}
      className="block w-[316px] shrink-0 rounded-2xl bg-[#FAFBFD] p-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0BC798]"
      draggable={false}
      onKeyDown={handleKeyDown}
    >
      <div className="flex flex-col gap-2">
        <div className="flex gap-1.5">
          <span className="rounded-lg bg-[#292B2C] px-2.5 py-1.5 text-sm font-medium leading-[1.4] text-white">
            {scrap.endDate ?? '마감일 없음'}
          </span>
          <span className="rounded-lg border border-[#DCDFE2] px-2.5 py-1.5 text-sm font-medium leading-[1.4] text-[#292B2C]">
            {scrap.tagName}
          </span>
        </div>

        <div className="flex flex-col gap-1">
          <h3 className="line-clamp-2 whitespace-pre-line text-base font-semibold leading-[1.4] tracking-normal text-[#292B2C]">
            {scrap.title}
          </h3>
          <p className="text-xs font-medium leading-[1.4] tracking-normal text-[#BFC4C8]">
            {scrap.publishedAt}
          </p>
        </div>
      </div>
    </Link>
  );
}
