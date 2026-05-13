import { request } from '@/api/client';
import { COMMON_ERROR_CODES } from '@/api/constants/errorCodes';
import { createApiError } from '@/api/errors';
import type { ApiObjectData } from '@/api/types';

export interface OfficialPostAttachment extends ApiObjectData {
  id: number | string;
  isDownloaded: boolean;
  name: string;
}

export interface OfficialPostAttachmentDownload extends ApiObjectData {
  downloadUrl: string;
  expiresInSeconds: number;
}

export interface OfficialPostDetail extends ApiObjectData {
  applyMethodDetail: string | null;
  applyMethodType: string | null;
  attachments: OfficialPostAttachment[];
  contactEmail: string | null;
  contactPhone: string | null;
  contentHtml: string;
  eligibility: string | null;
  endDate: string | null;
  endTime: string | null;
  hasUnreadAttachments: boolean;
  imageUrls: string[];
  isApplicable: boolean;
  isNotificationOn: boolean;
  isScrapped: boolean;
  postId: number;
  publishedAt: string;
  publisher: string;
  requiredDocuments: string | null;
  sourceUrl: string | null;
  startDate: string | null;
  startTime: string | null;
  summary: string;
  tagName: string;
  title: string;
}

export type OfficialPostListSort = 'LATEST' | 'DEADLINE';
export type OfficialPostTagCode =
  | 'ACADEMIC'
  | 'ACTIVITY'
  | 'COURSE'
  | 'FACILITY'
  | 'SCHOLARSHIP'
  | 'STUDENT_SUPPORT';

export interface OfficialPostSummary extends ApiObjectData {
  endDate: string | null;
  postId: number;
  publishedAt: string;
  tagName: string;
  title: string;
}

export interface OfficialPostList extends ApiObjectData {
  content: OfficialPostSummary[];
  hasNext: boolean;
  nextCursor: string | null;
}

export interface OfficialPostListParams {
  cursor?: string;
  q?: string;
  sort?: OfficialPostListSort;
  tagCode?: OfficialPostTagCode;
}

interface OfficialPostAttachmentResponse extends ApiObjectData {
  id?: number | string;
  isDownloaded?: boolean;
  name?: string;
}

interface OfficialPostAttachmentDownloadResponse extends ApiObjectData {
  downloadUrl?: string;
  expiresInSeconds?: number;
}

interface OfficialPostSummaryResponse extends ApiObjectData {
  endDate?: string | null;
  postId?: number | string;
  publishedAt?: string;
  tagName?: string;
  title?: string;
}

interface OfficialPostListResponse extends ApiObjectData {
  content?: OfficialPostSummaryResponse[];
  hasNext?: boolean;
  nextCursor?: string | null;
}

interface OfficialPostDetailResponse extends ApiObjectData {
  applyMethodDetail?: string | null;
  applyMethodType?: string | null;
  attachments?: OfficialPostAttachmentResponse[];
  contactEmail?: string | null;
  contactPhone?: string | null;
  contentHtml?: string | null;
  eligibility?: string | null;
  endDate?: string | null;
  endTime?: string | null;
  hasUnreadAttachments?: boolean;
  imageUrls?: string[];
  isApplicable?: boolean;
  isNotificationOn?: boolean;
  isScrapped?: boolean;
  postId?: number | string;
  publishedAt?: string;
  publisher?: string;
  requiredDocuments?: string | null;
  sourceUrl?: string | null;
  startDate?: string | null;
  startTime?: string | null;
  summary?: string | null;
  tagName?: string;
  title?: string;
}

function normalizePostId(postId: number | string): number {
  if (typeof postId === 'string' && postId.trim() === '') {
    throw createInvalidOfficialPostResponseError();
  }

  const normalizedPostId = Number(postId);

  if (!Number.isInteger(normalizedPostId) || normalizedPostId <= 0) {
    throw createInvalidOfficialPostResponseError();
  }

  return normalizedPostId;
}

function createInvalidOfficialPostResponseError() {
  return createApiError({
    code: COMMON_ERROR_CODES.INVALID_RESPONSE,
    message: '교내정보 글 상세 응답 형식이 올바르지 않습니다.',
    status: 200,
  });
}

function createInvalidOfficialPostListResponseError() {
  return createApiError({
    code: COMMON_ERROR_CODES.INVALID_RESPONSE,
    message: '교내정보 목록 응답 형식이 올바르지 않습니다.',
    status: 200,
  });
}

function normalizeNullableString(value: unknown): string | null {
  return typeof value === 'string' ? value : null;
}

