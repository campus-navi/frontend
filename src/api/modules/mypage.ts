import { request } from '@/api/client';
import { COMMON_ERROR_CODES } from '@/api/constants/errorCodes';
import { createApiError } from '@/api/errors';
import type { ApiObjectData } from '@/api/types';

export interface MyPageSummary extends ApiObjectData {
  admissionYear: number;
  campus: string;
  departments: string[];
  email: string;
  grade: number;
  interestCount: number;
  name: string;
  nickname: string;
  remindCount: number;
  scrapCount: number;
  studentNumber: string;
}

export interface MyPageRecentScrap extends ApiObjectData {
  postId: number;
  title: string;
  tagName: string;
  endDate: string | null;
  publishedAt: string;
}

export interface MyPageScrapFolder extends ApiObjectData {
  folderId: number;
  name: string;
  description: string;
  scrapCount: number;
}

export interface MyPageFolderScrap extends ApiObjectData {
  scrapId: number;
  postId: number;
  title: string;
  tagName: string;
  endDate: string | null;
  publishedAt: string;
  isActive: boolean;
}

export interface MyPageScraps extends ApiObjectData {
  recentScraps: MyPageRecentScrap[];
  folders: MyPageScrapFolder[];
}

export type MyPageScrapFolderSort =
  | 'RECENT_SAVED'
  | 'NAME_ASC'
  | 'NAME_DESC'
  | 'LIST_ADDED';

export interface CreateScrapFolderRequest extends ApiObjectData {
  name: string;
  description?: string;
}

export interface UpdateScrapFolderRequest extends ApiObjectData {
  name: string;
  description: string;
}

export interface RemoveScrapsFromFolderRequest extends ApiObjectData {
  scrapIds: number[];
}

export interface RemoveScrapsFromFolderResult extends ApiObjectData {
  deletedCount: number;
  deletedPostIds: number[];
}

export interface RestoreScrapsToFolderRequest extends ApiObjectData {
  postIds: number[];
}

interface MyPageSummaryResponse extends ApiObjectData {
  admissionYear?: unknown;
  campus?: unknown;
  departments?: unknown;
  email?: unknown;
  grade?: unknown;
  interestCount?: unknown;
  name?: unknown;
  nickname?: unknown;
  remindCount?: unknown;
  scrapCount?: unknown;
  studentNumber?: unknown;
}

interface MyPageRecentScrapResponse extends ApiObjectData {
  postId?: unknown;
  title?: unknown;
  tagName?: unknown;
  endDate?: unknown;
  publishedAt?: unknown;
}

interface MyPageScrapFolderResponse extends ApiObjectData {
  folderId?: unknown;
  name?: unknown;
  description?: unknown;
  scrapCount?: unknown;
}

interface MyPageScrapsResponse extends ApiObjectData {
  recentScraps?: unknown;
  folders?: unknown;
}

interface MyPageFolderScrapResponse extends ApiObjectData {
  scrapId?: unknown;
  postId?: unknown;
  title?: unknown;
  tagName?: unknown;
  endDate?: unknown;
  publishedAt?: unknown;
  isActive?: unknown;
}

interface RemoveScrapsFromFolderResponse extends ApiObjectData {
  deletedCount?: unknown;
  deletedPostIds?: unknown;
}

