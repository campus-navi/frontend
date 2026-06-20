import { type KeyboardEvent } from 'react';
import { Link } from 'react-router-dom';

import { Tags } from '@/components/ui/Tags';
import {
  formatDeadlineDDay,
  formatDeadlinePublishedDaysAgo,
} from '@/features/deadlines/utils/deadlinePostDate';
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
        <div className="flex items-center gap-1.5">
          {scrap.endDate ? (
            <Tags size="lg" type="primary">
              {formatDeadlineDDay(scrap.endDate)}
            </Tags>
          ) : null}
          <Tags size="lg" type="tertiary" className="border border-[#DCDFE2] bg-transparent">
            {scrap.tagName}
          </Tags>
        </div>

        <div className="flex flex-col gap-1">
          <h3 className="line-clamp-2 min-h-[44.8px] break-words whitespace-pre-line text-base font-semibold leading-[1.4] tracking-normal text-[#292B2C]">
            {scrap.title}
          </h3>
          <p className="text-xs font-medium leading-[1.4] tracking-normal text-[#BFC4C8]">
            {formatDeadlinePublishedDaysAgo(scrap.publishedAt)}
          </p>
        </div>
      </div>
    </Link>
  );
}
