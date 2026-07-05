import { request } from '@/api/client';
import { COMMON_ERROR_CODES } from '@/api/constants/errorCodes';
import { createApiError } from '@/api/errors';
import type { ApiObjectData } from '@/api/types';

export type StudioDocumentStatus =
  | 'ANALYZING'
  | 'COMPLETED'
  | 'DRAFT'
  | 'NEW'
  | 'UNKNOWN';

export interface StudioDocumentMetadata extends ApiObjectData {
  campusName: string;
  targetName: string;
}

export interface StudioDocument extends ApiObjectData {
  id: number;
  metadata: StudioDocumentMetadata;
  status: StudioDocumentStatus;
  title: string;
  updatedAt: string;
}

interface StudioDocumentResponse extends ApiObjectData {
  documentId?: unknown;
  documentType?: unknown;
  id?: unknown;
  metadata?: unknown;
  status?: unknown;
  title?: unknown;
  updatedAt?: unknown;
}

interface StudioDocumentsListResponse extends ApiObjectData {
  content?: unknown;
  documents?: unknown;
}

const documentTypeTitleMap: Record<string, string> = {
  ACADEMIC_PLAN: '학업계획서',
};

function normalizeDocumentStatus(status: unknown): StudioDocumentStatus {
  if (typeof status !== 'string') {
    return 'UNKNOWN';
  }

  const normalizedStatus = status.toUpperCase();

  if (normalizedStatus.includes('DRAFT')) {
    return 'DRAFT';
  }

  if (normalizedStatus.includes('COMPLETED') || normalizedStatus.includes('COMPLETE')) {
    return 'COMPLETED';
  }

  if (normalizedStatus.includes('ANALYZ')) {
    return 'ANALYZING';
  }

  if (normalizedStatus.includes('NEW')) {
    return 'NEW';
  }

  return 'UNKNOWN';
}

function normalizeStudioDocument(item: StudioDocumentResponse): StudioDocument {
  const id = item.id ?? item.documentId;
  const metadata = item.metadata;
  const title = typeof item.title === 'string' ? item.title : null;
  const documentType = typeof item.documentType === 'string' ? item.documentType : '';

  if (
    typeof id !== 'number' ||
    !metadata ||
    typeof metadata !== 'object' ||
    typeof (metadata as Partial<StudioDocumentMetadata>).campusName !== 'string' ||
    typeof (metadata as Partial<StudioDocumentMetadata>).targetName !== 'string' ||
    typeof item.updatedAt !== 'string'
  ) {
    throw createApiError({
      code: COMMON_ERROR_CODES.INVALID_RESPONSE,
      message: '스튜디오 문서 목록 응답 형식이 올바르지 않습니다.',
      status: 200,
    });
  }

  return {
    id,
    metadata: {
      campusName: (metadata as StudioDocumentMetadata).campusName,
      targetName: (metadata as StudioDocumentMetadata).targetName,
    },
    status: normalizeDocumentStatus(item.status),
    title: title || documentTypeTitleMap[documentType] || '문서',
    updatedAt: item.updatedAt,
  };
}

function getStudioDocumentItems(data: unknown) {
  if (Array.isArray(data)) {
    return data;
  }

  if (!data || typeof data !== 'object') {
    return null;
  }

  const list = data as StudioDocumentsListResponse;

  if (Array.isArray(list.content)) {
    return list.content;
  }

  if (Array.isArray(list.documents)) {
    return list.documents;
  }

  return null;
}

export const studioApi = {
  async getDocuments() {
    const response = await request<StudioDocumentResponse[] | StudioDocumentsListResponse>({
      method: 'get',
      url: '/studio/documents',
    });
    const items = getStudioDocumentItems(response.data);

    if (!items || !items.every((item) => item && typeof item === 'object')) {
      throw createApiError({
        code: COMMON_ERROR_CODES.INVALID_RESPONSE,
        message: '스튜디오 문서 목록 응답 형식이 올바르지 않습니다.',
        status: 200,
      });
    }

    return {
      ...response,
      data: items.map((item) => normalizeStudioDocument(item as StudioDocumentResponse)),
    };
  },
};
