const STUDIO_DOCUMENT_MINUTE_IN_MS = 60 * 1000;
const STUDIO_DOCUMENT_HOUR_IN_MS = 60 * STUDIO_DOCUMENT_MINUTE_IN_MS;
const STUDIO_DOCUMENT_DAY_IN_MS = 24 * STUDIO_DOCUMENT_HOUR_IN_MS;
const STUDIO_DOCUMENT_WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

export function formatStudioDocumentUpdatedAt(value: string) {
  const date = parseStudioDocumentDate(value);

  if (!date) {
    return '-';
  }

  const now = new Date();
  const diff = now.getTime() - date.getTime();

  if (diff >= 0 && diff < STUDIO_DOCUMENT_MINUTE_IN_MS) {
    return '방금전';
  }

  if (diff >= 0 && diff < STUDIO_DOCUMENT_HOUR_IN_MS) {
    return `${Math.floor(diff / STUDIO_DOCUMENT_MINUTE_IN_MS)}분전`;
  }

  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const dateStart = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();

  if (todayStart === dateStart) {
    return `오늘 ${formatStudioDocumentTime(date)}`;
  }

  if (todayStart - dateStart === STUDIO_DOCUMENT_DAY_IN_MS) {
    return `어제 ${formatStudioDocumentTime(date)}`;
  }

  return `${date.getMonth() + 1}.${date.getDate()}(${STUDIO_DOCUMENT_WEEKDAYS[date.getDay()]}) ${formatStudioDocumentTime(date)}`;
}

function parseStudioDocumentDate(value: string) {
  const normalizedValue = /^\d{4}-\d{2}-\d{2}$/.test(value) ? `${value}T00:00:00` : value;
  const date = new Date(normalizedValue);

  return Number.isNaN(date.getTime()) ? null : date;
}

function formatStudioDocumentTime(date: Date) {
  const isAfternoon = date.getHours() >= 12;
  const hour = date.getHours() % 12 || 12;
  const minute = date.getMinutes().toString().padStart(2, '0');

  return `${isAfternoon ? '오후' : '오전'} ${hour}:${minute}`;
}
