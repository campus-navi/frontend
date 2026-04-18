import { useMemo, useRef } from 'react';

import { authApi, normalizeApiError } from '@/api';
import { signupEmailVerificationPolicy } from '@/features/signup/constants';
import {
  createSchoolEmail,
  EMAIL_VERIFICATION_MESSAGES,
  isSameEmailForComparison,
  isValidSchoolEmail,
  mapSendEmailVerificationError,
  mapVerifyEmailVerificationError,
} from '@/features/signup/emailVerification';
import { useSignupFlowStore } from '@/features/signup/store/signupFlowStore';
import { useVerificationTimer } from '@/features/signup/hooks/useVerificationTimer';
import { formatRemainingTime } from '@/features/signup/utils';

function dismissMobileKeyboard() {
  const activeElement = document.activeElement;

  if (activeElement instanceof HTMLElement) {
    activeElement.blur();
  }
}

function getCampusId(value: number | string | null | undefined) {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === 'string' && value.trim()) {
    const parsedValue = Number(value);

    if (Number.isFinite(parsedValue)) {
      return parsedValue;
    }
  }

  return null;
}

export function useEmailVerification(emailDomain: string) {
  const sendInFlightRef = useRef(false);
  const verifyInFlightRef = useRef(false);
  const emailLocalPart = useSignupFlowStore((state) => state.form.emailLocalPart);
  const selectedUniversity = useSignupFlowStore((state) => state.form.selectedUniversity);
  const emailVerification = useSignupFlowStore((state) => state.emailVerification);
  const actions = useSignupFlowStore((state) => state.actions);

  const email = useMemo(
    () => createSchoolEmail(emailLocalPart, emailDomain),
    [emailDomain, emailLocalPart],
  );
  const verificationTimer = useVerificationTimer(emailVerification.send.expiresAt);
  const resendCooldownTimer = useVerificationTimer(emailVerification.send.cooldownEndsAt);
  const sendBlockedTimer = useVerificationTimer(emailVerification.send.blockedEndsAt);
  const verifyBlockedTimer = useVerificationTimer(emailVerification.verify.blockedEndsAt);
  const sendBlockedSecondsLeft = sendBlockedTimer.timeLeft;
  const verifyBlockedSecondsLeft = verifyBlockedTimer.timeLeft;
  const resendCooldownSecondsLeft = resendCooldownTimer.timeLeft;
  const verificationSecondsLeft = verificationTimer.timeLeft;
  const isVerified = emailVerification.verifiedToken.isVerified;
  const lastSentEmail = emailVerification.send.lastSentEmail;
  const hasSentCode = lastSentEmail !== null;
  const isCodeSent = hasSentCode || isVerified;
  const isSending = emailVerification.send.status === 'loading';
  const isVerifying = emailVerification.verify.status === 'loading';
  const isCodeReady = emailVerification.verify.code.length === 6;
  const isSendVerifyBlocked = emailVerification.send.errorReason === 'verify_blocked';
  const isVerifyBlocked = verifyBlockedSecondsLeft > 0;
  const hasEmailMismatchSinceLastSend = hasSentCode && !isSameEmailForComparison(email, lastSentEmail);
  const hasActiveVerificationSession = hasSentCode && emailVerification.send.expiresAt !== null && !hasEmailMismatchSinceLastSend;
  const isVerificationExpired =
    hasActiveVerificationSession && !isVerified && !isSending && !isVerifyBlocked && !isSendVerifyBlocked && verificationSecondsLeft <= 0;
  const needsResendBecauseExpired = !hasEmailMismatchSinceLastSend && isVerificationExpired;
  const needsResendBecauseInvalidated =
    hasSentCode && !isVerified && !hasActiveVerificationSession && !hasEmailMismatchSinceLastSend && !isSendVerifyBlocked;
  const canVerify =
    hasActiveVerificationSession && !isVerified && !isVerifying && !isVerifyBlocked && !needsResendBecauseExpired && isCodeReady;
  const canSend = Boolean(emailLocalPart.trim()) && !isSending && sendBlockedSecondsLeft <= 0 && resendCooldownSecondsLeft <= 0;
  const sendButtonLabel = isSending ? '전송중' : isCodeSent ? '재전송' : '인증전송';
  const verifyButtonLabel = isVerified ? '인증완료' : isVerifying ? '확인중' : '인증하기';
  const verificationTimerLabel =
    isVerified || !hasActiveVerificationSession || isSending || isVerifyBlocked || isSendVerifyBlocked
      ? null
      : verificationSecondsLeft > 0
        ? `남은시간 ${formatRemainingTime(verificationSecondsLeft)}`
        : '유효시간 만료';
  const codeHelperMessage =
    emailVerification.verify.errorReason === 'invalid_code'
      ? emailVerification.verify.errorMessage
      : hasEmailMismatchSinceLastSend
        ? '이메일이 변경되었습니다. 인증을 다시 진행해주세요.'
      : needsResendBecauseInvalidated
        ? '인증코드를 다시 전송해주세요.'
      : !isSendVerifyBlocked && (needsResendBecauseExpired || emailVerification.verify.errorReason === 'code_not_found')
        ? '유효시간이 만료되었습니다. 인증코드를 다시 전송해주세요.'
        : null;
  const emailHelperMessage = hasActiveVerificationSession && lastSentEmail ? `${lastSentEmail}로 인증번호를 전송했습니다.` : null;

  const sendCode = async () => {
    if (sendInFlightRef.current) {
      return;
    }

    const campusId = getCampusId(selectedUniversity?.campusId);

    if (!selectedUniversity || campusId == null) {
      return;
    }

    if (!isValidSchoolEmail(email)) {
      actions.emailVerificationSendFailure({
        message: EMAIL_VERIFICATION_MESSAGES.invalidEmail,
        reason: 'invalid_email',
      });
      return;
    }

    const requestContext = actions.startEmailVerificationSend();
    sendInFlightRef.current = true;

    try {
      const now = Date.now();

      await authApi.sendSignupEmailVerification({
        campusId,
        email,
      });

      actions.emailVerificationSendSuccess({
        cooldownEndsAt: now + signupEmailVerificationPolicy.resendCooldownMs,
        email,
        expiresAt: now + signupEmailVerificationPolicy.codeExpiresInMs,
        ...requestContext,
      });
    } catch (error) {
      const normalizedError = normalizeApiError(error);
      const mappedError = mapSendEmailVerificationError(normalizedError);
      const now = Date.now();

      actions.emailVerificationSendFailure({
        ...mappedError,
        blockedEndsAt:
          mappedError.reason === 'ip_blocked'
            ? now + signupEmailVerificationPolicy.ipBlockedMs
            : mappedError.reason === 'verify_blocked'
              ? now + signupEmailVerificationPolicy.verifyBlockedMs
              : null,
        cooldownEndsAt: mappedError.reason === 'resend_cooldown' ? now + signupEmailVerificationPolicy.resendCooldownMs : null,
        ...requestContext,
      });
    } finally {
      sendInFlightRef.current = false;
    }
  };

  const verifyCode = async () => {
    if (verifyInFlightRef.current) {
      return;
    }

    if (!isValidSchoolEmail(email)) {
      actions.emailVerificationVerifyFailure({
        message: EMAIL_VERIFICATION_MESSAGES.invalidEmail,
        reason: 'invalid_email',
      });
      return;
    }

    const requestContext = actions.startEmailVerificationVerify();
    verifyInFlightRef.current = true;

    try {
      const response = await authApi.verifySignupEmailCode({
        code: emailVerification.verify.code,
        email,
      });
      const verifiedToken = response.data?.verifiedToken;

      if (typeof verifiedToken !== 'string' || !verifiedToken) {
        throw new Error('verifiedToken 응답 형식이 올바르지 않습니다.');
      }

      actions.emailVerificationVerifySuccess({
        email,
        expiresAt: Date.now() + signupEmailVerificationPolicy.verifiedTokenExpiresInMs,
        verifiedToken,
        ...requestContext,
      });
      dismissMobileKeyboard();
    } catch (error) {
      const normalizedError = normalizeApiError(error);
      const mappedError = mapVerifyEmailVerificationError(normalizedError);
      const now = Date.now();

      actions.emailVerificationVerifyFailure({
        ...mappedError,
        blockedEndsAt: mappedError.reason === 'verify_blocked' ? now + signupEmailVerificationPolicy.verifyBlockedMs : null,
        ...requestContext,
      });
    } finally {
      verifyInFlightRef.current = false;
    }
  };

  return {
    email,
    sendBlockedSecondsLeft,
    sendCode,
    ui: {
      canSend,
      canVerify,
      codeHelperMessage,
      emailHelperMessage,
      isCodeSent,
      isVerificationCodeReadOnly: isVerified || isVerifyBlocked,
      sendButtonLabel,
      verificationTimerLabel,
      verifyButtonLabel,
    },
    verifyBlockedSecondsLeft,
    verifyCode,
    resendCooldownSecondsLeft,
    verificationSecondsLeft,
  };
}
