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
  campusId?: number;
  campusName: string;
  majorType?: AcademicPlanType;
  targetId?: number;
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

interface StudioDocumentSectionsResponse extends ApiObjectData {
  documentType?: unknown;
  id?: unknown;
  sections?: unknown;
  status?: unknown;
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
  if (typeof value !== 'string') {
    return null;
  }

  const normalizedValue = value.toUpperCase();

  return academicPlanTypes.has(normalizedValue as AcademicPlanType) ? (normalizedValue as AcademicPlanType) : null;
}

function getObject(value: unknown) {
  return value && typeof value === 'object' ? value as ApiObjectData : null;
}

function getString(value: unknown) {
  return typeof value === 'string' ? value : null;
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
  const metadataObject = getObject(metadata);
  const campus = getObject(metadataObject?.campus);
  const target = getObject(metadataObject?.target);
  const department = getObject(metadataObject?.department);
  const plan = getObject(metadataObject?.plan);
  const planType = getObject(metadataObject?.planType);
  const academicPlan = getObject(metadataObject?.academicPlan);
  const academicPlanType = getObject(metadataObject?.academicPlanType);
  const major = getObject(metadataObject?.major);
  const majorTypeObject = getObject(metadataObject?.majorType);
  const majorType = normalizeAcademicPlanType(
    metadataObject?.majorType ??
      metadataObject?.planType ??
      metadataObject?.selectedPlanType ??
      metadataObject?.academicPlanType ??
      metadataObject?.type ??
      metadataObject?.applicationType ??
      majorTypeObject?.code ??
      majorTypeObject?.value ??
      majorTypeObject?.type ??
      planType?.code ??
      planType?.value ??
      planType?.type ??
      academicPlanType?.code ??
      academicPlanType?.value ??
      academicPlanType?.type ??
      plan?.majorType ??
      plan?.planType ??
      plan?.type ??
      academicPlan?.majorType ??
      academicPlan?.planType ??
      academicPlan?.type ??
      item.majorType,
  );
  const campusId = normalizeNumber(
    metadataObject?.campusId ??
      metadataObject?.selectedCampusId ??
      campus?.id ??
      item.campusId,
  );
  const targetId = normalizeNumber(
    metadataObject?.targetId ??
      metadataObject?.selectedTargetId ??
      metadataObject?.departmentId ??
      metadataObject?.targetMajorId ??
      metadataObject?.majorId ??
      target?.id ??
      department?.id ??
      major?.id ??
      item.targetId,
  );
  const campusName = getString(metadataObject?.campusName) ?? getString(campus?.name);
  const targetName =
    getString(metadataObject?.targetName) ??
    getString(target?.name) ??
    getString(department?.name) ??
    getString(major?.name);

  if (
    typeof id !== 'number' ||
    !metadataObject ||
    campusName === null ||
    targetName === null ||
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
      ...(campusId === null ? {} : { campusId }),
      campusName,
      ...(majorType === null ? {} : { majorType }),
      ...(targetId === null ? {} : { targetId }),
      targetName,
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

function getStudioDocumentSectionItems(data: unknown) {
  if (Array.isArray(data)) {
    return data;
  }

  if (!data || typeof data !== 'object') {
    return null;
  }

  const detail = data as StudioDocumentSectionsResponse;

  return Array.isArray(detail.sections) ? detail.sections : null;
}

export const studioApi = {
  async getDocumentSections(documentId: number) {
    const response = await request<StudioDocumentSectionResponse[] | StudioDocumentSectionsResponse>({
      method: 'get',
      url: `/studio/documents/${documentId}/sections`,
    });
    const items = getStudioDocumentSectionItems(response.data);

    if (!items || !items.every((item) => item && typeof item === 'object')) {
      throw createApiError({
        code: COMMON_ERROR_CODES.INVALID_RESPONSE,
        message: '스튜디오 문서 섹션 응답 형식이 올바르지 않습니다.',
        status: 200,
      });
    }

    return {
      ...response,
      data: items
        .map((item) => normalizeStudioDocumentSection(item as StudioDocumentSectionResponse))
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
