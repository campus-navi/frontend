import type { AcademicPlanType } from '@/api';

export type AcademicPlanSelection = {
  selectedCampusId: number | null;
  selectedCampusName: string;
  selectedPlanType: AcademicPlanType | null;
  selectedTargetId: number | null;
  selectedTargetName: string;
};

export type AcademicPlanCompletedSelection = {
  selectedCampusId: number;
  selectedCampusName: string;
  selectedPlanType: AcademicPlanType;
  selectedTargetId: number;
  selectedTargetName: string;
};

export type AcademicPlanSectionId = 'motivation' | 'interest' | 'studyPlan' | 'etc';

export type AcademicPlanSectionState = {
  value: string;
  isSaved: boolean;
};

export type AcademicPlanSectionValues = Record<AcademicPlanSectionId, AcademicPlanSectionState>;

export type AcademicPlanEditorRouteState = AcademicPlanCompletedSelection & {
  documentId?: number;
  sections: AcademicPlanSectionValues;
};

export type AcademicPlanTypeOption = {
  type: AcademicPlanType;
  label: string;
};
