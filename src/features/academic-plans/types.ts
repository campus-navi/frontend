import type { AcademicPlanType } from '@/api';

export type AcademicPlanSelection = {
  selectedCampusId: number | null;
  selectedCampusName: string;
  selectedPlanType: AcademicPlanType | null;
  selectedTargetId: number | null;
  selectedTargetName: string;
};

export type AcademicPlanTypeOption = {
  type: AcademicPlanType;
  label: string;
};
