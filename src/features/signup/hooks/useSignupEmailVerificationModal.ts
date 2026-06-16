import { useEffect, useRef, useState } from 'react';

import { getEmailVerificationErrorModal } from '@/features/signup/emailVerification';
import { SIGNUP_STEP, type EmailVerificationState, type SignupStep } from '@/features/signup/types';

type UseSignupEmailVerificationModalParams = {
  emailVerification: EmailVerificationState;
  step: SignupStep;
  onClearSendError: () => void;
  onClearVerifyError: () => void;
  onNavigateHome: () => void;
  onNextStep: () => void;
};

export function useSignupEmailVerificationModal({
  emailVerification,
  step,
  onClearSendError,
  onClearVerifyError,
  onNavigateHome,
  onNextStep,
}: UseSignupEmailVerificationModalParams) {
  const [isEmailVerificationSuccessModalOpen, setIsEmailVerificationSuccessModalOpen] =
    useState(false);
  const wasEmailVerifiedRef = useRef(emailVerification.verifiedToken.isVerified);
  const emailVerificationErrorModal = getEmailVerificationErrorModal(emailVerification);

  useEffect(() => {
    const isVerified = emailVerification.verifiedToken.isVerified;

    if (step === SIGNUP_STEP.EMAIL_VERIFICATION && !wasEmailVerifiedRef.current && isVerified) {
      setIsEmailVerificationSuccessModalOpen(true);
    }

    wasEmailVerifiedRef.current = isVerified;
  }, [emailVerification.verifiedToken.isVerified, step]);

  const confirmEmailVerificationError = () => {
    if (!emailVerificationErrorModal) {
      return;
    }

    if (
      emailVerificationErrorModal.scope === 'send' &&
      emailVerification.send.errorReason === 'ip_blocked'
    ) {
      onClearSendError();
      onNavigateHome();
      return;
    }

    if (emailVerificationErrorModal.scope === 'send') {
      onClearSendError();
      return;
    }

    onClearVerifyError();
  };

  const confirmEmailVerificationSuccess = () => {
    setIsEmailVerificationSuccessModalOpen(false);
    onNextStep();
  };

  return {
    emailVerificationErrorModal,
    isEmailVerificationSuccessModalOpen,
    confirmEmailVerificationError,
    confirmEmailVerificationSuccess,
  };
}
