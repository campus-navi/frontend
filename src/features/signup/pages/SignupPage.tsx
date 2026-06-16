import { useNavigate } from 'react-router-dom';

import { isApiError } from '@/api';
import { SignupCtaSection } from '@/features/signup/components/SignupCtaSection';
import { SignupHeader } from '@/features/signup/components/SignupHeader';
import { SignupModalLayer } from '@/features/signup/components/SignupModalLayer';
import { SignupStepRenderer } from '@/features/signup/components/SignupStepRenderer';
import { SignupTermsAgreementSheet } from '@/features/signup/components/SignupTermsAgreementSheet';
import { useSignupEmailVerificationModal } from '@/features/signup/hooks/useSignupEmailVerificationModal';
import { useKeyboardCtaState } from '@/features/signup/hooks/useKeyboardCtaState';
import { useSignupFlow } from '@/features/signup/hooks/useSignupFlow';
import { useSignupNavigation } from '@/features/signup/hooks/useSignupNavigation';
import { useSignupSubmit } from '@/features/signup/hooks/useSignupSubmit';
import { useSignupTermsAgreement } from '@/features/signup/hooks/useSignupTermsAgreement';
import { SIGNUP_STEP } from '@/features/signup/types';

const keyboardCtaSteps: readonly number[] = [SIGNUP_STEP.PERSONAL_INFO, SIGNUP_STEP.ACCOUNT];

export function SignupPage() {
  const navigate = useNavigate();
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
  const isKeyboardCtaStep = keyboardCtaSteps.includes(state.step) && keyboardCta.isSupported;
  const isKeyboardOpen = isKeyboardCtaStep && keyboardCta.isKeyboardOpen;
  const signupSubmit = useSignupSubmit({
    emailDomain,
    emailVerification: state.emailVerification,
    form: state.form,
    onResetFlow: actions.resetFlow,
    onReturnToEmailVerificationStep: actions.returnToEmailVerificationStep,
  });
  const emailVerificationModal = useSignupEmailVerificationModal({
    emailVerification: state.emailVerification,
    step: state.step,
    onClearSendError: actions.clearEmailVerificationSendError,
    onClearVerifyError: actions.clearEmailVerificationVerifyError,
    onNavigateHome: () => navigate('/'),
    onNextStep: actions.nextStep,
  });
  const isPrimaryCtaDisabled = !isCurrentStepValid || signupSubmit.isPending;
  const termsAgreement = useSignupTermsAgreement({
    canOpen: isCurrentStepValid,
    isSubmitting: signupSubmit.isPending,
    onSubmit: () => void signupSubmit.submit(),
  });
  const signupNavigation = useSignupNavigation({
    isSubmitting: signupSubmit.isPending,
    isTermsAgreementOpen: termsAgreement.isOpen,
    step: state.step,
    onCloseTermsAgreement: termsAgreement.close,
    onNavigateBack: () => navigate(-1),
    onPreviousStep: actions.previousStep,
    onReturnToEmailVerificationStep: actions.returnToEmailVerificationStep,
    onReturnToUniversityStep: actions.returnToUniversityStep,
  });

  return (
    <main className="h-[100svh] overflow-hidden bg-white">
      <SignupModalLayer
        emailVerificationErrorModal={emailVerificationModal.emailVerificationErrorModal}
        isEmailVerificationSuccessModalOpen={emailVerificationModal.isEmailVerificationSuccessModalOpen}
        isUniversityServerError={isUniversityServerError}
        signupSubmitModal={signupSubmit.modal}
        onEmailVerificationErrorConfirm={emailVerificationModal.confirmEmailVerificationError}
        onEmailVerificationSuccessConfirm={emailVerificationModal.confirmEmailVerificationSuccess}
        onSignupSubmitModalConfirm={signupSubmit.closeModal}
        onUniversityServerErrorConfirm={() => navigate('/')}
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
        <SignupHeader progressValue={progressValue} onBack={signupNavigation.handleBack} />

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
