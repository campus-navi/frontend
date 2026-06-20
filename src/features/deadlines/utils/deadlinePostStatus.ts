import { parseDeadlinePostDate } from '@/features/deadlines/utils/deadlinePostDate';

const DAY_IN_MS = 24 * 60 * 60 * 1000;
const DATE_ONLY_PATTERN = /^\d{4}[-.]\d{1,2}[-.]\d{1,2}$/;

export function isNewDeadlinePost(publishedAt: string, now = new Date()) {
  const publishedDate = parseDeadlinePostDate(publishedAt);

  if (!publishedDate) {
    return false;
  }

  if (DATE_ONLY_PATTERN.test(publishedAt.trim())) {
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const publishedDateStart = new Date(
      publishedDate.getFullYear(),
      publishedDate.getMonth(),
      publishedDate.getDate(),
    ).getTime();
    const dayDiff = Math.round((todayStart - publishedDateStart) / DAY_IN_MS);

    return dayDiff >= 0 && dayDiff <= 1;
  }

  const elapsedTime = now.getTime() - publishedDate.getTime();

  return elapsedTime >= 0 && elapsedTime <= DAY_IN_MS;
}
