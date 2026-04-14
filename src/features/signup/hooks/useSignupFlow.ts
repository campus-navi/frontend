import { useDeferredValue, useMemo } from 'react';

import { admissionYears, departments, verificationCodeAnswer, verificationDurationSeconds } from '@/features/signup/data';
import { useDebouncedValue } from '@/features/signup/hooks/useDebouncedValue';
import { useUniversitySearch } from '@/features/signup/hooks/useUniversitySearch';
import { useSignupFlowStore } from '@/features/signup/store/signupFlowStore';
import { getSuggestions, isSignupStepValid, matchesUniversityName, shouldShowUniversitySearchResults } from '@/features/signup/utils';

import { useVerificationTimer } from './useVerificationTimer';

export function useSignupFlow() {
  const { actions: storeActions, ...state } = useSignupFlowStore();
  const deferredUniversityQuery = useDeferredValue(state.universityQuery);
  const debouncedUniversityQuery = useDebouncedValue(deferredUniversityQuery, 180);
  const deferredDepartmentQuery = useDeferredValue(state.departmentQuery);
  const verificationTimer = useVerificationTimer(verificationDurationSeconds);
  const universitySearch = useUniversitySearch();

  const emailDomain = state.form.selectedUniversity?.emailDomain ?? 'school.ac.kr';
  const filteredUniversities = useMemo(() => {
    if (!shouldShowUniversitySearchResults(debouncedUniversityQuery)) {
      return [];
    }

    return (universitySearch.data ?? [])
      .filter((university) => matchesUniversityName(university.universityName, debouncedUniversityQuery))
      .slice(0, 20);
  }, [debouncedUniversityQuery, universitySearch.data]);
  const filteredDepartments = useMemo(
    () =>
      state.form.department && state.form.department === state.departmentQuery
        ? []
        : getSuggestions(departments, deferredDepartmentQuery),
    [deferredDepartmentQuery, state.form.department, state.departmentQuery],
  );
  const isCurrentStepValid = isSignupStepValid(state.step, state.form);
  const progressValue = (Math.min(state.step, 6) + 1) / 7;

  return {
    state,
    emailDomain,
    filteredUniversities,
    filteredDepartments,
    isCurrentStepValid,
    progressValue,
    admissionYears,
    timeLeft: verificationTimer.timeLeft,
    universitySearch,
    isUniversitySearchVisible: shouldShowUniversitySearchResults(debouncedUniversityQuery),
    actions: {
      previousStep: storeActions.previousStep,
      nextStep: () => {
        if (!isCurrentStepValid) return;
        storeActions.nextStep();
      },
      updateUniversityQuery: storeActions.updateUniversityQuery,
      resetFlow: storeActions.resetFlow,
      selectUniversity: storeActions.selectUniversity,
      clearUniversityQuery: storeActions.clearUniversityQuery,
      updateEmailLocalPart: storeActions.updateEmailLocalPart,
      sendVerification: () => {
        storeActions.sendVerification();
        verificationTimer.start();
      },
      updateVerificationCode: storeActions.updateVerificationCode,
      submitVerification: () => {
        if (verificationTimer.timeLeft <= 0) {
          storeActions.verificationFailure('인증 시간이 만료되었습니다. 다시 전송해주세요.');
          return;
        }

        if (state.verification.code === verificationCodeAnswer) {
          storeActions.verificationSuccess();
          verificationTimer.reset();
          return;
        }

        storeActions.verificationFailure('인증번호가 올바르지 않습니다.');
      },
      updateDepartmentQuery: storeActions.updateDepartmentQuery,
      selectDepartment: storeActions.selectDepartment,
      clearDepartmentQuery: storeActions.clearDepartmentQuery,
      selectAdmissionYear: storeActions.selectAdmissionYear,
      updateUsername: storeActions.updateUsername,
      updatePassword: storeActions.updatePassword,
      updatePasswordConfirm: storeActions.updatePasswordConfirm,
      updateNickname: storeActions.updateNickname,
    },
  };
}
