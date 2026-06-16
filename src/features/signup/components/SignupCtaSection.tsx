import type { PointerEvent } from 'react';

import { CtaButton } from '@/components/ui/CtaButton';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { SIGNUP_STEP, type SignupStep } from '@/features/signup/types';

type SignupCtaSectionProps = {
  isKeyboardCtaStep: boolean;
  isKeyboardOpen: boolean;
  isPrimaryCtaDisabled: boolean;
  isSubmitting: boolean;
  keyboardInset: number;
  step: SignupStep;
  onNext: () => void;
  onOpenTermsAgreement: () => void;
};

export function SignupCtaSection({
  isKeyboardCtaStep,
  isKeyboardOpen,
  isPrimaryCtaDisabled,
  isSubmitting,
  keyboardInset,
  step,
  onNext,
  onOpenTermsAgreement,
}: SignupCtaSectionProps) {
  const ctaContainerSpacingClassName = isKeyboardOpen
    ? 'px-0 pb-0 pt-0'
    : 'px-5 pb-[max(24px,env(safe-area-inset-bottom))] pt-2';
  const ctaButtonClassName = isKeyboardOpen ? '!rounded-none' : '';
  const ctaPositionTransitionClassName = isKeyboardOpen
    ? ''
    : 'transition-[bottom] duration-200 ease-out';

  const handleKeyboardCtaPointerDown = (event: PointerEvent<HTMLButtonElement>) => {
    if (!isKeyboardOpen || isPrimaryCtaDisabled) {
      return;
    }

    event.preventDefault();
    onNext();
  };

  if (isKeyboardCtaStep) {
    return (
      <>
        <div
          aria-hidden="true"
          className="mt-auto h-[calc(88px+max(24px,env(safe-area-inset-bottom)))] shrink-0"
        />
        <div
          className={[
            "fixed left-1/2 z-20 w-full max-w-[393px] -translate-x-1/2 bg-white before:pointer-events-none before:absolute before:inset-x-0 before:-top-4 before:bottom-0 before:bg-white before:content-['']",
            ctaPositionTransitionClassName,
            ctaContainerSpacingClassName,
          ].join(' ')}
          style={{ bottom: `${isKeyboardOpen ? keyboardInset : 0}px` }}
        >
          <CtaButton
            className={['relative z-10', ctaButtonClassName].filter(Boolean).join(' ')}
            disabled={isPrimaryCtaDisabled}
            onClick={isKeyboardOpen ? undefined : onNext}
            onPointerDown={handleKeyboardCtaPointerDown}
          >
            다음
          </CtaButton>
        </div>
      </>
    );
  }

  if (step === SIGNUP_STEP.EMAIL_VERIFICATION) {
    return null;
  }

  return (
    <div className="mt-auto pt-8">
      <CtaButton
        disabled={isPrimaryCtaDisabled}
        onClick={step === SIGNUP_STEP.NICKNAME ? onOpenTermsAgreement : onNext}
      >
        {step === SIGNUP_STEP.NICKNAME && isSubmitting ? (
          <LoadingSpinner ariaLabel="회원가입 중" />
        ) : (
          '다음'
        )}
      </CtaButton>
    </div>
  );
}
