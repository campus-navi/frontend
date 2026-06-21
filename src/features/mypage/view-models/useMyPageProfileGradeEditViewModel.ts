import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useMyPageSummary } from '@/features/mypage/hooks/useMyPageSummary';
import { useUpdateGrade } from '@/features/mypage/hooks/useUpdateGrade';

export type ProfileEditGrade = 1 | 2 | 3 | 4;

function normalizeGrade(grade: number): ProfileEditGrade {
  if (grade === 2 || grade === 3) {
    return grade;
  }

  return grade >= 4 ? 4 : 1;
}

export function useMyPageProfileGradeEditViewModel() {
  const navigate = useNavigate();
  const { data: summary, isError, isLoading } = useMyPageSummary();
  const updateGrade = useUpdateGrade();
  const isInitializedRef = useRef(false);
  const isSubmittingRef = useRef(false);
  const [originalGrade, setOriginalGrade] = useState<ProfileEditGrade | null>(null);
  const [grade, setGrade] = useState<ProfileEditGrade | null>(null);

  useEffect(() => {
    if (!summary || isInitializedRef.current) {
      return;
    }

    const initialGrade = normalizeGrade(summary.grade);
    isInitializedRef.current = true;
    setOriginalGrade(initialGrade);
    setGrade(initialGrade);
  }, [summary]);

  const canSubmit =
    grade !== null &&
    grade !== originalGrade &&
    !updateGrade.isPending;
  const errorMessage = updateGrade.isError
    ? '학년 수정에 실패했습니다. 다시 시도해주세요.'
    : null;

  const handleSelect = (nextGrade: ProfileEditGrade) => {
    if (updateGrade.isError) {
      updateGrade.reset();
    }

    setGrade(nextGrade);
  };

  const handleSubmit = async () => {
    if (!canSubmit || grade === null || isSubmittingRef.current) {
      return;
    }

    isSubmittingRef.current = true;

    try {
      await updateGrade.mutateAsync({ grade });
      navigate('/mypage/profile/edit', { replace: true });
    } catch {
      // Mutation state renders the fixed user-facing error.
    } finally {
      isSubmittingRef.current = false;
    }
  };

  return {
    canSubmit,
    errorMessage,
    grade,
    isLoading,
    loadErrorMessage: isError ? '프로필 정보를 불러오지 못했습니다.' : null,
    onClose: () => navigate('/mypage/profile/edit'),
    onSelect: handleSelect,
    onSubmit: handleSubmit,
    submitting: updateGrade.isPending,
  };
}
