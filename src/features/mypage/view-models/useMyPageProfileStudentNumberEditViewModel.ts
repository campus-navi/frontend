import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useMyPageSummary } from '@/features/mypage/hooks/useMyPageSummary';
import { useUpdateStudentNumber } from '@/features/mypage/hooks/useUpdateStudentNumber';
import { defaultAdmissionYear } from '@/features/signup/constants';
import { isSignupStudentNumberValid } from '@/features/signup/utils';

const STUDENT_NUMBER_MAX_LENGTH = 10;
type StudentNumberEditStep = 'admission-year' | 'student-number';

export function useMyPageProfileStudentNumberEditViewModel() {
  const navigate = useNavigate();
  const { data: summary, isError, isLoading } = useMyPageSummary();
  const updateStudentNumber = useUpdateStudentNumber();
  const isInitializedRef = useRef(false);
  const isSubmittingRef = useRef(false);
  const [step, setStep] = useState<StudentNumberEditStep>('admission-year');
  const [originalAdmissionYear, setOriginalAdmissionYear] = useState(defaultAdmissionYear);
  const [admissionYear, setAdmissionYear] = useState(defaultAdmissionYear);
  const [originalStudentNumber, setOriginalStudentNumber] = useState('');
  const [studentNumber, setStudentNumber] = useState('');

  useEffect(() => {
    if (!summary || isInitializedRef.current) {
      return;
    }

    isInitializedRef.current = true;
    setOriginalAdmissionYear(summary.admissionYear);
    setAdmissionYear(summary.admissionYear);
    setOriginalStudentNumber(summary.studentNumber);
    setStudentNumber(summary.studentNumber);
  }, [summary]);

  const isChanged =
    admissionYear !== originalAdmissionYear ||
    studentNumber !== originalStudentNumber;
  const isValid = isSignupStudentNumberValid(studentNumber);
  const canSubmit =
    isInitializedRef.current &&
    Boolean(studentNumber) &&
    isChanged &&
    isValid &&
    !updateStudentNumber.isPending;
  const helperText = !studentNumber
    ? '학번을 입력해주세요.'
    : !isValid
      ? '학번은 6~10자리 숫자로 입력해주세요.'
      : '학번은 6~10자 이내로 입력해주세요.';
  const submitErrorMessage = updateStudentNumber.isError
    ? '학번 수정에 실패했습니다. 다시 시도해주세요.'
    : null;

  const handleChange = (value: string) => {
    if (updateStudentNumber.isError) {
      updateStudentNumber.reset();
    }

    setStudentNumber(value.replace(/\D/g, '').slice(0, STUDENT_NUMBER_MAX_LENGTH));
  };

  const handleAdmissionYearChange = (year: number) => {
    if (updateStudentNumber.isError) {
      updateStudentNumber.reset();
    }

    setAdmissionYear(year);
  };

  const handleSubmit = async () => {
    if (step === 'admission-year') {
      setStep('student-number');
      return;
    }

    if (!canSubmit || isSubmittingRef.current) {
      return;
    }

    isSubmittingRef.current = true;

    try {
      await updateStudentNumber.mutateAsync({
        admissionYear,
        studentNumber,
      });
      navigate('/mypage/profile/edit', { replace: true });
    } catch {
      // Mutation state renders the fixed user-facing error.
    } finally {
      isSubmittingRef.current = false;
    }
  };

  return {
    admissionYear,
    canSubmit,
    helperText: submitErrorMessage ?? helperText,
    helperTone:
      submitErrorMessage || !studentNumber || !isValid ? 'error' : 'default',
    isLoading,
    loadErrorMessage: isError ? '프로필 정보를 불러오지 못했습니다.' : null,
    onAdmissionYearChange: handleAdmissionYearChange,
    onBack: () => {
      if (step === 'student-number') {
        setStep('admission-year');
        return;
      }

      navigate('/mypage/profile/edit');
    },
    onChange: handleChange,
    onSubmit: handleSubmit,
    step,
    studentNumber,
    submitting: updateStudentNumber.isPending,
  } as const;
}
