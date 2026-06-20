import { request } from '@/api/client';
import { COMMON_ERROR_CODES } from '@/api/constants/errorCodes';
import { createApiError } from '@/api/errors';
import type { ApiObjectData } from '@/api/types';

const DEFAULT_FEED_CARD_IMAGE_URL = '/images/notice-interest-prompt.svg';

export interface FeedCardPost extends ApiObjectData {
  postId: number;
  title: string;
  tagName: string;
  summary: string;
  imageUrl: string;
  publishedAt: string;
}

export interface FeedCards extends ApiObjectData {
  newPosts: FeedCardPost[];
  recommendedPosts: FeedCardPost[];
}

export interface DeadlinePost extends ApiObjectData {
  endDate: string;
  isNotificationOn: boolean;
  postId: number;
  publishedAt: string;
  publisher: string;
  tagName: string;
  title: string;
}

export interface DeadlinePosts extends ApiObjectData {
  posts: DeadlinePost[];
}

interface FeedCardPostResponse extends ApiObjectData {
  postId?: number | string;
  title?: string;
  tagName?: string;
  summary?: string;
  imageUrl?: string | null;
  publishedAt?: string;
}

interface FeedCardsResponse extends ApiObjectData {
  newPosts?: FeedCardPostResponse[];
  recommendedPosts?: FeedCardPostResponse[];
}

interface DeadlinePostResponse extends ApiObjectData {
  endDate?: string;
  isNotificationOn?: boolean;
  postId?: number | string;
  publishedAt?: string;
  publisher?: string;
  tagName?: string;
  title?: string;
}

interface DeadlinePostsResponse extends ApiObjectData {
  posts?: DeadlinePostResponse[];
}

function normalizePostId(
  postId: number | string,
  invalidResponseMessage = '카드뉴스 응답 형식이 올바르지 않습니다.',
): number {
  if (typeof postId === 'string' && postId.trim() === '') {
    throw createApiError({
      code: COMMON_ERROR_CODES.INVALID_RESPONSE,
      message: invalidResponseMessage,
      status: 200,
    });
  }

  const normalizedPostId = Number(postId);

  if (!Number.isFinite(normalizedPostId)) {
    throw createApiError({
      code: COMMON_ERROR_CODES.INVALID_RESPONSE,
      message: invalidResponseMessage,
      status: 200,
    });
  }

  return normalizedPostId;
}

function normalizeFeedCardPost(item: FeedCardPostResponse): FeedCardPost {
  const { postId, title, tagName, summary, imageUrl, publishedAt } = item;

  if (
    (typeof postId !== 'number' && typeof postId !== 'string') ||
    typeof title !== 'string' ||
    typeof tagName !== 'string' ||
    typeof summary !== 'string' ||
    typeof publishedAt !== 'string'
  ) {
    throw createApiError({
      code: COMMON_ERROR_CODES.INVALID_RESPONSE,
      message: '카드뉴스 응답 형식이 올바르지 않습니다.',
      status: 200,
    });
  }

  return {
    imageUrl: typeof imageUrl === 'string' && imageUrl.trim() ? imageUrl : DEFAULT_FEED_CARD_IMAGE_URL,
    postId: normalizePostId(postId),
    publishedAt,
    summary,
    tagName,
    title,
  };
}

function normalizeFeedCards(data: FeedCardsResponse): FeedCards {
  if (!Array.isArray(data.newPosts) || !Array.isArray(data.recommendedPosts)) {
    throw createApiError({
      code: COMMON_ERROR_CODES.INVALID_RESPONSE,
      message: '카드뉴스 목록 응답 형식이 올바르지 않습니다.',
      status: 200,
    });
  }

  return {
    newPosts: data.newPosts.map(normalizeFeedCardPost),
    recommendedPosts: data.recommendedPosts.map(normalizeFeedCardPost),
  };
}

function normalizeDeadlinePost(item: DeadlinePostResponse): DeadlinePost {
  const {
    endDate,
    isNotificationOn,
    postId,
    publishedAt,
    publisher,
    tagName,
    title,
  } = item;

  if (
    (typeof postId !== 'number' && typeof postId !== 'string') ||
    typeof title !== 'string' ||
    typeof tagName !== 'string' ||
    typeof publisher !== 'string' ||
    typeof publishedAt !== 'string' ||
    typeof endDate !== 'string' ||
    typeof isNotificationOn !== 'boolean'
  ) {
    throw createApiError({
      code: COMMON_ERROR_CODES.INVALID_RESPONSE,
      message: '마감임박 공지 응답 형식이 올바르지 않습니다.',
      status: 200,
    });
  }

  return {
    endDate,
    isNotificationOn,
    postId: normalizePostId(postId, '마감임박 공지 응답 형식이 올바르지 않습니다.'),
    publishedAt,
    publisher,
    tagName,
    title,
  };
}

function normalizeDeadlinePosts(data: DeadlinePostsResponse): DeadlinePosts {
  if (!Array.isArray(data.posts)) {
    throw createApiError({
      code: COMMON_ERROR_CODES.INVALID_RESPONSE,
      message: '마감임박 공지 목록 응답 형식이 올바르지 않습니다.',
      status: 200,
    });
  }

  return {
    posts: data.posts.map(normalizeDeadlinePost),
  };
}

export const feedApi = {
  async getCards() {
    const response = await request<FeedCardsResponse>({
      method: 'get',
      url: '/feed/cards',
    });

    return {
      ...response,
      data: normalizeFeedCards(response.data),
    };
  },
  async getDeadlinePreview() {
    const response = await request<DeadlinePostsResponse>({
      method: 'get',
      url: '/feed/deadlines/preview',
    });

    return {
      ...response,
      data: normalizeDeadlinePosts(response.data),
    };
  },
  async getDeadlines() {
    const response = await request<DeadlinePostsResponse>({
      method: 'get',
      url: '/feed/deadlines',
    });

    return {
      ...response,
      data: normalizeDeadlinePosts(response.data),
    };
  },
};
