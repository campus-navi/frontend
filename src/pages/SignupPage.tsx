import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { CtaButton } from '@/components/ui/CtaButton';
import { SignupHeader } from '@/features/signup/components/SignupHeader';
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
  const {
    state,
    emailDomain,
    filteredUniversities,
    filteredDepartments,
    isCurrentStepValid,
    progressValue,
    admissionYears,
    timeLeft,
    universitySearch,
    isUniversitySearchVisible,
    actions,
  } = useSignupFlow();

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

    actions.previousStep();
  };

  return (
    <main className="h-[100svh] overflow-hidden bg-white">
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
                errorMessage={universitySearch.isError ? universitySearch.error.message : undefined}
                onChange={actions.updateUniversityQuery}
                onClear={actions.clearUniversityQuery}
                onRetry={() => void universitySearch.refetch()}
                onSelect={actions.selectUniversity}
              />
            ) : null}

            {state.step === 1 ? (
              <EmailVerificationStep
                emailLocalPart={state.form.emailLocalPart}
                emailDomain={emailDomain}
                emailVerified={state.form.emailVerified}
                verificationCode={state.verification.code}
                verificationSent={state.verification.sent}
                verificationError={state.verification.error}
                timeLeft={timeLeft}
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

          {state.step < 7 ? (
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
          ) : (
            <div className="mt-auto pt-8">
              <CtaButton active className="py-[18px] text-[18px]" onClick={() => navigate('/')}>
                메인으로 이동
              </CtaButton>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
