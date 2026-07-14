const DAY_IN_MS = 24 * 60 * 60 * 1000;

function parseDateOnly(value: string) {
  const match = value.trim().match(/^(\d{4})-(\d{2})-(\d{2})$/);

  if (!match) {
    return null;
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(year, month - 1, day);

  if (
    Number.isNaN(date.getTime()) ||
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }

  return date;
}

function getDateOnlyStart(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
}

export function formatMissedDateLabel(missedDate: string, now = new Date()) {
  const date = parseDateOnly(missedDate);

  if (!date) {
    return missedDate;
  }

  const dayDiff = Math.max(0, Math.floor((getDateOnlyStart(now) - getDateOnlyStart(date)) / DAY_IN_MS));

  if (dayDiff === 0) {
    return '오늘';
  }

  return `${dayDiff}일전`;
}

export function getMissedDateDayDiff(missedDate: string, now = new Date()) {
  const date = parseDateOnly(missedDate);

  if (!date) {
    return null;
  }

  return Math.max(0, Math.floor((getDateOnlyStart(now) - getDateOnlyStart(date)) / DAY_IN_MS));
}

export function formatMissedNoticeTitle(missedDate: string, nickname?: string, now = new Date()) {
  const dayDiff = getMissedDateDayDiff(missedDate, now);
  const displayName = nickname?.trim() || '회원';

  if (dayDiff === null) {
    return `${displayName}님이 놓친 중요한 공지가 있어요.`;
  }

  if (dayDiff <= 1) {
    return `어제 ${displayName}님이 놓친 중요한 공지가 있어요`;
  }

  return `${dayDiff}일전, ${displayName}님이 놓친 중요한 공지가 있어요.`;
}

export function formatReminderDDay(endDate: string, now = new Date()) {
  const date = parseDateOnly(endDate);

  if (!date) {
    return '마감일 확인 필요';
  }

  const dayDiff = Math.ceil((getDateOnlyStart(date) - getDateOnlyStart(now)) / DAY_IN_MS);

  if (dayDiff <= 0) {
    return dayDiff === 0 ? '마감 오늘' : '마감';
  }

  return `마감 ${dayDiff}일전`;
}
