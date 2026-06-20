import { Link } from 'react-router-dom';

import { Tags } from '@/components/ui/Tags';
import {
  formatDeadlineDDay,
  formatDeadlinePublishedDaysAgo,
} from '@/features/deadlines/utils/deadlinePostDate';
import { FolderScrapMoreMenu } from '@/features/mypage/components/scraps/FolderScrapMoreMenu';
import { MoreIcon } from '@/features/mypage/components/scraps/ScrapIcons';
import type { MyPageFolderScrapListItem } from '@/features/mypage/types';

type FolderScrapListItemProps = {
  isMoreMenuOpen: boolean;
  item: MyPageFolderScrapListItem;
  onCloseMoreMenu: () => void;
  onDelete: (item: MyPageFolderScrapListItem) => void;
  onMoreClick: (item: MyPageFolderScrapListItem) => void;
  onMove: (item: MyPageFolderScrapListItem) => void;
};

export function FolderScrapListItem({
  isMoreMenuOpen,
  item,
  onCloseMoreMenu,
  onDelete,
  onMoreClick,
  onMove,
}: FolderScrapListItemProps) {
  const content = (
    <>
      <div className="flex h-7 min-w-0 items-center gap-1.5">
        <Tags
          size="sm"
          type="tertiary"
          className="h-7 bg-[#F3F5FA] px-1.5 py-1 text-[14px] font-medium leading-[1.4]"
        >
          {item.tagName}
        </Tags>
        {item.endDate ? (
          <Tags
            size="sm"
            type="primary"
            className="h-7 px-1.5 py-1 text-[14px] font-medium leading-[1.4]"
          >
            {formatDeadlineDDay(item.endDate)}
          </Tags>
        ) : null}
        {!item.isActive ? (
          <Tags
            size="sm"
            type="secondary"
            className="h-7 px-1.5 py-1 text-[14px] font-medium leading-[1.4] text-[#8A9299]"
          >
            비활성
          </Tags>
        ) : null}
      </div>

      <div className="flex min-w-0 flex-col gap-1.5">
        <h2 className="line-clamp-2 break-words text-[16px] font-semibold leading-[1.4] tracking-normal text-[#292B2C]">
          {item.title}
        </h2>
        <p className="text-[12px] font-normal leading-[1.4] text-[#BFC4C8]">
          {formatDeadlinePublishedDaysAgo(item.publishedAt)}
        </p>
      </div>
    </>
  );

  return (
    <article
      className={[
        'relative flex w-full flex-col gap-3',
        item.isActive ? '' : 'opacity-60',
      ].join(' ')}
    >
      <div className="flex items-start gap-3">
        {item.isActive && item.detailPath ? (
          <Link
            to={item.detailPath}
            className="flex min-w-0 flex-1 flex-col gap-3 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0BC798]"
            aria-label={`${item.title} 공지 상세 보기`}
          >
            {content}
          </Link>
        ) : (
          <div className="flex min-w-0 flex-1 flex-col gap-3" aria-label={`${item.title} 비활성 스크랩`}>
            {content}
          </div>
        )}

        <button
          type="button"
          className="relative z-10 flex h-7 w-7 shrink-0 items-center justify-center text-[#292B2C]"
          aria-expanded={isMoreMenuOpen}
          aria-haspopup="menu"
          aria-label={`${item.title} 스크랩 더보기`}
          onClick={() => onMoreClick(item)}
        >
          <MoreIcon />
        </button>
      </div>

      {isMoreMenuOpen ? (
        <FolderScrapMoreMenu
          scrapTitle={item.title}
          onClose={onCloseMoreMenu}
          onMove={() => onMove(item)}
          onDelete={() => onDelete(item)}
        />
      ) : null}
    </article>
  );
}
