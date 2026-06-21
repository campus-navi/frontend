import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { normalizeApiError } from '@/api';
import { useMyPageSummary } from '@/features/mypage/hooks/useMyPageSummary';
import { useProfileNicknameValidation } from '@/features/mypage/hooks/useProfileNicknameValidation';
import { useUpdateProfile } from '@/features/mypage/hooks/useUpdateProfile';
import { validateProfileStudentNumber } from '@/features/mypage/utils/profileValidation';

export type ProfileGrade = 1 | 2 | 3 | 4;

type InitialProfile = {
  grade: ProfileGrade;
  nickname: string;
  studentNumber: string;
};

const EMPTY_PROFILE: InitialProfile = {
  grade: 1,
  nickname: '',
  studentNumber: '',
};

function normalizeGrade(grade: number): ProfileGrade {
  if (grade === 2 || grade === 3) {
    return grade;
  }

  if (grade >= 4) {
    return 4;
  }

  return 1;
}

export function useMyPageProfileEditViewModel() {
  const navigate = useNavigate();
  const { data: summary, isError, isLoading } = useMyPageSummary();
  const updateProfile = useUpdateProfile();
  const isInitializedRef = useRef(false);
  const isSubmittingRef = useRef(false);
  const [initialProfile, setInitialProfile] = useState<InitialProfile>(EMPTY_PROFILE);
  const [nickname, setNickname] = useState('');
  const [studentNumber, setStudentNumber] = useState('');
  const [grade, setGrade] = useState<ProfileGrade>(1);
  const nicknameValidation = useProfileNicknameValidation(
    nickname,
    initialProfile.nickname,
  );
  const studentNumberValidation = useMemo(
    () => validateProfileStudentNumber(studentNumber),
    [studentNumber],
  );

  useEffect(() => {
    if (!summary || isInitializedRef.current) {
      return;
    }

    const profile = {
      grade: normalizeGrade(summary.grade),
      nickname: summary.nickname,
      studentNumber: summary.studentNumber,
    };

    isInitializedRef.current = true;
    setInitialProfile(profile);
    setNickname(profile.nickname);
    setStudentNumber(profile.studentNumber);
    setGrade(profile.grade);
  }, [summary]);

  const hasChanges =
    nickname !== initialProfile.nickname ||
    studentNumber !== initialProfile.studentNumber ||
    grade !== initialProfile.grade;
  const canSubmit =
    isInitializedRef.current &&
    hasChanges &&
    nicknameValidation.validation.isValid &&
    nicknameValidation.isAvailable &&
    studentNumberValidation.isValid &&
    !updateProfile.isPending;
  const submitErrorMessage = updateProfile.isError
    ? normalizeApiError(updateProfile.error).message ||
      '프로필 저장에 실패했습니다. 다시 시도해주세요.'
    : null;

  const handleSubmit = async () => {
    if (!canSubmit || isSubmittingRef.current) {
      return;
    }

    isSubmittingRef.current = true;

    try {
      await updateProfile.mutateAsync({
        grade,
        nickname,
        studentNumber,
      });
      navigate('/mypage', { replace: true });
    } catch {
      // Mutation state renders the normalized error message.
    } finally {
      isSubmittingRef.current = false;
    }
  };

  return {
    canSubmit,
    department: summary?.departments[0] ?? '',
    email: summary?.email ?? '',
    grade,
    interestCount: summary?.interestCount ?? 0,
    isLoading,
    loadErrorMessage: isError ? '프로필 정보를 불러오지 못했습니다.' : null,
    nickname,
    nicknameHelperText: nicknameValidation.helperText,
    nicknameHelperTone: nicknameValidation.helperTone,
    onGradeChange: setGrade,
    onGradeClick: () => navigate('/mypage/profile/edit/grade'),
    onNicknameClick: () => navigate('/mypage/profile/edit/nickname'),
    onNicknameChange: setNickname,
    onStudentNumberClick: () => navigate('/mypage/profile/edit/student-number'),
    onStudentNumberChange: (value: string) =>
      setStudentNumber(value.replace(/\D/g, '').slice(0, 10)),
    onSubmit: handleSubmit,
    studentNumber,
    studentNumberHelperText:
      studentNumber === initialProfile.studentNumber
        ? undefined
        : studentNumberValidation.message,
    submitErrorMessage,
    submitting: updateProfile.isPending,
  };
}
