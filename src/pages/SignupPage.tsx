import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { isApiError } from '@/api';
import { AlertModal } from '@/components/ui/AlertModal';
import { CtaButton } from '@/components/ui/CtaButton';
import { SignupHeader } from '@/features/signup/components/SignupHeader';
import { getEmailVerificationErrorModal } from '@/features/signup/emailVerification';
import { useSignupFlow } from '@/features/signup/hooks/useSignupFlow';
import { useSignupSubmit } from '@/features/signup/hooks/useSignupSubmit';
import { useSignupFlowStore } from '@/features/signup/store/signupFlowStore';
import { AdmissionYearStep } from '@/features/signup/steps/AdmissionYearStep';
import { DepartmentStep } from '@/features/signup/steps/DepartmentStep';
import { EmailVerificationStep } from '@/features/signup/steps/EmailVerificationStep';
import { GradeStep } from '@/features/signup/steps/GradeStep';
import { NicknameStep } from '@/features/signup/steps/NicknameStep';
import { UniversityStep } from '@/features/signup/steps/UniversityStep';
import { AccountStep } from '@/features/signup/steps/AccountStep';

function getKeyboardInset() {
  if (typeof window === 'undefined' || !window.visualViewport) {
    return 0;
  }

  const viewport = window.visualViewport;
  return Math.max(0, window.innerHeight - viewport.height);
}

function useKeyboardInset() {
  const [keyboardInset, setKeyboardInset] = useState(0);

  useEffect(() => {
    const viewport = window.visualViewport;

    if (!viewport) {
      return;
    }

    let animationFrame = 0;
    const updateKeyboardInset = () => {
      window.cancelAnimationFrame(animationFrame);
      animationFrame = window.requestAnimationFrame(() => {
        setKeyboardInset(getKeyboardInset());
      });
    };

    updateKeyboardInset();
    viewport.addEventListener('resize', updateKeyboardInset);
    window.addEventListener('orientationchange', updateKeyboardInset);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      viewport.removeEventListener('resize', updateKeyboardInset);
      window.removeEventListener('orientationchange', updateKeyboardInset);
    };
  }, []);

  return keyboardInset;
}

