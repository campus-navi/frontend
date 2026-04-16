import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { isApiError } from '@/api';
import { AlertModal } from '@/components/ui/AlertModal';
import { CtaButton } from '@/components/ui/CtaButton';
import { SignupHeader } from '@/features/signup/components/SignupHeader';
import { getEmailVerificationErrorModal } from '@/features/signup/emailVerification';
import { useSignupFlow } from '@/features/signup/hooks/useSignupFlow';
import { useSignupFlowStore } from '@/features/signup/store/signupFlowStore';
import { AdmissionYearStep } from '@/features/signup/steps/AdmissionYearStep';
import { DepartmentStep } from '@/features/signup/steps/DepartmentStep';
import { EmailVerificationStep } from '@/features/signup/steps/EmailVerificationStep';
import { NicknameStep } from '@/features/signup/steps/NicknameStep';
import { PasswordStep } from '@/features/signup/steps/PasswordStep';
import { SuccessStep } from '@/features/signup/steps/SuccessStep';
import { UniversityStep } from '@/features/signup/steps/UniversityStep';
import { UsernameStep } from '@/features/signup/steps/UsernameStep';

export default function SignupPage() {
  const navigate = useNavigate();
  const [isEmailVerificationSuccessModalOpen, setIsEmailVerificationSuccessModalOpen] = useState(false);
  const {
    state,
    emailDomain,
    emailVerification,
    filteredUniversities,
    filteredDepartments,
    isCurrentStepValid,
    progressValue,
    admissionYears,
    universitySearch,
    isUniversitySearchVisible,
    actions,
  } = useSignupFlow();
  const universitySearchError = universitySearch.isError ? universitySearch.error : null;
  const isUniversityServerError = isApiError(universitySearchError) && universitySearchError.status === 500;
  const emailVerificationErrorModal = getEmailVerificationErrorModal(state.emailVerification);
  const wasEmailVerifiedRef = useRef(state.emailVerification.verifiedToken.isVerified);

  useEffect(() => {
    const isVerified = state.emailVerification.verifiedToken.isVerified;

    if (state.step === 1 && !wasEmailVerifiedRef.current && isVerified) {
      setIsEmailVerificationSuccessModalOpen(true);
    }

    wasEmailVerifiedRef.current = isVerified;
  }, [state.emailVerification.verifiedToken.isVerified, state.step]);

  const handleEmailVerificationErrorConfirm = () => {
    if (!emailVerificationErrorModal) {
      return;
    }

    if (emailVerificationErrorModal.scope === 'send' && state.emailVerification.send.errorReason === 'ip_blocked') {
      actions.clearEmailVerificationSendError();
      navigate('/');
      return;
    }

    if (emailVerificationErrorModal.scope === 'send') {
      actions.clearEmailVerificationSendError();
      return;
    }

    actions.clearEmailVerificationVerifyError();
  };

  const handleEmailVerificationSuccessConfirm = () => {
    setIsEmailVerificationSuccessModalOpen(false);
    actions.nextStep();
  };

  useEffect(() => {
    return () => {
      useSignupFlowStore.getState().actions.resetFlow();
    };
  }, []);

  const handleBack = () => {
    if (state.step === 0) {
      navigate(-1);
      return;
    }

    if (state.step === 2) {
      actions.returnToEmailVerificationStep();
      return;
    }

    actions.previousStep();
  };

  return (
    <main className="h-[100svh] overflow-hidden bg-white">
      <AlertModal
        isOpen={isUniversityServerError}
        title="에러"
        description="서버 오류가 발생했습니다. 처음 화면으로 이동해주세요."
        onConfirm={() => navigate('/')}
      />
      <AlertModal
        isOpen={Boolean(emailVerificationErrorModal)}
        placement="bottom-sheet"
        title={emailVerificationErrorModal?.title ?? '에러'}
        description={emailVerificationErrorModal?.description ?? ''}
        confirmLabel={emailVerificationErrorModal?.confirmLabel}
        onConfirm={handleEmailVerificationErrorConfirm}
      />
      <AlertModal
        isOpen={isEmailVerificationSuccessModalOpen}
        title="인증 성공"
        description="인증이 완료되었습니다."
        onConfirm={handleEmailVerificationSuccessConfirm}
      />

      <div className="mx-auto flex h-[100svh] w-full max-w-[393px] flex-col overflow-hidden bg-white">
        {state.step < 7 ? <SignupHeader progressValue={progressValue} onBack={handleBack} /> : <SignupHeader onBack={handleBack} />}

        <section
          className={[
            'flex min-h-0 flex-1 flex-col overflow-hidden px-5 pb-[max(24px,env(safe-area-inset-bottom))]',
            state.step < 7 ? 'pt-12' : 'py-10',
          ].join(' ')}
        >
          <div className="min-h-0 flex-1 overflow-hidden">
            {state.step === 0 ? (
              <UniversityStep
                isLoading={universitySearch.isLoading}
                isResultsVisible={isUniversitySearchVisible}
                query={state.universityQuery}
                selectedUniversity={state.form.selectedUniversity}
                suggestions={filteredUniversities}
                errorMessage={universitySearch.isError && !isUniversityServerError ? universitySearch.error.message : undefined}
                onChange={actions.updateUniversityQuery}
                onClear={actions.clearUniversityQuery}
                onRetry={() => void universitySearch.refetch()}
                onSelect={actions.selectUniversity}
              />
            ) : null}

            {state.step === 1 ? (
              <EmailVerificationStep
                email={emailVerification.email}
                emailLocalPart={state.form.emailLocalPart}
                emailDomain={emailDomain}
                sendBlockedSecondsLeft={emailVerification.sendBlockedSecondsLeft}
                verifyBlockedSecondsLeft={emailVerification.verifyBlockedSecondsLeft}
                verification={state.emailVerification}
                resendCooldownSecondsLeft={emailVerification.resendCooldownSecondsLeft}
                verificationSecondsLeft={emailVerification.verificationSecondsLeft}
                onEmailChange={actions.updateEmailLocalPart}
                onVerificationCodeChange={actions.updateVerificationCode}
                onSendVerification={actions.sendVerification}
                onSubmitVerification={actions.submitVerification}
              />
            ) : null}

            {state.step === 2 ? (
              <DepartmentStep
                query={state.departmentQuery}
                suggestions={filteredDepartments}
                onChange={actions.updateDepartmentQuery}
                onClear={actions.clearDepartmentQuery}
                onSelect={actions.selectDepartment}
              />
            ) : null}

            {state.step === 3 ? (
              <AdmissionYearStep
                selectedYear={state.form.admissionYear}
                years={admissionYears}
                onSelect={actions.selectAdmissionYear}
              />
            ) : null}

            {state.step === 4 ? <UsernameStep username={state.form.username} onChange={actions.updateUsername} /> : null}

            {state.step === 5 ? (
              <PasswordStep
                password={state.form.password}
                passwordConfirm={state.form.passwordConfirm}
                onPasswordChange={actions.updatePassword}
                onPasswordConfirmChange={actions.updatePasswordConfirm}
              />
            ) : null}

            {state.step === 6 ? <NicknameStep nickname={state.form.nickname} onChange={actions.updateNickname} /> : null}

            {state.step === 7 ? (
              <SuccessStep form={state.form} emailDomain={emailDomain} />
            ) : null}
          </div>

          {state.step < 7 && state.step !== 1 ? (
            <div className="mt-auto pt-8">
              <CtaButton
                active={isCurrentStepValid}
                disabled={!isCurrentStepValid}
                className="py-[18px] text-[18px] disabled:cursor-not-allowed disabled:bg-[#E4E4E4] disabled:text-[#BDBDBD] disabled:hover:bg-[#E4E4E4]"
                onClick={actions.nextStep}
              >
                다음
              </CtaButton>
            </div>
          ) : state.step === 7 ? (
            <div className="mt-auto pt-8">
              <CtaButton active className="py-[18px] text-[18px]" onClick={() => navigate('/')}>
                메인으로 이동
              </CtaButton>
            </div>
          ) : null}
        </section>
      </div>
    </main>
  );
}
