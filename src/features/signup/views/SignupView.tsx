import { SignupCtaSection } from '@/features/signup/components/SignupCtaSection';
import { SignupHeader } from '@/features/signup/components/SignupHeader';
import { SignupModalLayer } from '@/features/signup/components/SignupModalLayer';
import { SignupStepRenderer } from '@/features/signup/components/SignupStepRenderer';
import {
  SignupTermsAgreementSheet,
  type SignupTermId,
} from '@/features/signup/components/SignupTermsAgreementSheet';
import type { getEmailVerificationErrorModal } from '@/features/signup/emailVerification';
import type { useSignupFlow } from '@/features/signup/hooks/useSignupFlow';
import type { SignupSubmitErrorAction } from '@/features/signup/services/signupError';
import type { SignupStep } from '@/features/signup/types';

type SignupFlow = ReturnType<typeof useSignupFlow>;
type EmailVerificationErrorModal = ReturnType<typeof getEmailVerificationErrorModal>;

type SignupViewProps = {
  agreedTermIds: SignupTermId[];
  emailVerificationErrorModal: EmailVerificationErrorModal;
  isEmailVerificationSuccessModalOpen: boolean;
  isKeyboardCtaStep: boolean;
  isKeyboardOpen: boolean;
  isPrimaryCtaDisabled: boolean;
  isSubmitting: boolean;
  isTermsAgreementOpen: boolean;
  isUniversityServerError: boolean;
  keyboardInset: number;
  progressValue: number;
  signupFlow: SignupFlow;
  signupSubmitModal: SignupSubmitErrorAction | null;
  step: SignupStep;
  onBack: () => void;
  onEmailVerificationErrorConfirm: () => void;
  onEmailVerificationSuccessConfirm: () => void;
  onNext: () => void;
  onOpenTermsAgreement: () => void;
  onSignupSubmitModalConfirm: () => void;
  onTermsAgreementClose: () => void;
  onTermsAgreementSubmit: () => void;
  onTermsAgreementToggleAll: () => void;
  onTermsAgreementToggleTerm: (termId: SignupTermId) => void;
  onUniversityServerErrorConfirm: () => void;
};

export function SignupView({
  agreedTermIds,
  emailVerificationErrorModal,
  isEmailVerificationSuccessModalOpen,
  isKeyboardCtaStep,
  isKeyboardOpen,
  isPrimaryCtaDisabled,
  isSubmitting,
  isTermsAgreementOpen,
  isUniversityServerError,
  keyboardInset,
  progressValue,
  signupFlow,
  signupSubmitModal,
  step,
  onBack,
  onEmailVerificationErrorConfirm,
  onEmailVerificationSuccessConfirm,
  onNext,
  onOpenTermsAgreement,
  onSignupSubmitModalConfirm,
  onTermsAgreementClose,
  onTermsAgreementSubmit,
  onTermsAgreementToggleAll,
  onTermsAgreementToggleTerm,
  onUniversityServerErrorConfirm,
}: SignupViewProps) {
  return (
    <main className="h-[100svh] overflow-hidden bg-white">
      <SignupModalLayer
        emailVerificationErrorModal={emailVerificationErrorModal}
        isEmailVerificationSuccessModalOpen={isEmailVerificationSuccessModalOpen}
        isUniversityServerError={isUniversityServerError}
        signupSubmitModal={signupSubmitModal}
        onEmailVerificationErrorConfirm={onEmailVerificationErrorConfirm}
        onEmailVerificationSuccessConfirm={onEmailVerificationSuccessConfirm}
        onSignupSubmitModalConfirm={onSignupSubmitModalConfirm}
        onUniversityServerErrorConfirm={onUniversityServerErrorConfirm}
      />
      <SignupTermsAgreementSheet
        agreedTermIds={agreedTermIds}
        isOpen={isTermsAgreementOpen}
        isSubmitting={isSubmitting}
        onClose={onTermsAgreementClose}
        onSubmit={onTermsAgreementSubmit}
        onToggleAll={onTermsAgreementToggleAll}
        onToggleTerm={onTermsAgreementToggleTerm}
      />

      <div className="mx-auto flex h-[100svh] w-full max-w-[393px] flex-col overflow-hidden bg-white">
        <SignupHeader progressValue={progressValue} onBack={onBack} />

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
            isSubmitting={isSubmitting}
            keyboardInset={keyboardInset}
            step={step}
            onNext={onNext}
            onOpenTermsAgreement={onOpenTermsAgreement}
          />
        </section>
      </div>
    </main>
  );
}
