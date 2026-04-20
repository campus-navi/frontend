import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { normalizeApiError } from '@/api';
import { createSchoolEmail } from '@/features/signup/emailVerification';
import { mapSignupSubmitError, type SignupSubmitErrorAction } from '@/features/signup/services/signupError';
import { submitSignup } from '@/features/signup/services/signupSubmit';
import type { EmailVerificationState, SignupCompleteSnapshot, SignupForm } from '@/features/signup/types';
import { buildSignupPayload } from '@/features/signup/utils/buildSignupPayload';

type UseSignupSubmitParams = {
  emailDomain: string;
  emailVerification: EmailVerificationState;
  form: SignupForm;
  onResetFlow: () => void;
  onReturnToEmailVerificationStep: () => void;
};

type SignupSubmitModalState = SignupSubmitErrorAction | null;

function createSignupCompleteSnapshot(form: SignupForm, emailDomain: string): SignupCompleteSnapshot {
  return {
    admissionYear: form.admissionYear,
    department: form.department,
    email: createSchoolEmail(form.emailLocalPart, emailDomain),
    nickname: form.nickname,
    universityName: form.selectedUniversity?.universityName ?? '대학교 미선택',
    username: form.username,
  };
}

export function useSignupSubmit({
  emailDomain,
  emailVerification,
  form,
  onResetFlow,
  onReturnToEmailVerificationStep,
}: UseSignupSubmitParams) {
  const navigate = useNavigate();
  const [isPending, setIsPending] = useState(false);
  const [modal, setModal] = useState<SignupSubmitModalState>(null);

  const submit = async () => {
    if (isPending) {
      return;
    }

    setIsPending(true);

    try {
      const payload = buildSignupPayload(form, emailVerification);
      const completeSnapshot = createSignupCompleteSnapshot(form, emailDomain);

      await submitSignup(payload);
      onResetFlow();
      navigate('/signup/complete', {
        replace: true,
        state: completeSnapshot,
      });
    } catch (error) {
      setModal(mapSignupSubmitError(normalizeApiError(error)));
    } finally {
      setIsPending(false);
    }
  };

  const closeModal = () => {
    if (!modal) {
      return;
    }

    if (modal.type === 'duplicate_restart') {
      onResetFlow();
      navigate('/signup', { replace: true });
      setModal(null);
      return;
    }

    if (modal.type === 'verification_expired') {
      onReturnToEmailVerificationStep();
      setModal(null);
      return;
    }

    setModal(null);
  };

  return {
    isPending,
    modal,
    submit,
    closeModal,
  };
}
