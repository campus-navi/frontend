import { useEffect, useRef, useState } from 'react';

import { SignupTextField } from '@/features/signup/components/SignupTextField';
import { isSameEmailForComparison } from '@/features/signup/emailVerification';
import { formatRemainingTime } from '@/features/signup/utils';
import type { EmailVerificationState } from '@/features/signup/types';

type EmailVerificationStepProps = {
  email: string;
  emailLocalPart: string;
  emailDomain: string;
  sendBlockedSecondsLeft: number;
  verifyBlockedSecondsLeft: number;
  verification: EmailVerificationState;
  resendCooldownSecondsLeft: number;
  verificationSecondsLeft: number;
  onEmailChange: (value: string) => void;
  onVerificationCodeChange: (value: string) => void;
  onSendVerification: () => void;
  onSubmitVerification: () => void;
};

export function EmailVerificationStep({
  email,
  emailLocalPart,
  emailDomain,
  sendBlockedSecondsLeft,
  verifyBlockedSecondsLeft,
  verification,
  resendCooldownSecondsLeft,
  verificationSecondsLeft,
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
  const lastSentEmail = verification.send.lastSentEmail;
  const hasSentCode = lastSentEmail !== null;
  const isCodeSent = hasSentCode || isVerified;
  const isSending = verification.send.status === 'loading';
  const isVerifying = verification.verify.status === 'loading';
  const isCodeReady = verification.verify.code.length === 6;
  const isSendVerifyBlocked = verification.send.errorReason === 'verify_blocked';
  const isVerifyBlocked = verifyBlockedSecondsLeft > 0;
  const hasEmailMismatchSinceLastSend = hasSentCode && !isSameEmailForComparison(email, lastSentEmail);
  const needsResendBecauseMismatch = hasEmailMismatchSinceLastSend;
  const hasActiveVerificationSession = hasSentCode && verification.send.expiresAt !== null && !needsResendBecauseMismatch;
  const isVerificationExpired =
    hasActiveVerificationSession && !isVerified && !isSending && !isVerifyBlocked && !isSendVerifyBlocked && verificationSecondsLeft <= 0;
  const needsResendBecauseExpired = !needsResendBecauseMismatch && isVerificationExpired;
  const needsResendBecauseInvalidated =
    hasSentCode && !isVerified && !hasActiveVerificationSession && !needsResendBecauseMismatch && !isSendVerifyBlocked;
  const isSendBlocked = sendBlockedSecondsLeft > 0;
  const isSendEnabled = Boolean(emailLocalPart.trim()) && !isSending && !isSendBlocked && resendCooldownSecondsLeft <= 0;
  const isVerifyButtonEnabled =
    hasActiveVerificationSession && !isVerified && !isVerifying && !isVerifyBlocked && !needsResendBecauseExpired && isCodeReady;
  const sendButtonLabel = isSending ? '전송중' : isCodeSent ? '재전송' : '인증전송';
  const verifyButtonLabel = isVerified ? '인증완료' : isVerifying ? '확인중' : '인증하기';
  const verificationTimerLabel =
    isVerified || !hasActiveVerificationSession || isSending || isVerifyBlocked || isSendVerifyBlocked
      ? null
      : verificationSecondsLeft > 0
        ? `남은시간 ${formatRemainingTime(verificationSecondsLeft)}`
        : '유효시간 만료';
  const hasEmailInput = Boolean(emailLocalPart.trim());
  const emailLineBorderClassName = isEmailFocused || hasEmailInput ? 'border-[#707070]' : 'border-[#E8E8E8]';
  const hasVerificationCodeInput = Boolean(verification.verify.code.trim());
  const verificationCodeLineBorderClassName =
    isVerificationCodeFocused || hasVerificationCodeInput ? 'border-[#707070]' : 'border-[#E8E8E8]';
  const sendButtonClassName = isSendEnabled ? 'bg-[#333333] text-white' : 'bg-[#E7E7E7] text-[#BBBBBB]';
  const labelClassName = 'text-[14px] font-medium leading-[140%] text-[#5C5C5C]';
  const codeHelperMessage =
    verification.verify.errorReason === 'invalid_code'
      ? verification.verify.errorMessage
      : needsResendBecauseMismatch
        ? '이메일이 변경되었습니다. 인증을 다시 진행해주세요.'
      : needsResendBecauseInvalidated
        ? '인증코드를 다시 전송해주세요.'
      : !isSendVerifyBlocked && (needsResendBecauseExpired || verification.verify.errorReason === 'code_not_found')
        ? '유효시간이 만료되었습니다. 인증코드를 다시 전송해주세요.'
        : null;
  const emailHelperMessage =
    hasActiveVerificationSession && lastSentEmail ? `${lastSentEmail}로 인증번호를 전송했습니다.` : null;

  useEffect(() => {
    const focusTimer = window.setTimeout(() => {
      emailInputRef.current?.focus();
    }, 0);

    return () => window.clearTimeout(focusTimer);
  }, []);

  useEffect(() => {
    if (!isCodeSent || isVerified) {
      return undefined;
    }

    const focusTimer = window.setTimeout(() => {
      verificationCodeInputRef.current?.focus();
    }, 220);

    return () => window.clearTimeout(focusTimer);
  }, [isCodeSent, isVerified]);

  return (
    <div>
      <h1 className="text-[22px] font-bold leading-[1.45] tracking-[-0.03em] text-[#303030]">
        대학인증을 위해
        <br />
        이메일을 입력해주세요
      </h1>

      {isCodeSent ? (
        <div className="signup-slide-down mt-10">
          <p className={labelClassName}>인증코드</p>
          <div className={['mt-5 flex items-center gap-3 border-b-2 pb-3 transition-colors', verificationCodeLineBorderClassName].join(' ')}>
            <input
              ref={verificationCodeInputRef}
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={verification.verify.code}
              onChange={(event) => onVerificationCodeChange(event.target.value)}
              onBlur={() => setIsVerificationCodeFocused(false)}
              onFocus={() => setIsVerificationCodeFocused(true)}
              readOnly={isVerified || isVerifyBlocked}
              placeholder="6자리 숫자 입력"
              className={[
                'min-w-0 flex-1 border-0 bg-transparent px-0 text-[22px] tracking-[0.28em] placeholder:text-[15px] placeholder:tracking-normal focus:outline-none',
                isVerified ? 'cursor-default text-[#3A7A44]' : 'text-[#111111]',
              ].join(' ')}
            />
            {verificationTimerLabel ? <span className="text-[14px] text-[#8E8E8E]">{verificationTimerLabel}</span> : null}
            <button
              type="button"
              disabled={!isVerifyButtonEnabled}
              onClick={onSubmitVerification}
              className={[
                'flex h-[34px] w-[82px] shrink-0 items-center justify-center rounded-[8px] px-3 py-[10px] text-[14px] font-semibold leading-none tracking-[0.015em] transition-colors',
                isVerified
                  ? 'bg-[#E8F4EA] text-[#3A7A44]'
                  : isVerifyButtonEnabled
                    ? 'bg-[#3F4045] text-white'
                    : 'bg-[#E6E6E6] text-[#B8B8B8]',
              ].join(' ')}
            >
              {verifyButtonLabel}
            </button>
          </div>
          {codeHelperMessage ? (
            <p className="mt-3 text-[12px] font-medium leading-[140%] text-[#5C5C5C]">{codeHelperMessage}</p>
          ) : null}
        </div>
      ) : null}

      <div className={isCodeSent ? 'mt-8' : 'mt-10'}>
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
          <button
            type="button"
            disabled={!isSendEnabled}
            onClick={onSendVerification}
            className={[
              'flex h-[34px] w-[82px] shrink-0 items-center justify-center rounded-[8px] px-3 py-[10px] text-[14px] font-semibold leading-none tracking-[0.015em] transition-colors',
              sendButtonClassName,
            ].join(' ')}
          >
            <span className="whitespace-nowrap">{sendButtonLabel}</span>
          </button>
        </div>
        {emailHelperMessage ? <p className="mt-3 text-[12px] font-medium leading-[140%] text-[#5C5C5C]">{emailHelperMessage}</p> : null}
      </div>
    </div>
  ); 
}
