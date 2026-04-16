import { useDeferredValue, useMemo } from 'react';

import { admissionYears, departments } from '@/features/signup/constants';
import { useEmailVerification } from '@/features/signup/hooks/useEmailVerification';
import { useDebouncedValue } from '@/features/signup/hooks/useDebouncedValue';
import { useUniversitySearch } from '@/features/signup/hooks/useUniversitySearch';
import { useSignupFlowStore } from '@/features/signup/store/signupFlowStore';
import { getSuggestions, isSignupStepValid, matchesUniversityName, shouldShowUniversitySearchResults } from '@/features/signup/utils';

export function useSignupFlow() {
  const { actions: storeActions, ...state } = useSignupFlowStore();
  const deferredUniversityQuery = useDeferredValue(state.universityQuery);
  const debouncedUniversityQuery = useDebouncedValue(deferredUniversityQuery, 180);
  const deferredDepartmentQuery = useDeferredValue(state.departmentQuery);
  const universitySearch = useUniversitySearch();
  const emailDomain = state.form.selectedUniversity?.emailDomain ?? 'school.ac.kr';
  const emailVerification = useEmailVerification(emailDomain);
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
  const isCurrentStepValid = isSignupStepValid(state.step, state.form, state.emailVerification);
  const progressValue = (Math.min(state.step, 6) + 1) / 7;

  return {
    state,
    emailDomain,
    emailVerification,
    filteredUniversities,
    filteredDepartments,
    isCurrentStepValid,
    progressValue,
    admissionYears,
    universitySearch,
    isUniversitySearchVisible: shouldShowUniversitySearchResults(debouncedUniversityQuery),
    actions: {
      previousStep: storeActions.previousStep,
      returnToEmailVerificationStep: storeActions.returnToEmailVerificationStep,
      nextStep: () => {
        if (!isCurrentStepValid) return;
        storeActions.nextStep();
      },
      updateUniversityQuery: storeActions.updateUniversityQuery,
      resetFlow: storeActions.resetFlow,
      selectUniversity: storeActions.selectUniversity,
      clearUniversityQuery: storeActions.clearUniversityQuery,
      updateEmailLocalPart: storeActions.updateEmailLocalPart,
      clearEmailVerificationSendError: storeActions.clearEmailVerificationSendError,
      clearEmailVerificationVerifyError: storeActions.clearEmailVerificationVerifyError,
      sendVerification: () => void emailVerification.sendCode(),
      updateVerificationCode: storeActions.updateVerificationCode,
      submitVerification: () => void emailVerification.verifyCode(),
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
