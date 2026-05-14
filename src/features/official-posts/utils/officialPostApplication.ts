export type OfficialPostApplyMethodType = 'FILE' | 'OFFLINE' | 'PORTAL' | 'LINK' | 'OTHER';

export type OfficialPostApplicationStatus = 'before' | 'closed' | 'applicable';

const APPLY_METHOD_LABELS: Record<OfficialPostApplyMethodType, string> = {
  FILE: '신청하기',
  OFFLINE: '오프라인 신청',
  PORTAL: '포털신청',
  LINK: '신청하기',
  OTHER: '신청방법 확인',
};

export function hasOfficialPostRequiredDocuments(requiredDocuments: string | null | undefined): requiredDocuments is string {
  return typeof requiredDocuments === 'string' && requiredDocuments.trim().length > 0;
}

export function hasOfficialPostDeadline(endDate: string | null | undefined, endTime: string | null | undefined) {
  return hasText(endDate) || hasText(endTime);
}

export function shouldShowOfficialPostBottomFloating(requiredDocuments: string | null | undefined) {
  return hasOfficialPostRequiredDocuments(requiredDocuments);
}

export function shouldShowOfficialPostDetailsInfo({
  eligibility,
  endDate,
  endTime,
  requiredDocuments,
  startDate,
  startTime,
}: {
  eligibility: string | null | undefined;
  endDate: string | null | undefined;
  endTime: string | null | undefined;
  requiredDocuments: string | null | undefined;
  startDate: string | null | undefined;
  startTime: string | null | undefined;
}) {
  return (
    hasText(startDate) ||
    hasText(startTime) ||
    hasOfficialPostDeadline(endDate, endTime) ||
    hasOfficialPostRequiredDocuments(requiredDocuments) ||
    hasText(eligibility)
  );
}

export function getOfficialPostApplyMethodLabel(applyMethodType: string | null | undefined) {
  return isOfficialPostApplyMethodType(applyMethodType) ? APPLY_METHOD_LABELS[applyMethodType] : '신청하기';
}

export function getOfficialPostApplicationStatus({
  endDate,
  endTime,
  isApplicable,
  now = new Date(),
  startDate,
  startTime,
}: {
  endDate: string | null | undefined;
  endTime: string | null | undefined;
  isApplicable: boolean;
  now?: Date;
  startDate: string | null | undefined;
  startTime: string | null | undefined;
}): OfficialPostApplicationStatus {
  const startDateTime = parseApplicationDateTime(startDate, startTime, 'start');

  if (startDateTime && startDateTime.getTime() > now.getTime()) {
    return 'before';
  }

  const endDateTime = parseApplicationDateTime(endDate, endTime, 'end');

  if (endDateTime && endDateTime.getTime() < now.getTime()) {
    return 'closed';
  }

  return isApplicable ? 'applicable' : 'closed';
}

export function getOfficialPostDDay(endDate: string | null | undefined, now = new Date()) {
  const deadlineDate = parseDate(endDate);

  if (!deadlineDate) {
    return null;
  }

  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const deadlineStart = new Date(
    deadlineDate.getFullYear(),
    deadlineDate.getMonth(),
    deadlineDate.getDate(),
  ).getTime();

  return Math.ceil((deadlineStart - todayStart) / 86_400_000);
}

function isOfficialPostApplyMethodType(value: string | null | undefined): value is OfficialPostApplyMethodType {
  return value === 'FILE' || value === 'OFFLINE' || value === 'PORTAL' || value === 'LINK' || value === 'OTHER';
}

function hasText(value: string | null | undefined): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function parseApplicationDateTime(
  date: string | null | undefined,
  time: string | null | undefined,
  boundary: 'start' | 'end',
) {
  const parsedDate = parseDate(date);

  if (!parsedDate) {
    return null;
  }

  const timeParts = parseTime(time);
  const [hours, minutes, seconds] = timeParts ?? (boundary === 'start' ? [0, 0, 0] : [23, 59, 59]);

  parsedDate.setHours(hours, minutes, seconds, boundary === 'end' ? 999 : 0);

  return parsedDate;
}

function parseDate(date: string | null | undefined) {
  if (!hasText(date)) {
    return null;
  }

  const dateText = date;
  const normalizedDate = dateText.trim().replace(/\./g, '-');
  const dateMatch = normalizedDate.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);

  if (dateMatch) {
    const year = Number(dateMatch[1]);
    const month = Number(dateMatch[2]);
    const day = Number(dateMatch[3]);
    const parsedDate = new Date(year, month - 1, day);

    return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
  }

  const parsedDate = new Date(normalizedDate);

  return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
}

function parseTime(time: string | null | undefined) {
  if (!hasText(time)) {
    return null;
  }

  const timeText = time;
  const timeMatch = timeText.trim().match(/^(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?$/);

  if (!timeMatch) {
    return null;
  }

  const hours = Number(timeMatch[1]);
  const minutes = Number(timeMatch[2]);
  const seconds = Number(timeMatch[3] ?? 0);

  if (hours > 23 || minutes > 59 || seconds > 59) {
    return null;
  }

  return [hours, minutes, seconds] as const;
}