function normalizeString(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

function normalizeAttachment(item: OfficialPostAttachmentResponse): OfficialPostAttachment {
  const { id, isDownloaded, name } = item;

  if ((typeof id !== 'number' && typeof id !== 'string') || typeof isDownloaded !== 'boolean' || typeof name !== 'string') {
    throw createInvalidOfficialPostResponseError();
  }

  return {
    id,
    isDownloaded,
    name,
  };
}

function normalizeAttachmentDownload(
  data: OfficialPostAttachmentDownloadResponse,
): OfficialPostAttachmentDownload {
  const { downloadUrl, expiresInSeconds } = data;

  if (typeof downloadUrl !== 'string' || typeof expiresInSeconds !== 'number') {
    throw createInvalidOfficialPostResponseError();
  }

  return {
    downloadUrl,
    expiresInSeconds,
  };
}

function normalizeOfficialPostSummary(item: OfficialPostSummaryResponse): OfficialPostSummary {
  const { postId, publishedAt, tagName, title } = item;

  if (
    (typeof postId !== 'number' && typeof postId !== 'string') ||
    typeof title !== 'string' ||
    typeof tagName !== 'string' ||
    typeof publishedAt !== 'string'
  ) {
    throw createInvalidOfficialPostListResponseError();
  }

  return {
    endDate: normalizeNullableString(item.endDate),
    postId: normalizePostId(postId),
    publishedAt,
    tagName,
    title,
  };
}

function normalizeOfficialPostList(data: OfficialPostListResponse): OfficialPostList {
  const { content, hasNext, nextCursor } = data;

  if (!Array.isArray(content) || typeof hasNext !== 'boolean') {
    throw createInvalidOfficialPostListResponseError();
  }

  return {
    content: content.map(normalizeOfficialPostSummary),
    hasNext,
    nextCursor: typeof nextCursor === 'string' ? nextCursor : null,
  };
}

function normalizeOfficialPostDetail(data: OfficialPostDetailResponse): OfficialPostDetail {
  const {
    attachments,
    hasUnreadAttachments,
    imageUrls,
    isApplicable,
    isNotificationOn,
    isScrapped,
    postId,
    publishedAt,
    publisher,
    tagName,
    title,
  } = data;

  if (
    (typeof postId !== 'number' && typeof postId !== 'string') ||
    typeof title !== 'string' ||
    typeof publisher !== 'string' ||
    typeof publishedAt !== 'string' ||
    typeof tagName !== 'string' ||
    typeof isApplicable !== 'boolean' ||
    typeof hasUnreadAttachments !== 'boolean' ||
    typeof isScrapped !== 'boolean' ||
    typeof isNotificationOn !== 'boolean' ||
    !Array.isArray(imageUrls) ||
    !imageUrls.every((imageUrl) => typeof imageUrl === 'string') ||
    !Array.isArray(attachments)
  ) {
    throw createInvalidOfficialPostResponseError();
  }

  return {
    applyMethodDetail: normalizeNullableString(data.applyMethodDetail),
    applyMethodType: normalizeNullableString(data.applyMethodType),
    attachments: attachments.map(normalizeAttachment),
    contactEmail: normalizeNullableString(data.contactEmail),
    contactPhone: normalizeNullableString(data.contactPhone),
    contentHtml: normalizeString(data.contentHtml),
    eligibility: normalizeNullableString(data.eligibility),
    endDate: normalizeNullableString(data.endDate),
    endTime: normalizeNullableString(data.endTime),
    hasUnreadAttachments,
    imageUrls,
    isApplicable,
    isNotificationOn,
    isScrapped,
    postId: normalizePostId(postId),
    publishedAt,
    publisher,
    requiredDocuments: normalizeNullableString(data.requiredDocuments),
    sourceUrl: normalizeNullableString(data.sourceUrl),
    startDate: normalizeNullableString(data.startDate),
    startTime: normalizeNullableString(data.startTime),
    summary: normalizeString(data.summary),
    tagName,
    title,
  };
}

export const officialPostApi = {
  async list(params: OfficialPostListParams = {}) {
    const response = await request<OfficialPostListResponse>({
      method: 'get',
      params: {
        ...params,
        sort: params.sort ?? 'LATEST',
      },
      url: '/official-posts',
    });

    return {
      ...response,
      data: normalizeOfficialPostList(response.data),
    };
  },
  async getDetail(postId: number) {
    const response = await request<OfficialPostDetailResponse>({
      method: 'get',
      url: `/official-posts/${postId}`,
    });

    return {
      ...response,
      data: normalizeOfficialPostDetail(response.data),
    };
  },
  async getAttachmentDownloadUrl(postId: number, attachmentId: number | string) {
    const encodedAttachmentId = encodeURIComponent(String(attachmentId));
    const response = await request<OfficialPostAttachmentDownloadResponse>({
      method: 'get',
      url: `/official-posts/${postId}/attachments/${encodedAttachmentId}/download`,
    });

    return {
      ...response,
      data: normalizeAttachmentDownload(response.data),
    };
  },
};
