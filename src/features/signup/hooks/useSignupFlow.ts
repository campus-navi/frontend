import { useDeferredValue, useMemo } from 'react';

import { admissionYears } from '@/features/signup/constants';
import { useDepartmentSearch } from '@/features/signup/hooks/useDepartmentSearch';
import { useEmailVerification } from '@/features/signup/hooks/useEmailVerification';
import { useNicknameValidation } from '@/features/signup/hooks/useNicknameValidation';
import { usePasswordValidation } from '@/features/signup/hooks/usePasswordValidation';
import { useDebouncedValue } from '@/features/signup/hooks/useDebouncedValue';
import { useUsernameAvailability } from '@/features/signup/hooks/useUsernameAvailability';
import { useUniversitySearch } from '@/features/signup/hooks/useUniversitySearch';
import { useSignupFlowStore } from '@/features/signup/store/signupFlowStore';
import { totalSignupSteps } from '@/features/signup/types';
import {
  getSuggestions,
  isSignupStepValid,
  matchesUniversityName,
  shouldShowSearchResults,
  shouldShowUniversitySearchResults,
} from '@/features/signup/utils';

export function useSignupFlow() {
  const { actions: storeActions, ...state } = useSignupFlowStore();
  const deferredUniversityQuery = useDeferredValue(state.universityQuery);
  const debouncedUniversityQuery = useDebouncedValue(deferredUniversityQuery, 180);
  const deferredDepartmentQuery = useDeferredValue(state.departmentQuery);
  const debouncedDepartmentQuery = useDebouncedValue(deferredDepartmentQuery, 180);
  const universitySearch = useUniversitySearch();
  const departmentSearch = useDepartmentSearch(state.form.selectedUniversity?.campusId);
  const emailDomain = state.form.selectedUniversity?.emailDomain ?? 'school.ac.kr';
  const emailVerification = useEmailVerification(emailDomain);
  const usernameAvailability = useUsernameAvailability(state.form.username);
  const nicknameValidation = useNicknameValidation(state.form.nickname);
  const passwordValidation = usePasswordValidation(state.form.password, state.form.passwordConfirm);
  const isUniversitySelected =
    state.form.selectedUniversity !== null && state.form.selectedUniversity.universityName === state.universityQuery;
  const isDepartmentSelected = state.form.departmentId !== null && state.form.department === state.departmentQuery;
  const isDepartmentSearchVisible = shouldShowSearchResults(debouncedDepartmentQuery) && !isDepartmentSelected;
  const isUniversitySearchVisible = shouldShowUniversitySearchResults(debouncedUniversityQuery) && !isUniversitySelected;
  const filteredUniversities = useMemo(() => {
    if (!isUniversitySearchVisible) {
      return [];
    }

    return (universitySearch.data ?? [])
      .filter((university) => matchesUniversityName(university.universityName, debouncedUniversityQuery))
      .slice(0, 20);
  }, [debouncedUniversityQuery, isUniversitySearchVisible, universitySearch.data]);
  const filteredDepartments = useMemo(
    () => {
      if (isDepartmentSelected) {
        return [];
      }

      if (!isDepartmentSearchVisible) {
        return [];
      }

      const departments = departmentSearch.data ?? [];
      const matchedDepartments = getSuggestions(departments, debouncedDepartmentQuery, (department) => department.name);

      return matchedDepartments.map((department) => ({
        id: department.id,
        label: department.name,
      }));
    },
    [debouncedDepartmentQuery, departmentSearch.data, isDepartmentSearchVisible, isDepartmentSelected],
  );
  const isCurrentStepValid =
    state.step === 5
      ? usernameAvailability.validation.isValid &&
        usernameAvailability.isAvailable &&
        passwordValidation.passwordValidation.isValid &&
        passwordValidation.isConfirmFilled &&
        passwordValidation.isPasswordMatched
      : state.step === 6
        ? nicknameValidation.validation.isValid && nicknameValidation.isAvailable
      : isSignupStepValid(state.step, state.form, state.emailVerification);
  const progressValue = (Math.min(state.step, totalSignupSteps - 1) + 1) / totalSignupSteps;

  return {
    state,
    emailDomain,
    emailVerification,
    nicknameValidation,
    usernameAvailability,
    passwordValidation,
    filteredUniversities,
    filteredDepartments,
    isCurrentStepValid,
    progressValue,
    admissionYears,
    universitySearch,
    departmentSearch,
    isDepartmentSearchVisible,
    isUniversitySearchVisible,
    actions: {
      previousStep: storeActions.previousStep,
      returnToEmailVerificationStep: storeActions.returnToEmailVerificationStep,
      returnToUniversityStep: storeActions.returnToUniversityStep,
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
      selectGrade: storeActions.selectGrade,
      updateUsername: storeActions.updateUsername,
      updatePassword: storeActions.updatePassword,
      updatePasswordConfirm: storeActions.updatePasswordConfirm,
      updateNickname: storeActions.updateNickname,
    },
  };
}
