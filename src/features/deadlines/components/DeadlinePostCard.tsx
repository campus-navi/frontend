import type { DeadlinePost } from '@/api';
import { Tags } from '@/components/ui/Tags';
import {
  formatDeadlineDDay,
  formatDeadlinePublishedDaysAgo,
} from '@/features/deadlines/utils/deadlinePostDate';

type DeadlinePostCardProps = {
  onClick: () => void;
  post: DeadlinePost;
};

export function DeadlinePostCard({ onClick, post }: DeadlinePostCardProps) {
  return (
    <button
      type="button"
      className="flex w-[316px] shrink-0 flex-col gap-2 rounded-2xl bg-[#FAFBFD] p-4 text-left"
      onClick={onClick}
    >
      <div className="flex items-center gap-1.5">
        <Tags size="lg" type="primary">
          {formatDeadlineDDay(post.endDate)}
        </Tags>
        <Tags size="lg" type="tertiary" className="border border-[#DCDFE2] bg-transparent">
          {post.tagName}
        </Tags>
      </div>

      <div className="flex min-w-0 flex-col gap-1">
        <h3 className="line-clamp-2 min-h-[44.8px] break-words whitespace-pre-line text-base font-semibold leading-[1.4] tracking-normal text-[#292B2C]">
          {post.title}
        </h3>
        <p className="truncate text-xs font-medium leading-[1.4] tracking-normal text-[#BFC4C8]">
          {post.publisher} · {formatDeadlinePublishedDaysAgo(post.publishedAt)}
        </p>
      </div>
    </button>
  );
}
