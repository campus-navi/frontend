import { getOfficialPostDDay } from '@/features/official-posts/utils/officialPostApplication';

const DAY_IN_MS = 24 * 60 * 60 * 1000;
const WEEKDAY_LABELS = ['일', '월', '화', '수', '목', '금', '토'] as const;

export function formatDeadlineDDay(endDate: string) {
  const dDay = getOfficialPostDDay(endDate);

  if (dDay === null) {
    return '-';
  }

  if (dDay === 0) {
    return 'D-day';
  }

  return dDay > 0 ? `D-${dDay}` : '마감';
}

export function formatDeadlineDateWithWeekday(value: string) {
  const date = parseDeadlinePostDate(value);

  if (!date) {
    return '-';
  }

  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${month}.${day}(${WEEKDAY_LABELS[date.getDay()]})`;
}

export function formatDeadlinePublishedDaysAgo(value: string, now = new Date()) {
  const publishedAt = parseDeadlinePostDate(value);

  if (!publishedAt) {
    return '-';
  }

  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const publishedDateStart = new Date(
    publishedAt.getFullYear(),
    publishedAt.getMonth(),
    publishedAt.getDate(),
  ).getTime();
  const dayDiff = Math.max(0, Math.floor((todayStart - publishedDateStart) / DAY_IN_MS));

  return `${dayDiff}일전`;
}

export function parseDeadlinePostDate(value: string) {
  const dateText = value.trim();
  const dateOnlyMatch = dateText.match(/^(\d{4})[-.](\d{1,2})[-.](\d{1,2})$/);

  if (dateOnlyMatch) {
    const year = Number(dateOnlyMatch[1]);
    const month = Number(dateOnlyMatch[2]);
    const day = Number(dateOnlyMatch[3]);
    const date = new Date(year, month - 1, day);

    return isValidDateParts(date, year, month, day) ? date : null;
  }

  const date = new Date(dateText);

  return Number.isNaN(date.getTime()) ? null : date;
}

function isValidDateParts(date: Date, year: number, month: number, day: number) {
  return (
    !Number.isNaN(date.getTime()) &&
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
}
