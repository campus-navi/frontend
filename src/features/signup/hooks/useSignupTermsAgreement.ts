import { useState } from 'react';

import type { SignupTermId } from '@/features/signup/components/SignupTermsAgreementSheet';

const requiredSignupTermIds: SignupTermId[] = ['privacy', 'age', 'externalApi'];

type UseSignupTermsAgreementParams = {
  canOpen: boolean;
  isSubmitting: boolean;
  onSubmit: () => void;
};

export function useSignupTermsAgreement({
  canOpen,
  isSubmitting,
  onSubmit,
}: UseSignupTermsAgreementParams) {
  const [isOpen, setIsOpen] = useState(false);
  const [agreedTermIds, setAgreedTermIds] = useState<SignupTermId[]>([]);
  const isAllRequiredTermsAgreed = requiredSignupTermIds.every((termId) =>
    agreedTermIds.includes(termId),
  );

  const open = () => {
    if (!canOpen || isSubmitting) {
      return;
    }

    setIsOpen(true);
  };

  const close = () => {
    if (isSubmitting) {
      return;
    }

    setIsOpen(false);
  };

  const toggleTerm = (termId: SignupTermId) => {
    setAgreedTermIds((currentTermIds) => {
      if (currentTermIds.includes(termId)) {
        return currentTermIds.filter((currentTermId) => currentTermId !== termId);
      }

      return [...currentTermIds, termId];
    });
  };

  const toggleAll = () => {
    setAgreedTermIds(isAllRequiredTermsAgreed ? [] : requiredSignupTermIds);
  };

  const submit = () => {
    if (!isAllRequiredTermsAgreed || isSubmitting) {
      return;
    }

    setIsOpen(false);
    onSubmit();
  };

  return {
    agreedTermIds,
    isAllRequiredTermsAgreed,
    isOpen,
    close,
    open,
    submit,
    toggleAll,
    toggleTerm,
  };
}