function normalizeMyPageSummary(data: MyPageSummaryResponse): MyPageSummary {
  if (
    typeof data.name !== 'string' ||
    typeof data.nickname !== 'string' ||
    typeof data.email !== 'string' ||
    typeof data.campus !== 'string' ||
    typeof data.admissionYear !== 'number' ||
    typeof data.grade !== 'number' ||
    !Array.isArray(data.departments) ||
    !data.departments.every((department) => typeof department === 'string') ||
    typeof data.scrapCount !== 'number' ||
    typeof data.remindCount !== 'number' ||
    typeof data.interestCount !== 'number' ||
    (typeof data.studentNumber !== 'string' && typeof data.studentNumber !== 'number')
  ) {
    throw createApiError({
      code: COMMON_ERROR_CODES.INVALID_RESPONSE,
      message: '마이페이지 응답 형식이 올바르지 않습니다.',
      status: 200,
    });
  }

  return {
    admissionYear: data.admissionYear,
    campus: data.campus,
    departments: data.departments,
    email: data.email,
    grade: data.grade,
    interestCount: data.interestCount,
    name: data.name,
    nickname: data.nickname,
    remindCount: data.remindCount,
    scrapCount: data.scrapCount,
    studentNumber: String(data.studentNumber),
  };
}

function isMyPageRecentScrapResponse(scrap: unknown): scrap is MyPageRecentScrap {
  if (!scrap || typeof scrap !== 'object') {
    return false;
  }

  const recentScrap = scrap as MyPageRecentScrapResponse;

  return (
    typeof recentScrap.postId === 'number' &&
    typeof recentScrap.title === 'string' &&
    typeof recentScrap.tagName === 'string' &&
    (typeof recentScrap.endDate === 'string' || recentScrap.endDate === null) &&
    typeof recentScrap.publishedAt === 'string'
  );
}

function isMyPageScrapFolderResponse(folder: unknown): folder is MyPageScrapFolder {
  if (!folder || typeof folder !== 'object') {
    return false;
  }

  const scrapFolder = folder as MyPageScrapFolderResponse;

  return (
    typeof scrapFolder.folderId === 'number' &&
    typeof scrapFolder.name === 'string' &&
    (typeof scrapFolder.description === 'string' ||
      scrapFolder.description === null ||
      typeof scrapFolder.description === 'undefined') &&
    typeof scrapFolder.scrapCount === 'number'
  );
}

function normalizeMyPageScraps(data: MyPageScrapsResponse): MyPageScraps {
  if (
    !Array.isArray(data.recentScraps) ||
    !data.recentScraps.every(isMyPageRecentScrapResponse) ||
    !Array.isArray(data.folders) ||
    !data.folders.every(isMyPageScrapFolderResponse)
  ) {
    throw createApiError({
      code: COMMON_ERROR_CODES.INVALID_RESPONSE,
      message: '마이페이지 스크랩 응답 형식이 올바르지 않습니다.',
      status: 200,
    });
  }

  return {
    recentScraps: data.recentScraps.map((scrap) => ({
      postId: scrap.postId,
      title: scrap.title,
      tagName: scrap.tagName,
      endDate: scrap.endDate,
      publishedAt: scrap.publishedAt,
    })),
    folders: data.folders.map((folder) => ({
      folderId: folder.folderId,
      name: folder.name,
      description: typeof folder.description === 'string' ? folder.description : '',
      scrapCount: folder.scrapCount,
    })),
  };
}

function isMyPageFolderScrapResponse(scrap: unknown): scrap is MyPageFolderScrap {
  if (!scrap || typeof scrap !== 'object') {
    return false;
  }

  const folderScrap = scrap as MyPageFolderScrapResponse;

  return (
    typeof folderScrap.scrapId === 'number' &&
    typeof folderScrap.postId === 'number' &&
    typeof folderScrap.title === 'string' &&
    typeof folderScrap.tagName === 'string' &&
    (typeof folderScrap.endDate === 'string' || folderScrap.endDate === null) &&
    typeof folderScrap.publishedAt === 'string' &&
    typeof folderScrap.isActive === 'boolean'
  );
}

function normalizeMyPageFolderScraps(data: unknown): MyPageFolderScrap[] {
  if (!Array.isArray(data) || !data.every(isMyPageFolderScrapResponse)) {
    throw createApiError({
      code: COMMON_ERROR_CODES.INVALID_RESPONSE,
      message: '스크랩 폴더 목록 응답 형식이 올바르지 않습니다.',
      status: 200,
    });
  }

  return data.map((scrap) => ({
    scrapId: scrap.scrapId,
    postId: scrap.postId,
    title: scrap.title,
    tagName: scrap.tagName,
    endDate: scrap.endDate,
    publishedAt: scrap.publishedAt,
    isActive: scrap.isActive,
  }));
}

