import { useMemo, useRef } from 'react';

import { authApi, normalizeApiError } from '@/api';
import { signupEmailVerificationPolicy } from '@/features/signup/constants';
import {
  createSchoolEmail,
  EMAIL_VERIFICATION_MESSAGES,
  isValidSchoolEmail,
  mapSendEmailVerificationError,
  mapVerifyEmailVerificationError,
} from '@/features/signup/emailVerification';
import { useSignupFlowStore } from '@/features/signup/store/signupFlowStore';
import { useVerificationTimer } from '@/features/signup/hooks/useVerificationTimer';

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

    actions.startEmailVerificationSend();
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

    actions.startEmailVerificationVerify();
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
      });
      dismissMobileKeyboard();
    } catch (error) {
      const normalizedError = normalizeApiError(error);
      const mappedError = mapVerifyEmailVerificationError(normalizedError);
      const now = Date.now();

      actions.emailVerificationVerifyFailure({
        ...mappedError,
        blockedEndsAt: mappedError.reason === 'verify_blocked' ? now + signupEmailVerificationPolicy.verifyBlockedMs : null,
      });
    } finally {
      verifyInFlightRef.current = false;
    }
  };

  return {
    email,
    sendBlockedSecondsLeft: sendBlockedTimer.timeLeft,
    sendCode,
    verifyBlockedSecondsLeft: verifyBlockedTimer.timeLeft,
    verifyCode,
    resendCooldownSecondsLeft: resendCooldownTimer.timeLeft,
    verificationSecondsLeft: verificationTimer.timeLeft,
  };
}
