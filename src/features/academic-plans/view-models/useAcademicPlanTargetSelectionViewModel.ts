import { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { isDepartmentPlanType, type AcademicPlanTargetOption, type AcademicPlanType } from '@/api';
import { useAcademicPlanTargetCampuses } from '@/features/academic-plans/hooks/useAcademicPlanTargetCampuses';
import { useAcademicPlanTargetOptions } from '@/features/academic-plans/hooks/useAcademicPlanTargetOptions';
import type {
  AcademicPlanCompletedSelection,
  AcademicPlanSelection,
  AcademicPlanTypeOption,
} from '@/features/academic-plans/types';

export const academicPlanTypeOptions: AcademicPlanTypeOption[] = [
  { type: 'DOUBLE_MAJOR', label: '이중전공' },
  { type: 'COMPLEX_MAJOR', label: '복합전공' },
  { type: 'CONVERGENCE_MAJOR', label: '융합전공' },
  { type: 'STUDENT_DESIGN', label: '학생설계전공' },
];

const initialSelection: AcademicPlanSelection = {
  selectedCampusId: null,
  selectedCampusName: '',
  selectedPlanType: null,
  selectedTargetId: null,
  selectedTargetName: '',
};

function getInitialPlanType(value: string | null): AcademicPlanType | null {
  const option = academicPlanTypeOptions.find((item) => item.type === value);

  return option?.type ?? 'DOUBLE_MAJOR';
}

export function useAcademicPlanTargetSelectionViewModel() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [targetSearchQuery, setTargetSearchQuery] = useState('');
  const [selection, setSelection] = useState<AcademicPlanSelection>(() => ({
    ...initialSelection,
    selectedPlanType: getInitialPlanType(searchParams.get('type')),
  }));

  const campusQuery = useAcademicPlanTargetCampuses();
  const targetQuery = useAcademicPlanTargetOptions({
    campusId: selection.selectedCampusId,
    planType: selection.selectedPlanType,
  });

  const selectedPlanTypeLabel = useMemo(() => {
    return academicPlanTypeOptions.find((option) => option.type === selection.selectedPlanType)?.label ?? '';
  }, [selection.selectedPlanType]);

  const targetKindLabel =
    selection.selectedPlanType && isDepartmentPlanType(selection.selectedPlanType) ? '학과' : '전공';
  const filteredTargets = useMemo(() => {
    const targets = targetQuery.data ?? [];
    const trimmedQuery = targetSearchQuery.trim();

    if (!trimmedQuery) {
      return targets;
    }

    return targets.filter((target) => target.name.includes(trimmedQuery));
  }, [targetQuery.data, targetSearchQuery]);

  const isNextEnabled =
    selection.selectedCampusId !== null &&
    selection.selectedPlanType !== null &&
    selection.selectedTargetId !== null;

  const selectCampus = (campus: AcademicPlanTargetOption) => {
    setSelection((current) => ({
      ...current,
      selectedCampusId: campus.id,
      selectedCampusName: campus.name,
      selectedTargetId: null,
      selectedTargetName: '',
    }));
    setTargetSearchQuery('');
  };

  const selectPlanType = (planType: AcademicPlanType) => {
    setSelection((current) => ({
      ...current,
      selectedPlanType: planType,
      selectedTargetId: null,
      selectedTargetName: '',
    }));
    setTargetSearchQuery('');
  };

  const selectTarget = (target: AcademicPlanTargetOption) => {
    if (selection.selectedCampusId === null || selection.selectedPlanType === null) {
      return;
    }

    const completedSelection: AcademicPlanCompletedSelection = {
      selectedCampusId: selection.selectedCampusId,
      selectedCampusName: selection.selectedCampusName,
      selectedPlanType: selection.selectedPlanType,
      selectedTargetId: target.id,
      selectedTargetName: target.name,
    };

    setSelection(completedSelection);
    navigate('/studio/academic-plans/editor', { state: completedSelection });
  };

  const goBack = () => {
    if (selection.selectedCampusId !== null && selection.selectedTargetId === null) {
      setSelection((current) => ({
        ...current,
        selectedCampusId: null,
        selectedCampusName: '',
        selectedTargetId: null,
        selectedTargetName: '',
      }));
      setTargetSearchQuery('');
      return;
    }

    navigate(-1);
  };

  return {
    campusQuery: {
      campuses: campusQuery.data ?? [],
      errorMessage: campusQuery.isError ? '캠퍼스 목록을 불러오지 못했어요.' : '',
      isError: campusQuery.isError,
      isLoading: campusQuery.isLoading,
      onRetry: () => {
        void campusQuery.refetch();
      },
    },
    targetQuery: {
      errorMessage: targetQuery.isError ? '대상 목록을 불러오지 못했어요.' : '',
      isError: targetQuery.isError,
      isLoading: targetQuery.isLoading,
      onRetry: () => {
        void targetQuery.refetch();
      },
      targets: filteredTargets,
    },
    selection,
    selectedPlanTypeLabel,
    targetKindLabel,
    targetSearchQuery,
    typeOptions: academicPlanTypeOptions,
    isNextEnabled,
    onBack: goBack,
    onNext: () => undefined,
    onSelectCampus: selectCampus,
    onSelectPlanType: selectPlanType,
    onSelectTarget: selectTarget,
    onTargetSearchQueryChange: setTargetSearchQuery,
  };
}
