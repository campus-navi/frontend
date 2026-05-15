import { useEffect, useRef, useState } from 'react';

import { CtaButton } from '@/components/ui/CtaButton';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { SignupTextField } from '@/features/signup/components/SignupTextField';
import { signupValidationFeedbackClassNames } from '@/features/signup/constants';
import type { EmailVerificationState } from '@/features/signup/types';

type EmailVerificationStepProps = {
  emailLocalPart: string;
  emailDomain: string;
  isCodeSent: boolean;
  isSendEnabled: boolean;
  isSendPending: boolean;
  isVerifyPending: boolean;
  isVerifyButtonEnabled: boolean;
  isVerificationCodeReadOnly: boolean;
  codeHelperMessage: string | null;
  emailHelperMessage: string | null;
  sendButtonLabel: string;
  verificationTimerLabel: string | null;
  verification: EmailVerificationState;
  verifyButtonLabel: string;
  onEmailChange: (value: string) => void;
  onVerificationCodeChange: (value: string) => void;
  onSendVerification: () => void;
  onSubmitVerification: () => void;
};

export function EmailVerificationStep({
  emailLocalPart,
  emailDomain,
  isCodeSent,
  isSendEnabled,
  isSendPending,
  isVerifyPending,
  isVerifyButtonEnabled,
  isVerificationCodeReadOnly,
  codeHelperMessage,
  emailHelperMessage,
  sendButtonLabel,
  verificationTimerLabel,
  verification,
  verifyButtonLabel,
  onEmailChange,
  onVerificationCodeChange,
  onSendVerification,
  onSubmitVerification,
}: EmailVerificationStepProps) {
  const emailInputRef = useRef<HTMLInputElement>(null);
  const verificationCodeInputRef = useRef<HTMLInputElement>(null);
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isVerificationCodeFocused, setIsVerificationCodeFocused] = useState(false);
  const isVerified = verification.verifiedToken.isVerified;
  const isEmailError = verification.send.errorReason === 'already_registered';
  const isVerificationCodeError = Boolean(codeHelperMessage);
  const emailLineBorderClassName = isEmailError
    ? 'border-[#FF5E47]'
    : isEmailFocused
      ? 'border-[#292B2C]'
      : 'border-[#DCDFE2]';
  const verificationCodeLineBorderClassName = isVerificationCodeError
    ? 'border-[#FF5E47]'
    : isVerificationCodeFocused
      ? 'border-[#292B2C]'
      : 'border-[#DCDFE2]';
  const sendButtonState = isSendEnabled ? 'default' : isCodeSent ? 'ghosted' : 'disabled';
  const labelClassName = 'text-[14px] font-medium leading-[140%] text-[#565656]';
  const emailDomainBorderClassName = 'border-[#707376]';
  const codeHelperClassName = isVerificationCodeError
    ? signupValidationFeedbackClassNames.helperText.error
    : signupValidationFeedbackClassNames.helperText.default;
  const emailHelperClassName = isEmailError
    ? signupValidationFeedbackClassNames.helperText.error
    : signupValidationFeedbackClassNames.helperText.success;
  useEffect(() => {
    const focusTimer = window.setTimeout(() => {
      emailInputRef.current?.focus();
    }, 0);

    return () => window.clearTimeout(focusTimer);
  }, []);

  useEffect(() => {
    if (!isCodeSent || isVerified || verification.send.expiresAt === null) {
      return undefined;
    }

    const focusTimer = window.setTimeout(() => {
      verificationCodeInputRef.current?.focus();
    }, 220);

    return () => window.clearTimeout(focusTimer);
  }, [isCodeSent, isVerified, verification.send.expiresAt]);

  return (
    <div>
      <h1 className="text-[22px] font-bold leading-[1.45] tracking-[-0.03em] text-[#303030]">
        대학인증을 위해
        <br />
        이메일을 입력해주세요
      </h1>

      {isCodeSent ? (
        <div className="signup-slide-down mt-10 mb-8">
          <p className={labelClassName}>인증코드</p>
          <div className={['flex items-center gap-3 border-b-2 pb-3 pt-6 transition-colors', verificationCodeLineBorderClassName].join(' ')}>
            <input
              ref={verificationCodeInputRef}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              autoComplete="one-time-code"
              maxLength={6}
              value={verification.verify.code}
              onChange={(event) => onVerificationCodeChange(event.target.value)}
              onBlur={() => setIsVerificationCodeFocused(false)}
              onFocus={() => setIsVerificationCodeFocused(true)}
              readOnly={isVerificationCodeReadOnly}
              placeholder="6자리 숫자 입력"
              className={[
                'min-w-0 flex-1 border-0 bg-transparent px-0 text-[22px] tracking-[0.28em] placeholder:text-[15px] placeholder:tracking-normal focus:outline-none',
                isVerified ? 'cursor-default text-[#3A7A44]' : 'text-[#111111]',
              ].join(' ')}
            />
            {verificationTimerLabel ? <span className="text-[14px] text-[#8E8E8E]">{verificationTimerLabel}</span> : null}
            <CtaButton
              type="button"
              variant="primary"
              state={isVerifyButtonEnabled ? 'default' : 'disabled'}
              size="sm"
              fullWidth={false}
              disabled={!isVerifyButtonEnabled}
              onClick={onSubmitVerification}
              className="w-[82px] shrink-0"
            >
              {isVerifyPending ? <LoadingSpinner ariaLabel="확인 중" /> : verifyButtonLabel}
            </CtaButton>
          </div>
          {codeHelperMessage ? (
            <p className={['mt-3 text-[12px] font-medium leading-[140%]', codeHelperClassName].join(' ')}>{codeHelperMessage}</p>
          ) : null}
        </div>
      ) : null}

      <div className={isCodeSent ? 'mt-0' : 'mt-10'}>
        <p className={labelClassName}>학교 이메일</p>
        <div className="flex items-end gap-2">
          <div className={['min-w-0 flex-1 border-b-2 transition-colors', emailLineBorderClassName].join(' ')}>
            <SignupTextField
              label=""
              value={emailLocalPart}
              placeholder="이메일 아이디"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              containerClassName="!mt-0 !border-b-0 !border-transparent focus-within:!border-transparent"
              inputMode="email"
              inputClassName={[
                'h-[62px] px-0 pb-4 pt-6 text-[16px] font-medium leading-[140%] text-[#333333]',
                'placeholder:text-[16px] placeholder:font-medium placeholder:leading-[140%] placeholder:text-[#BFC4C8] placeholder:opacity-100',
              ].join(' ')}
              inputRef={emailInputRef}
              lang="en"
              spellCheck={false}
              onBlur={() => setIsEmailFocused(false)}
              onChange={onEmailChange}
              onFocus={() => setIsEmailFocused(true)}
            />
          </div>
          <div
            className={[
              'flex h-[62px] w-[107px] shrink-0 items-start border-b-2 px-1 pb-4 pt-6 text-[16px] font-medium leading-[140%] tracking-[0.02em] text-[#707070] transition-colors',
              emailDomainBorderClassName,
            ].join(' ')}
          >
            @{emailDomain}
          </div>
          <CtaButton
            type="button"
            variant={isCodeSent ? 'tertiary' : 'primary'}
            state={sendButtonState}
            size="sm"
            fullWidth={false}
            disabled={!isSendEnabled}
            onClick={onSendVerification}
            className="w-[82px] shrink-0"
          >
            {isSendPending ? (
              <LoadingSpinner ariaLabel="전송 중" />
            ) : (
              <span className="whitespace-nowrap">{sendButtonLabel}</span>
            )}
          </CtaButton>
        </div>
        {emailHelperMessage ? (
          <p className={['mt-3 text-[12px] font-medium leading-[140%]', emailHelperClassName].join(' ')}>{emailHelperMessage}</p>
        ) : null}
      </div>
    </div>
  ); 
}
