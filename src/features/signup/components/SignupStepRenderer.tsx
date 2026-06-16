import type { useSignupFlow } from '@/features/signup/hooks/useSignupFlow';
import { AdmissionYearStep } from '@/features/signup/steps/AdmissionYearStep';
import { DepartmentStep } from '@/features/signup/steps/DepartmentStep';
import { EmailVerificationStep } from '@/features/signup/steps/EmailVerificationStep';
import { GradeStep } from '@/features/signup/steps/GradeStep';
import { NicknameStep } from '@/features/signup/steps/NicknameStep';
import { PersonalInfoStep } from '@/features/signup/steps/PersonalInfoStep';
import { UniversityStep } from '@/features/signup/steps/UniversityStep';
import { AccountStep } from '@/features/signup/steps/AccountStep';
import { SIGNUP_STEP } from '@/features/signup/types';

type SignupFlow = ReturnType<typeof useSignupFlow>;

type SignupStepRendererProps = {
  flow: SignupFlow;
  isUniversityServerError: boolean;
};

export function SignupStepRenderer({ flow, isUniversityServerError }: SignupStepRendererProps) {
  const {
    state,
    emailDomain,
    emailVerification,
    nicknameValidation,
    usernameAvailability,
    passwordValidation,
    shouldShowPasswordField,
    shouldShowPasswordConfirmField,
    filteredUniversities,
    filteredDepartments,
    admissionYears,
    universitySearch,
    departmentSearch,
    isDepartmentSearchVisible,
    isUniversitySearchVisible,
    actions,
  } = flow;

  if (state.step === SIGNUP_STEP.UNIVERSITY) {
    return (
      <UniversityStep
        isLoading={universitySearch.isLoading}
        isResultsVisible={isUniversitySearchVisible}
        query={state.universityQuery}
        selectedUniversity={state.form.selectedUniversity}
        suggestions={filteredUniversities}
        errorMessage={
          universitySearch.isError && !isUniversityServerError
            ? universitySearch.error.message
            : undefined
        }
        onChange={actions.updateUniversityQuery}
        onClear={actions.clearUniversityQuery}
        onRetry={() => void universitySearch.refetch()}
        onSelect={actions.selectUniversity}
      />
    );
  }

  if (state.step === SIGNUP_STEP.EMAIL_VERIFICATION) {
    return (
      <EmailVerificationStep
        emailLocalPart={state.form.emailLocalPart}
        emailDomain={emailDomain}
        isCodeSent={emailVerification.ui.isCodeSent}
        isSendEnabled={emailVerification.ui.canSend}
        isSendPending={emailVerification.ui.isSending}
        isVerifyPending={emailVerification.ui.isVerifying}
        isVerifyButtonEnabled={emailVerification.ui.canVerify}
        isVerificationCodeReadOnly={emailVerification.ui.isVerificationCodeReadOnly}
        codeHelperMessage={emailVerification.ui.codeHelperMessage}
        emailHelperMessage={emailVerification.ui.emailHelperMessage}
        sendButtonLabel={emailVerification.ui.sendButtonLabel}
        verificationTimerLabel={emailVerification.ui.verificationTimerLabel}
        verification={state.emailVerification}
        verifyButtonLabel={emailVerification.ui.verifyButtonLabel}
        onEmailChange={actions.updateEmailLocalPart}
        onVerificationCodeChange={actions.updateVerificationCode}
        onSendVerification={actions.sendVerification}
        onSubmitVerification={actions.submitVerification}
      />
    );
  }

  if (state.step === SIGNUP_STEP.DEPARTMENT) {
    return (
      <DepartmentStep
        errorMessage={departmentSearch.isError ? departmentSearch.error.message : undefined}
        isLoading={departmentSearch.isLoading}
        isResultsVisible={isDepartmentSearchVisible}
        query={state.departmentQuery}
        selectedDepartmentId={state.form.departmentId}
        suggestions={filteredDepartments}
        onChange={actions.updateDepartmentQuery}
        onClear={actions.clearDepartmentQuery}
        onRetry={() => void departmentSearch.refetch()}
        onSelect={(department) =>
          actions.selectDepartment({ id: department.id, name: department.label })
        }
      />
    );
  }

  if (state.step === SIGNUP_STEP.ADMISSION_YEAR) {
    return (
      <AdmissionYearStep
        selectedYear={state.form.admissionYear}
        years={admissionYears}
        onSelect={actions.selectAdmissionYear}
      />
    );
  }

  if (state.step === SIGNUP_STEP.GRADE) {
    return <GradeStep selectedGrade={state.form.grade} onSelect={actions.selectGrade} />;
  }

  if (state.step === SIGNUP_STEP.PERSONAL_INFO) {
    return (
      <PersonalInfoStep
        name={state.form.name}
        studentNumber={state.form.studentNumber}
        onNameChange={actions.updateName}
        onStudentNumberChange={actions.updateStudentNumber}
      />
    );
  }

  if (state.step === SIGNUP_STEP.ACCOUNT) {
    return (
      <AccountStep
        helperText={usernameAvailability.helperText}
        helperTone={usernameAvailability.helperTone}
        isUsernameChecking={usernameAvailability.availability.status === 'checking'}
        password={state.form.password}
        passwordConfirm={state.form.passwordConfirm}
        passwordHelperText={passwordValidation.passwordHelperText}
        passwordHelperTone={passwordValidation.passwordHelperTone}
        shouldShowPasswordField={shouldShowPasswordField}
        shouldShowPasswordConfirmField={shouldShowPasswordConfirmField}
        confirmHelperText={passwordValidation.confirmHelperText}
        confirmHelperTone={passwordValidation.confirmHelperTone}
        username={state.form.username}
        onChange={actions.updateUsername}
        onPasswordChange={actions.updatePassword}
        onPasswordConfirmChange={actions.updatePasswordConfirm}
      />
    );
  }

  if (state.step === SIGNUP_STEP.NICKNAME) {
    return (
      <NicknameStep
        nickname={state.form.nickname}
        helperText={nicknameValidation.helperText}
        helperTone={nicknameValidation.helperTone}
        isNicknameChecking={nicknameValidation.availability.status === 'checking'}
        onChange={actions.updateNickname}
      />
    );
  }

  return null;
}