export default function SignupPage() {
  const navigate = useNavigate();
  const [isEmailVerificationSuccessModalOpen, setIsEmailVerificationSuccessModalOpen] = useState(false);
  const keyboardInset = useKeyboardInset();
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
    isCurrentStepValid,
    progressValue,
    admissionYears,
    universitySearch,
    departmentSearch,
    isDepartmentSearchVisible,
    isUniversitySearchVisible,
    actions,
  } = useSignupFlow();
  const universitySearchError = universitySearch.isError ? universitySearch.error : null;
  const isUniversityServerError = isApiError(universitySearchError) && universitySearchError.status === 500;
  const emailVerificationErrorModal = getEmailVerificationErrorModal(state.emailVerification);
  const isKeyboardCtaStep = state.step === 5;
  const isKeyboardOpen = isKeyboardCtaStep && keyboardInset > 0;
  const ctaContainerSpacingClassName = isKeyboardOpen
    ? 'px-0 pb-0 pt-0'
    : 'px-5 pb-[max(24px,env(safe-area-inset-bottom))] pt-2';
  const ctaButtonClassName = isKeyboardOpen ? '!rounded-none' : '';
  const wasEmailVerifiedRef = useRef(state.emailVerification.verifiedToken.isVerified);
  const signupSubmit = useSignupSubmit({
    emailDomain,
    emailVerification: state.emailVerification,
    form: state.form,
    onResetFlow: actions.resetFlow,
    onReturnToEmailVerificationStep: actions.returnToEmailVerificationStep,
  });

  useEffect(() => {
    const isVerified = state.emailVerification.verifiedToken.isVerified;

    if (state.step === 1 && !wasEmailVerifiedRef.current && isVerified) {
      setIsEmailVerificationSuccessModalOpen(true);
    }

    wasEmailVerifiedRef.current = isVerified;
  }, [state.emailVerification.verifiedToken.isVerified, state.step]);

  const handleEmailVerificationErrorConfirm = () => {
    if (!emailVerificationErrorModal) {
      return;
    }

    if (emailVerificationErrorModal.scope === 'send' && state.emailVerification.send.errorReason === 'ip_blocked') {
      actions.clearEmailVerificationSendError();
      navigate('/');
      return;
    }

    if (emailVerificationErrorModal.scope === 'send') {
      actions.clearEmailVerificationSendError();
      return;
    }

    actions.clearEmailVerificationVerifyError();
  };

  const handleEmailVerificationSuccessConfirm = () => {
    setIsEmailVerificationSuccessModalOpen(false);
    actions.nextStep();
  };

  useEffect(() => {
    return () => {
      useSignupFlowStore.getState().actions.resetFlow();
    };
  }, []);

  const handleBack = () => {
    if (signupSubmit.isPending) {
      return;
    }

    if (state.step === 0) {
      navigate(-1);
      return;
    }

    if (state.step === 2) {
      actions.returnToEmailVerificationStep();
      return;
    }

    if (state.step === 1) {
      actions.returnToUniversityStep();
      return;
    }

    actions.previousStep();
  };

  return (
    <main className="h-[100svh] overflow-hidden bg-white">
      <AlertModal
        isOpen={isUniversityServerError}
        title="에러"
        description="서버 오류가 발생했습니다. 처음 화면으로 이동해주세요."
        onConfirm={() => navigate('/')}
      />
      <AlertModal
        isOpen={Boolean(emailVerificationErrorModal)}
        placement="bottom-sheet"
        title={emailVerificationErrorModal?.title ?? '에러'}
        description={emailVerificationErrorModal?.description ?? ''}
        confirmLabel={emailVerificationErrorModal?.confirmLabel}
        onConfirm={handleEmailVerificationErrorConfirm}
      />
      <AlertModal
        isOpen={isEmailVerificationSuccessModalOpen}
        title="인증 성공"
        description="인증이 완료되었습니다."
        isConfirmCta
        onConfirm={handleEmailVerificationSuccessConfirm}
      />
      <AlertModal
        isOpen={Boolean(signupSubmit.modal)}
        title={signupSubmit.modal?.title ?? '에러'}
        description={signupSubmit.modal?.description ?? ''}
        onConfirm={signupSubmit.closeModal}
      />

      <div className="mx-auto flex h-[100svh] w-full max-w-[393px] flex-col overflow-hidden bg-white">
        <SignupHeader progressValue={progressValue} onBack={handleBack} />

        <section
          className={[
            'relative flex min-h-0 flex-1 flex-col overflow-hidden px-5',
            isKeyboardCtaStep ? '' : 'pb-[max(24px,env(safe-area-inset-bottom))]',
            'pt-12',
          ].join(' ')}
        >
          <div className="min-h-0 flex-1 overflow-hidden">
            {state.step === 0 ? (
              <UniversityStep
                isLoading={universitySearch.isLoading}
                isResultsVisible={isUniversitySearchVisible}
                query={state.universityQuery}
                selectedUniversity={state.form.selectedUniversity}
                suggestions={filteredUniversities}
                errorMessage={universitySearch.isError && !isUniversityServerError ? universitySearch.error.message : undefined}
                onChange={actions.updateUniversityQuery}
                onClear={actions.clearUniversityQuery}
                onRetry={() => void universitySearch.refetch()}
                onSelect={actions.selectUniversity}
              />
            ) : null}

            {state.step === 1 ? (
              <EmailVerificationStep
                emailLocalPart={state.form.emailLocalPart}
                emailDomain={emailDomain}
                isCodeSent={emailVerification.ui.isCodeSent}
                isSendEnabled={emailVerification.ui.canSend}
                isSendPending={emailVerification.ui.isSending}
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
            ) : null}

            {state.step === 2 ? (
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
                onSelect={(department) => actions.selectDepartment({ id: department.id, name: department.label })}
              />
            ) : null}

            {state.step === 3 ? (
              <AdmissionYearStep
                selectedYear={state.form.admissionYear}
                years={admissionYears}
                onSelect={actions.selectAdmissionYear}
              />
            ) : null}

            {state.step === 4 ? (
              <GradeStep
                selectedGrade={state.form.grade}
                onSelect={actions.selectGrade}
              />
            ) : null}

            {state.step === 5 ? (
              <AccountStep
                helperText={usernameAvailability.helperText}
                helperTone={usernameAvailability.helperTone}
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
            ) : null}

            {state.step === 6 ? (
              <NicknameStep
                nickname={state.form.nickname}
                helperText={nicknameValidation.helperText}
                helperTone={nicknameValidation.helperTone}
                onChange={actions.updateNickname}
              />
            ) : null}

          </div>

          {isKeyboardCtaStep ? (
            <div aria-hidden="true" className="mt-auto h-[calc(88px+max(24px,env(safe-area-inset-bottom)))] shrink-0" />
          ) : null}

          {isKeyboardCtaStep ? (
            <div
              className={[
                'fixed left-1/2 z-20 w-full max-w-[393px] -translate-x-1/2 bg-white transition-[bottom] duration-200 ease-out',
                ctaContainerSpacingClassName,
              ].join(' ')}
              style={{ bottom: `${keyboardInset}px` }}
            >
              <CtaButton
                className={ctaButtonClassName}
                disabled={!isCurrentStepValid || signupSubmit.isPending}
                onClick={actions.nextStep}
              >
                다음
              </CtaButton>
            </div>
          ) : state.step !== 1 ? (
            <div className="mt-auto pt-8">
              <CtaButton
                disabled={!isCurrentStepValid || signupSubmit.isPending}
                onClick={state.step === 6 ? () => void signupSubmit.submit() : actions.nextStep}
              >
                {state.step === 6 ? (signupSubmit.isPending ? '회원가입 중...' : '회원가입 완료') : '다음'}
              </CtaButton>
            </div>
          ) : null}
        </section>
      </div>
    </main>
  );
}
