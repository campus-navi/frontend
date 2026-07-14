import { request } from '@/api/client';
import { COMMON_ERROR_CODES } from '@/api/constants/errorCodes';
import { createApiError } from '@/api/errors';
import type { ApiObjectData } from '@/api/types';

const DEFAULT_NOTIFICATION_CARD_IMAGE_URL = '/images/notice-interest-prompt.svg';

export interface ActivityNotification extends ApiObjectData {
  missedDate: string;
  count: number;
}

export interface ActivityNotificationPost extends ApiObjectData {
  postId: number;
  title: string;
  tagName: string;
  summary: string;
  imageUrl: string;
  publishedAt: string;
}

export interface ReminderNotification extends ApiObjectData {
  postId: number;
  title: string;
  tagName: string;
  endDate: string;
}

interface ActivityNotificationResponse extends ApiObjectData {
  missedDate?: unknown;
  count?: unknown;
}

interface ActivityNotificationPostResponse extends ApiObjectData {
  postId?: unknown;
  title?: unknown;
  tagName?: unknown;
  summary?: unknown;
  imageUrl?: unknown;
  publishedAt?: unknown;
}

interface ReminderNotificationResponse extends ApiObjectData {
  postId?: unknown;
  title?: unknown;
  tagName?: unknown;
  endDate?: unknown;
}

function createInvalidNotificationResponseError(message: string) {
  return createApiError({
    code: COMMON_ERROR_CODES.INVALID_RESPONSE,
    message,
    status: 200,
  });
}

function normalizeNumberId(value: unknown, message: string) {
  if (typeof value !== 'number' && typeof value !== 'string') {
    throw createInvalidNotificationResponseError(message);
  }

  const normalizedValue = Number(value);

  if (!Number.isFinite(normalizedValue)) {
    throw createInvalidNotificationResponseError(message);
  }

  return normalizedValue;
}

function normalizeActivityNotification(item: ActivityNotificationResponse): ActivityNotification {
  if (typeof item.missedDate !== 'string' || typeof item.count !== 'number') {
    throw createInvalidNotificationResponseError('활동 알림 목록 응답 형식이 올바르지 않습니다.');
  }

  return {
    count: item.count,
    missedDate: item.missedDate,
  };
}

function normalizeActivityNotificationPost(
  item: ActivityNotificationPostResponse,
): ActivityNotificationPost {
  if (
    typeof item.title !== 'string' ||
    typeof item.tagName !== 'string' ||
    typeof item.summary !== 'string' ||
    typeof item.publishedAt !== 'string'
  ) {
    throw createInvalidNotificationResponseError('활동 알림 상세 응답 형식이 올바르지 않습니다.');
  }

  return {
    imageUrl:
      typeof item.imageUrl === 'string' && item.imageUrl.trim()
        ? item.imageUrl
        : DEFAULT_NOTIFICATION_CARD_IMAGE_URL,
    postId: normalizeNumberId(item.postId, '활동 알림 상세 응답 형식이 올바르지 않습니다.'),
    publishedAt: item.publishedAt,
    summary: item.summary,
    tagName: item.tagName,
    title: item.title,
  };
}

function normalizeReminderNotification(item: ReminderNotificationResponse): ReminderNotification {
  if (
    typeof item.title !== 'string' ||
    typeof item.tagName !== 'string' ||
    typeof item.endDate !== 'string'
  ) {
    throw createInvalidNotificationResponseError('리마인드 알림 목록 응답 형식이 올바르지 않습니다.');
  }

  return {
    endDate: item.endDate,
    postId: normalizeNumberId(item.postId, '리마인드 알림 목록 응답 형식이 올바르지 않습니다.'),
    tagName: item.tagName,
    title: item.title,
  };
}

function normalizeNotificationArray<TItem, TResponse>(
  data: TResponse[],
  normalizeItem: (item: TResponse) => TItem,
  message: string,
) {
  if (!Array.isArray(data)) {
    throw createInvalidNotificationResponseError(message);
  }

  return data.map(normalizeItem);
}

export const notificationApi = {
  async getActivityNotifications() {
    const response = await request<ActivityNotificationResponse[]>({
      method: 'get',
      url: '/notifications/activity',
    });

    return {
      ...response,
      data: normalizeNotificationArray(
        response.data,
        normalizeActivityNotification,
        '활동 알림 목록 응답 형식이 올바르지 않습니다.',
      ),
    };
  },
  async getActivityNotificationPosts(missedDate: string) {
    const response = await request<ActivityNotificationPostResponse[]>({
      method: 'get',
      url: `/notifications/activity/${encodeURIComponent(missedDate)}`,
    });

    return {
      ...response,
      data: normalizeNotificationArray(
        response.data,
        normalizeActivityNotificationPost,
        '활동 알림 상세 응답 형식이 올바르지 않습니다.',
      ),
    };
  },
  async getReminderNotifications() {
    const response = await request<ReminderNotificationResponse[]>({
      method: 'get',
      url: '/notifications/remind',
    });

    return {
      ...response,
      data: normalizeNotificationArray(
        response.data,
        normalizeReminderNotification,
        '리마인드 알림 목록 응답 형식이 올바르지 않습니다.',
      ),
    };
  },
};
