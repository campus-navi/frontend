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

export type AcademicPlanEditorCreateRouteState = AcademicPlanCompletedSelection & {
  documentId?: undefined;
  mode: 'create';
  sections: AcademicPlanSectionValues;
};

export type AcademicPlanEditorEditRouteState = Omit<
  AcademicPlanCompletedSelection,
  'selectedCampusId' | 'selectedTargetId'
> & {
  documentId: number;
  mode: 'edit';
  sections: AcademicPlanSectionValues;
  selectedCampusId: number | null;
  selectedTargetId: number | null;
};

export type AcademicPlanEditorRouteState =
  | AcademicPlanEditorCreateRouteState
  | AcademicPlanEditorEditRouteState;

export type AcademicPlanTypeOption = {
  type: AcademicPlanType;
  label: string;
};