function normalizeRemoveScrapsFromFolderResult(
  data: RemoveScrapsFromFolderResponse,
): RemoveScrapsFromFolderResult {
  if (
    typeof data.deletedCount !== 'number' ||
    !Array.isArray(data.deletedPostIds) ||
    !data.deletedPostIds.every((postId) => typeof postId === 'number')
  ) {
    throw createApiError({
      code: COMMON_ERROR_CODES.INVALID_RESPONSE,
      message: '스크랩 제거 응답 형식이 올바르지 않습니다.',
      status: 200,
    });
  }

  return {
    deletedCount: data.deletedCount,
    deletedPostIds: data.deletedPostIds,
  };
}

export const mypageApi = {
  async getSummary() {
    const response = await request<MyPageSummaryResponse>({
      method: 'get',
      url: '/mypage',
    });

    return {
      ...response,
      data: normalizeMyPageSummary(response.data),
    };
  },

  async getScraps() {
    const response = await request<MyPageScrapsResponse>({
      method: 'get',
      url: '/mypage/scraps',
    });

    return {
      ...response,
      data: normalizeMyPageScraps(response.data),
    };
  },

  async getScrapFolders(sort: MyPageScrapFolderSort = 'RECENT_SAVED') {
    const response = await request<MyPageScrapFolderResponse[]>({
      method: 'get',
      params: { sort },
      url: '/scrap-folders',
    });

    if (!Array.isArray(response.data) || !response.data.every(isMyPageScrapFolderResponse)) {
      throw createApiError({
        code: COMMON_ERROR_CODES.INVALID_RESPONSE,
        message: '스크랩 폴더 목록 응답 형식이 올바르지 않습니다.',
        status: 200,
      });
    }

    return {
      ...response,
      data: response.data.map((folder) => ({
        description: typeof folder.description === 'string' ? folder.description : '',
        folderId: folder.folderId,
        name: folder.name,
        scrapCount: folder.scrapCount,
      })),
    };
  },

  async getFolderScraps(folderId: number) {
    const response = await request<MyPageFolderScrap[]>({
      method: 'get',
      url: `/scrap-folders/${folderId}/scraps`,
    });

    return {
      ...response,
      data: normalizeMyPageFolderScraps(response.data),
    };
  },

  async removeScrapsFromFolder(
    folderId: number,
    removeRequest: RemoveScrapsFromFolderRequest,
  ) {
    const response = await request<RemoveScrapsFromFolderResponse>({
      data: removeRequest,
      method: 'delete',
      url: `/scrap-folders/${folderId}/scraps`,
    });

    return {
      ...response,
      data: normalizeRemoveScrapsFromFolderResult(response.data),
    };
  },

  async restoreScrapsToFolder(
    folderId: number,
    restoreRequest: RestoreScrapsToFolderRequest,
  ) {
    return request<null>({
      data: restoreRequest,
      method: 'post',
      url: `/scrap-folders/${folderId}/scraps/restore`,
    });
  },

  async createScrapFolder(createRequest: CreateScrapFolderRequest) {
    return request<null>({
      data: createRequest,
      method: 'post',
      url: '/scrap-folders',
    });
  },

  async updateScrapFolder(folderId: number, updateRequest: UpdateScrapFolderRequest) {
    return request<null>({
      data: updateRequest,
      method: 'patch',
      url: `/scrap-folders/${folderId}`,
    });
  },

  async deleteScrapFolder(folderId: number) {
    return request<null>({
      method: 'delete',
      url: `/scrap-folders/${folderId}`,
    });
  },
};
