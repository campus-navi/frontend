import type { DeadlinePost } from '@/api';
import { Tags } from '@/components/ui/Tags';
import {
  formatDeadlineDateWithWeekday,
  formatDeadlineDDay,
  formatDeadlinePublishedDaysAgo,
} from '@/features/deadlines/utils/deadlinePostDate';
import { isNewDeadlinePost } from '@/features/deadlines/utils/deadlinePostStatus';

type DeadlinePostListItemProps = {
  onClick: () => void;
  post: DeadlinePost;
};

export function DeadlinePostListItem({ onClick, post }: DeadlinePostListItemProps) {
  const isNew = isNewDeadlinePost(post.publishedAt);

  return (
    <button type="button" className="flex w-full flex-col gap-3 text-left" onClick={onClick}>
      <div className="flex h-7 w-full items-center gap-1.5">
        <Tags
          size="sm"
          type="tertiary"
          className="h-7 bg-[#F3F5FA] px-1.5 py-1 text-[14px] font-medium leading-[1.4]"
        >
          {post.tagName}
        </Tags>
        <Tags
          size="sm"
          type="primary"
          className="h-7 px-1.5 py-1 text-[14px] font-medium leading-[1.4]"
        >
          {formatDeadlineDDay(post.endDate)}
        </Tags>
      </div>

      <div className="flex min-w-0 flex-col gap-1.5">
        <h2 className="line-clamp-2 break-words text-[16px] font-semibold leading-[1.4] tracking-normal text-[#292B2C]">
          <span>{post.title}</span>
          {isNew ? (
            <span className="ml-1 inline-flex h-4 w-4 items-center justify-center rounded-[4px] bg-[#FF5E47] align-middle text-[10px] font-bold leading-[1.5] text-white">
              N
            </span>
          ) : null}
        </h2>
        <div className="flex h-5 w-[162px] items-center gap-1 text-[12px] font-normal leading-[1.4] text-[#BFC4C8]">
          <span className="shrink-0 text-[14px] font-medium leading-[1.4] text-[#0BC798]">
            {formatDeadlineDateWithWeekday(post.endDate)}까지
          </span>
          <span
            className="text-[10px] font-normal leading-[18px] tracking-[-0.02em] text-[#BFC4C8]"
            aria-hidden="true"
          >
            ·
          </span>
          <span className="shrink-0 text-[12px] font-normal leading-[1.4] text-[#BFC4C8]">
            {formatDeadlinePublishedDaysAgo(post.publishedAt)}
          </span>
        </div>
      </div>
    </button>
  );
}
