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
    postId: Number(postId),
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
};
