import { useEffect, useRef, useState } from 'react';

import { CtaButton } from '@/components/ui/CtaButton';
import { SignupTextField } from '@/features/signup/components/SignupTextField';
import type { EmailVerificationState } from '@/features/signup/types';

type EmailVerificationStepProps = {
  emailLocalPart: string;
  emailDomain: string;
  isCodeSent: boolean;
  isSendEnabled: boolean;
  isSendPending: boolean;
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
  const hasEmailInput = Boolean(emailLocalPart.trim());
  const emailLineBorderClassName = isEmailFocused || hasEmailInput ? 'border-[#707070]' : 'border-[#E8E8E8]';
  const hasVerificationCodeInput = Boolean(verification.verify.code.trim());
  const verificationCodeLineBorderClassName =
    isVerificationCodeFocused || hasVerificationCodeInput ? 'border-[#707070]' : 'border-[#E8E8E8]';
  const sendButtonState = isSendEnabled ? 'default' : isCodeSent ? 'ghosted' : 'disabled';
  const labelClassName = 'text-[14px] font-medium leading-[140%] text-[#5C5C5C]';
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
          <div className={['mt-5 flex items-center gap-3 border-b-2 pb-3 transition-colors', verificationCodeLineBorderClassName].join(' ')}>
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
              {verifyButtonLabel}
            </CtaButton>
          </div>
          {codeHelperMessage ? (
            <p className="mt-3 text-[12px] font-medium leading-[140%] text-[#5C5C5C]">{codeHelperMessage}</p>
          ) : null}
        </div>
      ) : null}

      <div className={isCodeSent ? 'mt-0' : 'mt-10'}>
        <p className={labelClassName}>학교 이메일</p>
        <div className="mt-2 flex items-end gap-2">
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
                'placeholder:text-[16px] placeholder:font-medium placeholder:leading-[140%] placeholder:text-[#5C5C5C] placeholder:opacity-50',
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
              emailLineBorderClassName,
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
              <span
                aria-label="전송 중"
                className="h-4 w-4 animate-spin rounded-full border-2 border-[#BBBBBB] border-t-transparent"
                role="status"
              />
            ) : (
              <span className="whitespace-nowrap">{sendButtonLabel}</span>
            )}
          </CtaButton>
        </div>
        {emailHelperMessage ? <p className="mt-3 text-[12px] font-medium leading-[140%] text-[#5C5C5C]">{emailHelperMessage}</p> : null}
      </div>
    </div>
  ); 
}
