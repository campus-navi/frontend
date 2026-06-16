import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { isApiError } from '@/api';
import { AlertModal } from '@/components/ui/AlertModal';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { CtaButton } from '@/components/ui/CtaButton';
import { SignupCtaSection } from '@/features/signup/components/SignupCtaSection';
import { SignupHeader } from '@/features/signup/components/SignupHeader';
import { SignupStepRenderer } from '@/features/signup/components/SignupStepRenderer';
import { SignupTermsAgreementSheet } from '@/features/signup/components/SignupTermsAgreementSheet';
import { getEmailVerificationErrorModal } from '@/features/signup/emailVerification';
import { useKeyboardCtaState } from '@/features/signup/hooks/useKeyboardCtaState';
import { useSignupFlow } from '@/features/signup/hooks/useSignupFlow';
import { useSignupSubmit } from '@/features/signup/hooks/useSignupSubmit';
import { useSignupTermsAgreement } from '@/features/signup/hooks/useSignupTermsAgreement';
import { useSignupFlowStore } from '@/features/signup/store/signupFlowStore';
import { SIGNUP_STEP } from '@/features/signup/types';

const keyboardCtaSteps: readonly number[] = [SIGNUP_STEP.PERSONAL_INFO, SIGNUP_STEP.ACCOUNT];

export function SignupPage() {
  const navigate = useNavigate();
  const [isEmailVerificationSuccessModalOpen, setIsEmailVerificationSuccessModalOpen] =
    useState(false);
  const keyboardCta = useKeyboardCtaState();
  const signupFlow = useSignupFlow();
  const {
    state,
    emailDomain,
    isCurrentStepValid,
    progressValue,
    universitySearch,
    actions,
  } = signupFlow;
  const universitySearchError = universitySearch.isError ? universitySearch.error : null;
  const isUniversityServerError =
    isApiError(universitySearchError) && universitySearchError.status === 500;
  const emailVerificationErrorModal = getEmailVerificationErrorModal(state.emailVerification);
  const isKeyboardCtaStep = keyboardCtaSteps.includes(state.step) && keyboardCta.isSupported;
  const isKeyboardOpen = isKeyboardCtaStep && keyboardCta.isKeyboardOpen;
  const wasEmailVerifiedRef = useRef(state.emailVerification.verifiedToken.isVerified);
  const signupSubmit = useSignupSubmit({
    emailDomain,
    emailVerification: state.emailVerification,
    form: state.form,
    onResetFlow: actions.resetFlow,
    onReturnToEmailVerificationStep: actions.returnToEmailVerificationStep,
  });
  const isPrimaryCtaDisabled = !isCurrentStepValid || signupSubmit.isPending;
  const termsAgreement = useSignupTermsAgreement({
    canOpen: isCurrentStepValid,
    isSubmitting: signupSubmit.isPending,
    onSubmit: () => void signupSubmit.submit(),
  });

  useEffect(() => {
    const isVerified = state.emailVerification.verifiedToken.isVerified;

    if (state.step === SIGNUP_STEP.EMAIL_VERIFICATION && !wasEmailVerifiedRef.current && isVerified) {
      setIsEmailVerificationSuccessModalOpen(true);
    }

    wasEmailVerifiedRef.current = isVerified;
  }, [state.emailVerification.verifiedToken.isVerified, state.step]);

  const handleEmailVerificationErrorConfirm = () => {
    if (!emailVerificationErrorModal) {
      return;
    }

    if (
      emailVerificationErrorModal.scope === 'send' &&
      state.emailVerification.send.errorReason === 'ip_blocked'
    ) {
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
    if (termsAgreement.isOpen) {
      termsAgreement.close();
      return;
    }

    if (signupSubmit.isPending) {
      return;
    }

    if (state.step === SIGNUP_STEP.UNIVERSITY) {
      navigate(-1);
      return;
    }

    if (state.step === SIGNUP_STEP.DEPARTMENT) {
      actions.returnToEmailVerificationStep();
      return;
    }

    if (state.step === SIGNUP_STEP.EMAIL_VERIFICATION) {
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
      <BottomSheet
        isOpen={Boolean(emailVerificationErrorModal)}
        title={emailVerificationErrorModal?.title ?? '에러'}
        footer={
          <CtaButton
            type="button"
            variant="primary"
            state="default"
            size="xlg"
            className="text-[#292B2C]"
            onClick={handleEmailVerificationErrorConfirm}
          >
            {emailVerificationErrorModal?.confirmLabel ?? '확인'}
          </CtaButton>
        }
      >
        <div className="flex h-11 w-full flex-col items-center justify-center px-5">
          <div className="flex w-full justify-center">
            <p className="w-full max-w-[311px] text-center text-[16px] font-medium leading-[140%] text-[#202020]">
              {emailVerificationErrorModal?.description ?? ''}
            </p>
          </div>
        </div>
      </BottomSheet>
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
        confirmLabel={signupSubmit.modal?.type === 'duplicate_restart' ? '홈으로' : undefined}
        isConfirmCta={signupSubmit.modal?.type === 'duplicate_restart'}
        onConfirm={signupSubmit.closeModal}
      />
      <SignupTermsAgreementSheet
        agreedTermIds={termsAgreement.agreedTermIds}
        isOpen={termsAgreement.isOpen}
        isSubmitting={signupSubmit.isPending}
        onClose={termsAgreement.close}
        onSubmit={termsAgreement.submit}
        onToggleAll={termsAgreement.toggleAll}
        onToggleTerm={termsAgreement.toggleTerm}
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
            <SignupStepRenderer flow={signupFlow} isUniversityServerError={isUniversityServerError} />
          </div>

          <SignupCtaSection
            isKeyboardCtaStep={isKeyboardCtaStep}
            isKeyboardOpen={isKeyboardOpen}
            isPrimaryCtaDisabled={isPrimaryCtaDisabled}
            isSubmitting={signupSubmit.isPending}
            keyboardInset={keyboardCta.keyboardInset}
            step={state.step}
            onNext={actions.nextStep}
            onOpenTermsAgreement={termsAgreement.open}
          />
        </section>
      </div>
    </main>
  );
}
