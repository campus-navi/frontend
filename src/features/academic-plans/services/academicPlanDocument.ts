import {
  academicPlanApi,
  studioApi,
  type AcademicPlanDocumentSectionKey,
  type CreateAcademicPlanDocumentRequest,
  type StudioDocumentSection,
} from '@/api';
import {
  academicPlanSectionConfigs,
} from '@/features/academic-plans/academicPlanEditorState';
import type {
  AcademicPlanEditorCreateRouteState,
  AcademicPlanEditorRouteState,
  AcademicPlanSectionId,
} from '@/features/academic-plans/types';

const academicPlanDocumentSectionKeyMap: Record<AcademicPlanSectionId, AcademicPlanDocumentSectionKey> = {
  etc: 'academic_plan_etc',
  interest: 'interest_field',
  motivation: 'application_motive',
  studyPlan: 'study_plan',
};

export type SaveAcademicPlanDocumentResult = {
  documentId?: number;
};

export function createAcademicPlanDocumentSections(
  editorState: AcademicPlanEditorRouteState,
): StudioDocumentSection[] {
  return academicPlanSectionConfigs
    .filter((section) => editorState.sections[section.id].isSaved)
    .map((section) => ({
      content: editorState.sections[section.id].value.trim(),
      sectionKey: academicPlanDocumentSectionKeyMap[section.id],
    }))
    .filter((section) => section.content.length > 0);
}

function createAcademicPlanDocumentPayload(
  editorState: AcademicPlanEditorCreateRouteState,
): CreateAcademicPlanDocumentRequest {
  return {
    majorType: editorState.selectedPlanType,
    sections: createAcademicPlanDocumentSections(editorState),
    targetId: editorState.selectedTargetId,
  };
}

export async function saveAcademicPlanDocument(
  editorState: AcademicPlanEditorRouteState,
): Promise<SaveAcademicPlanDocumentResult> {
  if (editorState.mode === 'edit') {
    await studioApi.updateDocument(editorState.documentId, {
      sections: createAcademicPlanDocumentSections(editorState),
    });

    return { documentId: editorState.documentId };
  }

  const response = await academicPlanApi.createDocument(createAcademicPlanDocumentPayload(editorState));

  // TODO(#320): use response.data.id as the required documentId once the create API response is finalized.
  return { documentId: response.data?.id };
}
