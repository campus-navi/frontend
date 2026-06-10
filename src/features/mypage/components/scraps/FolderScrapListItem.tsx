import { Link } from 'react-router-dom';

import type { MyPageFolderScrapListItem } from '@/features/mypage/types';

type FolderScrapListItemProps = {
  item: MyPageFolderScrapListItem;
};

function FolderScrapContent({ item }: FolderScrapListItemProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-1.5">
        <span className="rounded-lg bg-[#292B2C] px-2.5 py-1.5 text-sm font-medium leading-[1.4] text-white">
          {item.endDate || '마감일 없음'}
        </span>
        <span className="rounded-lg border border-[#DCDFE2] px-2.5 py-1.5 text-sm font-medium leading-[1.4] text-[#292B2C]">
          {item.tagName}
        </span>
        {!item.isActive ? (
          <span className="rounded-lg bg-[#EEF0F2] px-2.5 py-1.5 text-sm font-medium leading-[1.4] text-[#8A9299]">
            비활성
          </span>
        ) : null}
      </div>

      <div className="flex flex-col gap-1">
        <h2 className="line-clamp-2 whitespace-pre-line text-base font-semibold leading-[1.4] tracking-normal text-[#292B2C]">
          {item.title}
        </h2>
        <p className="text-xs font-medium leading-[1.4] tracking-normal text-[#BFC4C8]">{item.publishedAt}</p>
      </div>
    </div>
  );
}

export function FolderScrapListItem({ item }: FolderScrapListItemProps) {
  const className = [
    'block rounded-2xl bg-[#FAFBFD] p-4',
    item.isActive ? 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0BC798]' : 'opacity-60',
  ].join(' ');

  if (!item.isActive || item.detailPath === null) {
    return (
      <article className={className} aria-label={`${item.title} 비활성 스크랩`}>
        <FolderScrapContent item={item} />
      </article>
    );
  }

  return (
    <Link to={item.detailPath} className={className} aria-label={`${item.title} 공지 상세 보기`}>
      <FolderScrapContent item={item} />
    </Link>
  );
}
