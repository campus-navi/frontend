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

export type SignupViewProps = {
  modal: {
    emailVerificationErrorModal: EmailVerificationErrorModal;
    isEmailVerificationSuccessModalOpen: boolean;
    isUniversityServerError: boolean;
    signupSubmitModal: SignupSubmitErrorAction | null;
    onEmailVerificationErrorConfirm: () => void;
    onEmailVerificationSuccessConfirm: () => void;
    onSignupSubmitModalConfirm: () => void;
    onUniversityServerErrorConfirm: () => void;
  };
  termsAgreement: {
    agreedTermIds: SignupTermId[];
    isOpen: boolean;
    isSubmitting: boolean;
    onClose: () => void;
    onSubmit: () => void;
    onToggleAll: () => void;
    onToggleTerm: (termId: SignupTermId) => void;
  };
  header: {
    progressValue: number;
    onBack: () => void;
  };
  content: {
    signupFlow: SignupFlow;
    isUniversityServerError: boolean;
  };
  cta: {
    isKeyboardCtaStep: boolean;
    isKeyboardOpen: boolean;
    isPrimaryCtaDisabled: boolean;
    isSubmitting: boolean;
    keyboardInset: number;
    step: SignupStep;
    onNext: () => void;
    onOpenTermsAgreement: () => void;
  };
};

export function SignupView({
  modal,
  termsAgreement,
  header,
  content,
  cta,
}: SignupViewProps) {
  return (
    <main className="h-[100svh] overflow-hidden bg-white">
      <SignupModalLayer
        emailVerificationErrorModal={modal.emailVerificationErrorModal}
        isEmailVerificationSuccessModalOpen={modal.isEmailVerificationSuccessModalOpen}
        isUniversityServerError={modal.isUniversityServerError}
        signupSubmitModal={modal.signupSubmitModal}
        onEmailVerificationErrorConfirm={modal.onEmailVerificationErrorConfirm}
        onEmailVerificationSuccessConfirm={modal.onEmailVerificationSuccessConfirm}
        onSignupSubmitModalConfirm={modal.onSignupSubmitModalConfirm}
        onUniversityServerErrorConfirm={modal.onUniversityServerErrorConfirm}
      />
      <SignupTermsAgreementSheet
        agreedTermIds={termsAgreement.agreedTermIds}
        isOpen={termsAgreement.isOpen}
        isSubmitting={termsAgreement.isSubmitting}
        onClose={termsAgreement.onClose}
        onSubmit={termsAgreement.onSubmit}
        onToggleAll={termsAgreement.onToggleAll}
        onToggleTerm={termsAgreement.onToggleTerm}
      />

      <div className="mx-auto flex h-[100svh] w-full max-w-[393px] flex-col overflow-hidden bg-white">
        <SignupHeader progressValue={header.progressValue} onBack={header.onBack} />

        <section
          className={[
            'relative flex min-h-0 flex-1 flex-col overflow-hidden px-5',
            cta.isKeyboardCtaStep ? '' : 'pb-[max(24px,env(safe-area-inset-bottom))]',
            'pt-12',
          ].join(' ')}
        >
          <div className="min-h-0 flex-1 overflow-hidden">
            <SignupStepRenderer
              flow={content.signupFlow}
              isUniversityServerError={content.isUniversityServerError}
            />
          </div>

          <SignupCtaSection
            isKeyboardCtaStep={cta.isKeyboardCtaStep}
            isKeyboardOpen={cta.isKeyboardOpen}
            isPrimaryCtaDisabled={cta.isPrimaryCtaDisabled}
            isSubmitting={cta.isSubmitting}
            keyboardInset={cta.keyboardInset}
            step={cta.step}
            onNext={cta.onNext}
            onOpenTermsAgreement={cta.onOpenTermsAgreement}
          />
        </section>
      </div>
    </main>
  );
}
