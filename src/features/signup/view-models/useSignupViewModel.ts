import { useNavigate } from 'react-router-dom';

import { isApiError } from '@/api';
import { useSignupEmailVerificationModal } from '@/features/signup/hooks/useSignupEmailVerificationModal';
import { useKeyboardCtaState } from '@/features/signup/hooks/useKeyboardCtaState';
import { useSignupFlow } from '@/features/signup/hooks/useSignupFlow';
import { useSignupNavigation } from '@/features/signup/hooks/useSignupNavigation';
import { useSignupSubmit } from '@/features/signup/hooks/useSignupSubmit';
import { useSignupTermsAgreement } from '@/features/signup/hooks/useSignupTermsAgreement';
import { SIGNUP_STEP } from '@/features/signup/types';
import type { SignupViewProps } from '@/features/signup/views/SignupView';

const keyboardCtaSteps: readonly number[] = [SIGNUP_STEP.PERSONAL_INFO, SIGNUP_STEP.ACCOUNT];

export function useSignupViewModel(): SignupViewProps {
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

  return {
    modal: {
      emailVerificationErrorModal: emailVerificationModal.emailVerificationErrorModal,
      isEmailVerificationSuccessModalOpen: emailVerificationModal.isEmailVerificationSuccessModalOpen,
      isUniversityServerError,
      signupSubmitModal: signupSubmit.modal,
      onEmailVerificationErrorConfirm: emailVerificationModal.confirmEmailVerificationError,
      onEmailVerificationSuccessConfirm: emailVerificationModal.confirmEmailVerificationSuccess,
      onSignupSubmitModalConfirm: signupSubmit.closeModal,
      onUniversityServerErrorConfirm: () => navigate('/'),
    },
    termsAgreement: {
      agreedTermIds: termsAgreement.agreedTermIds,
      isOpen: termsAgreement.isOpen,
      isSubmitting: signupSubmit.isPending,
      onClose: termsAgreement.close,
      onSubmit: termsAgreement.submit,
      onToggleAll: termsAgreement.toggleAll,
      onToggleTerm: termsAgreement.toggleTerm,
    },
    header: {
      progressValue,
      onBack: signupNavigation.handleBack,
    },
    content: {
      signupFlow,
      isUniversityServerError,
    },
    cta: {
      isKeyboardCtaStep,
      isKeyboardOpen,
      isPrimaryCtaDisabled,
      isSubmitting: signupSubmit.isPending,
      keyboardInset: keyboardCta.keyboardInset,
      step: state.step,
      onNext: actions.nextStep,
      onOpenTermsAgreement: termsAgreement.open,
    },
  };
}
