import type { OfficialPostSummary } from '@/api';
import { Tags } from '@/components/ui/Tags';

type OfficialPostListItemProps = {
  onClick: () => void;
  post: OfficialPostSummary;
};

const TREND_TEXTS = ['동기들이 많이봤어요', '지금 많이 보고있어요'];
const HOUR_IN_MS = 60 * 60 * 1000;
const DAY_IN_MS = 24 * HOUR_IN_MS;

export function OfficialPostListItem({ onClick, post }: OfficialPostListItemProps) {
  const publishedAt = parseDate(post.publishedAt);
  const publishedAge = publishedAt ? Date.now() - publishedAt.getTime() : null;
  const isNew = publishedAge !== null && publishedAge >= 0 && publishedAge <= 48 * HOUR_IN_MS;
  const dDayText = formatDDay(post.endDate);

  return (
    <button type="button" className="flex w-full flex-col gap-3 py-0 text-left" onClick={onClick}>
      <div className="flex w-full items-center justify-between">
        <div className="flex min-w-0 flex-1 items-center gap-1.5">
          <Tags size="sm" type="tertiary" className="h-auto bg-[#F3F5FA] px-1.5 py-1 text-[14px] leading-[1.4]">
            {post.tagName || '교내'}
          </Tags>
          {dDayText ? (
            <Tags size="sm" type="primary" className="h-auto px-1.5 py-1 text-[14px] leading-[1.4]">
              {dDayText}
            </Tags>
          ) : null}
        </div>
      </div>

      <div className="flex w-full flex-col gap-1.5">
        <div className="flex w-full items-center gap-1">
          <h2 className="min-w-0 flex-1 truncate text-[16px] font-semibold leading-[1.4] tracking-[0.01em] text-[#292B2C]">
            {post.title}
          </h2>
          {isNew ? (
            <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-[4px] bg-[#FF5E47] text-center text-[10px] font-bold leading-[1.5] text-white">
              N
            </span>
          ) : null}
        </div>

        <div className="flex h-5 items-center gap-1">
          <span className="shrink-0 text-[12px] font-normal leading-[1.4] text-[#BFC4C8]">
            {formatRelativeDate(publishedAt)}
          </span>
          <span className="text-[10px] font-normal leading-[18px] tracking-[-0.02em] text-[#BFC4C8]" aria-hidden="true">
            ·
          </span>
          <span className="min-w-0 truncate text-[14px] font-medium leading-[1.4] text-[#0BC798]">
            {TREND_TEXTS[post.postId % TREND_TEXTS.length]}
          </span>
        </div>
      </div>
    </button>
  );
}

function parseDate(value: string | null) {
  if (!value) {
    return null;
  }

  const normalizedValue = /^\d{4}-\d{2}-\d{2}$/.test(value) ? `${value}T00:00:00` : value;
  const date = new Date(normalizedValue);

  return Number.isNaN(date.getTime()) ? null : date;
}

function formatRelativeDate(date: Date | null) {
  if (!date) {
    return '-';
  }

  const diff = Date.now() - date.getTime();

  if (diff < HOUR_IN_MS) {
    return '오늘';
  }

  const dayDiff = Math.floor(diff / DAY_IN_MS);

  if (dayDiff <= 0) {
    return '오늘';
  }

  return `${dayDiff}일전`;
}

function formatDDay(value: string | null) {
  const endDate = parseDate(value);

  if (!endDate) {
    return null;
  }

  const today = new Date();
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
  const endDateStart = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate()).getTime();
  const dayDiff = Math.ceil((endDateStart - todayStart) / DAY_IN_MS);

  if (dayDiff < 0) {
    return null;
  }

  if (dayDiff === 0) {
    return 'D-day';
  }

  return `D-${dayDiff}`;
}
