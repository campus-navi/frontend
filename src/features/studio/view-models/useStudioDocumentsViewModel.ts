import { useMutation } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { studioApi, type AcademicPlanDocumentSectionKey, type StudioDocument } from '@/api';
import {
  ACADEMIC_PLAN_MAX_SECTION_LENGTH,
  createEmptyAcademicPlanSections,
} from '@/features/academic-plans/academicPlanEditorState';
import type {
  AcademicPlanEditorRouteState,
  AcademicPlanSectionId,
  AcademicPlanSectionValues,
} from '@/features/academic-plans/types';
import { useStudioDocuments } from '@/features/studio/hooks/useStudioDocuments';

export type StudioDocumentFilter = 'all' | 'completed' | 'draft';

const EMPTY_STUDIO_DOCUMENTS: StudioDocument[] = [];
const studioSectionKeyMap: Partial<Record<AcademicPlanDocumentSectionKey, AcademicPlanSectionId>> = {
  academic_plan_etc: 'etc',
  application_motive: 'motivation',
  interest_field: 'interest',
  study_plan: 'studyPlan',
};

function createEditorRouteStateFromDocument(
  document: StudioDocument,
  sections: Awaited<ReturnType<typeof studioApi.getDocumentSections>>['data'],
): AcademicPlanEditorRouteState {
  const { campusId, majorType, targetId } = document.metadata;

  if (majorType === undefined) {
    throw new Error('문서 정보를 불러오지 못했어요. 잠시 후 다시 시도해주세요.');
  }

  const sectionValues: AcademicPlanSectionValues = createEmptyAcademicPlanSections();

  for (const section of sections) {
    const sectionId = studioSectionKeyMap[section.sectionKey];

    if (!sectionId) {
      continue;
    }

    sectionValues[sectionId] = {
      isSaved: section.content.trim().length > 0,
      value: section.content.slice(0, ACADEMIC_PLAN_MAX_SECTION_LENGTH),
    };
  }

  return {
    documentId: document.id,
    mode: 'edit',
    sections: sectionValues,
    selectedCampusId: campusId ?? null,
    selectedCampusName: document.metadata.campusName,
    selectedPlanType: majorType,
    selectedTargetId: targetId ?? null,
    selectedTargetName: document.metadata.targetName,
  };
}

type UseStudioDocumentsViewModelOptions = {
  analyzingDocument?: StudioDocument;
};

export function useStudioDocumentsViewModel({ analyzingDocument }: UseStudioDocumentsViewModelOptions = {}) {
  const navigate = useNavigate();
  const [selectedFilter, setSelectedFilter] = useState<StudioDocumentFilter>('all');
  const studioDocumentsQuery = useStudioDocuments();
  const openDraftMutation = useMutation({
    mutationFn: async (document: StudioDocument) => {
      const response = await studioApi.getDocumentSections(document.id);

      return createEditorRouteStateFromDocument(document, response.data);
    },
    onSuccess: (routeState) => {
      navigate('/studio/academic-plans/editor', { state: routeState });
    },
  });
  const documents = useMemo(() => {
    const queryDocuments = studioDocumentsQuery.data ?? EMPTY_STUDIO_DOCUMENTS;

    if (!analyzingDocument) {
      return queryDocuments;
    }

    const hasSameDocument = queryDocuments.some((document) => document.id === analyzingDocument.id);

    if (!hasSameDocument) {
      return [analyzingDocument, ...queryDocuments];
    }

    return queryDocuments.map((document) =>
      document.id === analyzingDocument.id && document.status !== 'COMPLETED'
        ? {
            ...document,
            status: 'ANALYZING' as const,
            updatedAt: analyzingDocument.updatedAt,
          }
        : document,
    );
  }, [analyzingDocument, studioDocumentsQuery.data]);
  const counts = useMemo(
    () => ({
      all: documents.length,
      completed: documents.filter((document) => document.status === 'COMPLETED').length,
      draft: documents.filter((document) => document.status === 'DRAFT').length,
    }),
    [documents],
  );
  const filteredDocuments = useMemo(() => {
    if (selectedFilter === 'all') {
      return documents;
    }

    return documents.filter((document) => {
      if (selectedFilter === 'completed') {
        return document.status === 'COMPLETED';
      }

      return document.status === 'DRAFT';
    });
  }, [documents, selectedFilter]);

  return {
    continueDraftErrorMessage: openDraftMutation.isError
      ? openDraftMutation.error instanceof Error
        ? openDraftMutation.error.message
        : '문서 내용을 불러오지 못했어요. 잠시 후 다시 시도해주세요.'
      : '',
    counts,
    filteredDocuments,
    isError: studioDocumentsQuery.isError,
    isLoading: studioDocumentsQuery.isLoading,
    isOpeningDraft: openDraftMutation.isPending,
    openDocument: (document: StudioDocument) => {
      if (document.status === 'ANALYZING') {
        navigate(`/studio/documents/${document.id}/analyzing`, { state: { document } });
        return;
      }

      if (document.status !== 'DRAFT' || openDraftMutation.isPending) {
        return;
      }

      openDraftMutation.mutate(document);
    },
    retry: () => void studioDocumentsQuery.refetch(),
    selectedFilter,
    setSelectedFilter,
  };
}

export type StudioDocumentsViewModel = ReturnType<typeof useStudioDocumentsViewModel>;
