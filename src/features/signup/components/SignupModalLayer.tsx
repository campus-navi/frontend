import { AlertModal } from '@/components/ui/AlertModal';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { CtaButton } from '@/components/ui/CtaButton';
import type { getEmailVerificationErrorModal } from '@/features/signup/emailVerification';
import type { SignupSubmitErrorAction } from '@/features/signup/services/signupError';

type EmailVerificationErrorModal = ReturnType<typeof getEmailVerificationErrorModal>;

type SignupModalLayerProps = {
  emailVerificationErrorModal: EmailVerificationErrorModal;
  isEmailVerificationSuccessModalOpen: boolean;
  isUniversityServerError: boolean;
  signupSubmitModal: SignupSubmitErrorAction | null;
  onEmailVerificationErrorConfirm: () => void;
  onEmailVerificationSuccessConfirm: () => void;
  onSignupSubmitModalConfirm: () => void;
  onUniversityServerErrorConfirm: () => void;
};

export function SignupModalLayer({
  emailVerificationErrorModal,
  isEmailVerificationSuccessModalOpen,
  isUniversityServerError,
  signupSubmitModal,
  onEmailVerificationErrorConfirm,
  onEmailVerificationSuccessConfirm,
  onSignupSubmitModalConfirm,
  onUniversityServerErrorConfirm,
}: SignupModalLayerProps) {
  return (
    <>
      <AlertModal
        isOpen={isUniversityServerError}
        title="에러"
        description="서버 오류가 발생했습니다. 처음 화면으로 이동해주세요."
        onConfirm={onUniversityServerErrorConfirm}
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
            onClick={onEmailVerificationErrorConfirm}
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
        onConfirm={onEmailVerificationSuccessConfirm}
      />
      <AlertModal
        isOpen={Boolean(signupSubmitModal)}
        title={signupSubmitModal?.title ?? '에러'}
        description={signupSubmitModal?.description ?? ''}
        confirmLabel={signupSubmitModal?.type === 'duplicate_restart' ? '홈으로' : undefined}
        isConfirmCta={signupSubmitModal?.type === 'duplicate_restart'}
        onConfirm={onSignupSubmitModalConfirm}
      />
    </>
  );
}
