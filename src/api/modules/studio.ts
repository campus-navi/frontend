import { request } from '@/api/client';
import { COMMON_ERROR_CODES } from '@/api/constants/errorCodes';
import { createApiError } from '@/api/errors';
import type { ApiObjectData } from '@/api/types';
import type { AcademicPlanDocumentSectionKey, AcademicPlanType } from '@/api/modules/academicPlan';

export type StudioDocumentStatus =
  | 'ANALYZING'
  | 'COMPLETED'
  | 'DRAFT'
  | 'NEW'
  | 'UNKNOWN';

export interface StudioDocumentMetadata extends ApiObjectData {
  campusName: string;
  majorType: AcademicPlanType | null;
  selectedCampusId: number | null;
  selectedTargetId: number | null;
  targetName: string;
}

export interface StudioDocument extends ApiObjectData {
  id: number;
  metadata: StudioDocumentMetadata;
  status: StudioDocumentStatus;
  title: string;
  updatedAt: string;
}

export interface StudioDocumentSection extends ApiObjectData {
  content: string;
  sectionKey: AcademicPlanDocumentSectionKey;
}

export interface UpdateStudioDocumentRequest extends ApiObjectData {
  sections: StudioDocumentSection[];
}

export type UpdateStudioDocumentResponse = null;

interface StudioDocumentResponse extends ApiObjectData {
  campusId?: unknown;
  documentId?: unknown;
  documentType?: unknown;
  id?: unknown;
  majorType?: unknown;
  metadata?: unknown;
  status?: unknown;
  title?: unknown;
  targetId?: unknown;
  updatedAt?: unknown;
}

interface StudioDocumentSectionResponse extends ApiObjectData {
  content?: unknown;
  sectionKey?: unknown;
}

interface StudioDocumentsListResponse extends ApiObjectData {
  content?: unknown;
  documents?: unknown;
}

const documentTypeTitleMap: Record<string, string> = {
  ACADEMIC_PLAN: '학업계획서',
};

const academicPlanTypes = new Set<AcademicPlanType>([
  'DOUBLE_MAJOR',
  'COMPLEX_MAJOR',
  'CONVERGENCE_MAJOR',
  'STUDENT_DESIGN',
]);

const studioDocumentSectionKeys = new Set<AcademicPlanDocumentSectionKey>([
  'application_motive',
  'interest_field',
  'study_plan',
  'academic_plan_etc',
]);

function normalizeNumber(value: unknown) {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === 'string') {
    const numberValue = Number(value);

    return Number.isFinite(numberValue) ? numberValue : null;
  }

  return null;
}

function normalizeAcademicPlanType(value: unknown) {
  return academicPlanTypes.has(value as AcademicPlanType) ? (value as AcademicPlanType) : null;
}

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
  const metadataObject = metadata && typeof metadata === 'object' ? metadata as ApiObjectData : null;
  const majorType = normalizeAcademicPlanType(metadataObject?.majorType ?? item.majorType);
  const selectedCampusId = normalizeNumber(metadataObject?.selectedCampusId ?? metadataObject?.campusId ?? item.campusId);
  const selectedTargetId = normalizeNumber(metadataObject?.selectedTargetId ?? metadataObject?.targetId ?? item.targetId);

  if (
    typeof id !== 'number' ||
    !metadataObject ||
    typeof metadataObject.campusName !== 'string' ||
    typeof metadataObject.targetName !== 'string' ||
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
      campusName: metadataObject.campusName,
      majorType,
      selectedCampusId,
      selectedTargetId,
      targetName: metadataObject.targetName,
    },
    status: normalizeDocumentStatus(item.status),
    title: title || documentTypeTitleMap[documentType] || '문서',
    updatedAt: item.updatedAt,
  };
}

function normalizeStudioDocumentSection(item: StudioDocumentSectionResponse) {
  if (
    typeof item.sectionKey !== 'string' ||
    !studioDocumentSectionKeys.has(item.sectionKey as AcademicPlanDocumentSectionKey) ||
    typeof item.content !== 'string'
  ) {
    return null;
  }

  return {
    content: item.content,
    sectionKey: item.sectionKey as AcademicPlanDocumentSectionKey,
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
  async getDocumentSections(documentId: number) {
    const response = await request<StudioDocumentSectionResponse[]>({
      method: 'get',
      url: `/studio/documents/${documentId}/sections`,
    });

    if (!Array.isArray(response.data)) {
      throw createApiError({
        code: COMMON_ERROR_CODES.INVALID_RESPONSE,
        message: '스튜디오 문서 섹션 응답 형식이 올바르지 않습니다.',
        status: 200,
      });
    }

    return {
      ...response,
      data: response.data
        .map(normalizeStudioDocumentSection)
        .filter((section): section is StudioDocumentSection => section !== null),
    };
  },

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

  async updateDocument(documentId: number, payload: UpdateStudioDocumentRequest) {
    return request<UpdateStudioDocumentResponse>({
      data: payload,
      method: 'patch',
      url: `/studio/documents/${documentId}`,
    });
  },
};
