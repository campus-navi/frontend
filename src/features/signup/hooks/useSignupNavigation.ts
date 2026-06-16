import { useEffect } from 'react';

import { useSignupFlowStore } from '@/features/signup/store/signupFlowStore';
import { SIGNUP_STEP, type SignupStep } from '@/features/signup/types';

type UseSignupNavigationParams = {
  isSubmitting: boolean;
  isTermsAgreementOpen: boolean;
  step: SignupStep;
  onCloseTermsAgreement: () => void;
  onNavigateBack: () => void;
  onPreviousStep: () => void;
  onReturnToEmailVerificationStep: () => void;
  onReturnToUniversityStep: () => void;
};

export function useSignupNavigation({
  isSubmitting,
  isTermsAgreementOpen,
  step,
  onCloseTermsAgreement,
  onNavigateBack,
  onPreviousStep,
  onReturnToEmailVerificationStep,
  onReturnToUniversityStep,
}: UseSignupNavigationParams) {
  useEffect(() => {
    return () => {
      useSignupFlowStore.getState().actions.resetFlow();
    };
  }, []);

  const handleBack = () => {
    if (isTermsAgreementOpen) {
      onCloseTermsAgreement();
      return;
    }

    if (isSubmitting) {
      return;
    }

    if (step === SIGNUP_STEP.UNIVERSITY) {
      onNavigateBack();
      return;
    }

    if (step === SIGNUP_STEP.DEPARTMENT) {
      onReturnToEmailVerificationStep();
      return;
    }

    if (step === SIGNUP_STEP.EMAIL_VERIFICATION) {
      onReturnToUniversityStep();
      return;
    }

    onPreviousStep();
  };

  return {
    handleBack,
  };
}
