import type { AcademicPlanType } from '@/api';
import type {
  AcademicPlanCompletedSelection,
  AcademicPlanEditorCreateRouteState,
  AcademicPlanEditorEditRouteState,
  AcademicPlanEditorRouteState,
  AcademicPlanSectionId,
  AcademicPlanSectionValues,
} from '@/features/academic-plans/types';

export const ACADEMIC_PLAN_MAX_SECTION_LENGTH = 1000;

export const academicPlanSectionConfigs: Array<{
  description: string;
  icon: string;
  id: AcademicPlanSectionId;
  required: boolean;
  title: string;
}> = [
  {
    description:
      '기존 전공을 공부하며 느꼈던 학문적 한계나 갈증을 바탕으로, 희망 학과에 진입하고자 하는 구체적이고 진솔한 계기를 작성해주세요',
    icon: '🪪',
    id: 'motivation',
    required: true,
    title: '지원동기',
  },
  {
    description: '해당 전공 내에서 특히 관심을 가지고 있는 세부 분야나 주제가 있다면 기술해 주세요.',
    icon: '🎓',
    id: 'interest',
    required: true,
    title: '관심분야',
  },
  {
    description:
      '희망학과 진입 후 수강할 구체적인 교과명과 학수번호, 구체적인 학점 이수계획, 1전공과 구체적으로 어떤 시너지를 낼 것인지 등에 대한 계획을 상세히 작성해주세요.',
    icon: '📚',
    id: 'studyPlan',
    required: true,
    title: '학업계획',
  },
  {
    description:
      '장학금 수혜, K-MOOC와 같은 온라인 공개 강좌 수강 이력 및 인증번호, 봉사활동 등 그동안 꾸준하게 노력해 온 성실함의 흔적들을 나열해 주세요.',
    icon: '🌐',
    id: 'etc',
    required: true,
    title: '기타',
  },
];

const academicPlanTypes = new Set<AcademicPlanType>([
  'DOUBLE_MAJOR',
  'COMPLEX_MAJOR',
  'CONVERGENCE_MAJOR',
  'STUDENT_DESIGN',
]);

export function createEmptyAcademicPlanSections(): AcademicPlanSectionValues {
  return {
    etc: { isSaved: false, value: '' },
    interest: { isSaved: false, value: '' },
    motivation: { isSaved: false, value: '' },
    studyPlan: { isSaved: false, value: '' },
  };
}

function getAcademicPlanCompletedSelection(state: unknown): AcademicPlanCompletedSelection | null {
  if (!state || typeof state !== 'object') {
    return null;
  }

  const selection = state as Partial<AcademicPlanCompletedSelection>;

  if (
    typeof selection.selectedCampusId !== 'number' ||
    typeof selection.selectedCampusName !== 'string' ||
    !academicPlanTypes.has(selection.selectedPlanType as AcademicPlanType) ||
    typeof selection.selectedTargetId !== 'number' ||
    typeof selection.selectedTargetName !== 'string'
  ) {
    return null;
  }

  return {
    selectedCampusId: selection.selectedCampusId,
    selectedCampusName: selection.selectedCampusName,
    selectedPlanType: selection.selectedPlanType as AcademicPlanType,
    selectedTargetId: selection.selectedTargetId,
    selectedTargetName: selection.selectedTargetName,
  };
}

function getAcademicPlanType(value: unknown) {
  return academicPlanTypes.has(value as AcademicPlanType) ? (value as AcademicPlanType) : null;
}

function getNullableNumber(value: unknown) {
  return typeof value === 'number' ? value : null;
}

function normalizeSectionState(value: unknown) {
  if (!value || typeof value !== 'object') {
    return null;
  }

  const section = value as { isSaved?: unknown; value?: unknown };

  if (typeof section.value !== 'string' || typeof section.isSaved !== 'boolean') {
    return null;
  }

  return {
    isSaved: section.isSaved,
    value: section.value.slice(0, ACADEMIC_PLAN_MAX_SECTION_LENGTH),
  };
}

function normalizeSections(stateSections: unknown) {
  const emptySections = createEmptyAcademicPlanSections();

  if (!stateSections || typeof stateSections !== 'object') {
    return emptySections;
  }

  const normalizedSections = { ...emptySections };

  for (const config of academicPlanSectionConfigs) {
    const section = normalizeSectionState((stateSections as Partial<AcademicPlanSectionValues>)[config.id]);

    if (section) {
      normalizedSections[config.id] = section;
    }
  }

  return normalizedSections;
}

function getAcademicPlanEditorEditRouteState(state: unknown): AcademicPlanEditorEditRouteState | null {
  if (!state || typeof state !== 'object') {
    return null;
  }

  const partialState = state as Partial<AcademicPlanEditorEditRouteState>;
  const selectedPlanType = getAcademicPlanType(partialState.selectedPlanType);

  if (
    partialState.documentId === undefined ||
    typeof partialState.documentId !== 'number' ||
    typeof partialState.selectedCampusName !== 'string' ||
    selectedPlanType === null ||
    typeof partialState.selectedTargetName !== 'string'
  ) {
    return null;
  }

  return {
    documentId: partialState.documentId,
    mode: 'edit',
    sections: normalizeSections(partialState.sections),
    selectedCampusId: getNullableNumber(partialState.selectedCampusId),
    selectedCampusName: partialState.selectedCampusName,
    selectedPlanType,
    selectedTargetId: getNullableNumber(partialState.selectedTargetId),
    selectedTargetName: partialState.selectedTargetName,
  };
}

export function getAcademicPlanEditorRouteState(state: unknown): AcademicPlanEditorRouteState | null {
  const editState = getAcademicPlanEditorEditRouteState(state);

  if (editState) {
    return editState;
  }

  const selection = getAcademicPlanCompletedSelection(state);

  if (!selection) {
    return null;
  }

  const partialState = state as Partial<AcademicPlanEditorRouteState>;

  return {
    ...selection,
    mode: 'create',
    sections: normalizeSections(partialState.sections),
  } satisfies AcademicPlanEditorCreateRouteState;
}

export function getAcademicPlanSectionConfig(sectionId: string | undefined) {
  return academicPlanSectionConfigs.find((config) => config.id === sectionId) ?? null;
}
