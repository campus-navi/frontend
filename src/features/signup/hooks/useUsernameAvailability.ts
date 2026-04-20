import { useEffect, useMemo, useRef, useState } from 'react';

import { authApi, normalizeApiError } from '@/api';
import { signupUsernamePolicy } from '@/features/signup/constants';
import { useDebouncedValue } from '@/features/signup/hooks/useDebouncedValue';
import type { UsernameAvailabilityStatus } from '@/features/signup/types';
import { validateSignupUsername } from '@/features/signup/utils';

const DEFAULT_HELPER_TEXT = '영문 소문자, 숫자, `_` 조합으로 4~30자 입력해주세요.';
const AVAILABLE_MESSAGE = '사용 가능한 아이디입니다.';
const CHECKING_MESSAGE = '아이디 중복 여부를 확인하고 있습니다.';
const DUPLICATE_MESSAGE = '이미 사용 중인 아이디입니다.';
const ERROR_MESSAGE = '아이디 확인 중 문제가 발생했습니다. 다시 시도해주세요.';

type UsernameAvailabilityState = {
  checkedUsername: string | null;
  message: string | null;
  status: UsernameAvailabilityStatus;
};

const INITIAL_AVAILABILITY_STATE: UsernameAvailabilityState = {
  checkedUsername: null,
  message: null,
  status: 'idle',
};

function shouldApplyResponse(params: {
  currentRequestId: number;
  latestRequestId: number;
  requestUsername: string;
  requestVersion: number;
  username: string;
  version: number;
}) {
  return (
    params.currentRequestId === params.latestRequestId &&
    params.requestUsername === params.username &&
    params.requestVersion === params.version
  );
}

function mapAvailabilityResult(error: unknown): Pick<UsernameAvailabilityState, 'message' | 'status'> {
  const normalizedError = normalizeApiError(error);

  if (normalizedError.status === 409 && normalizedError.code === 'DUPLICATE_USERNAME') {
    return {
      message: DUPLICATE_MESSAGE,
      status: 'duplicate',
    };
  }

  if (normalizedError.status === 409) {
    return {
      message: DUPLICATE_MESSAGE,
      status: 'duplicate',
    };
  }

  return {
    message: ERROR_MESSAGE,
    status: 'error',
  };
}

export function useUsernameAvailability(username: string) {
  const debouncedUsername = useDebouncedValue(username, signupUsernamePolicy.checkDebounceMs);
  const latestRequestIdRef = useRef(0);
  const usernameVersionRef = useRef(0);
  const currentUsernameRef = useRef(username);
  const [availability, setAvailability] = useState<UsernameAvailabilityState>(INITIAL_AVAILABILITY_STATE);
  const validation = useMemo(() => validateSignupUsername(username), [username]);

  useEffect(() => {
    currentUsernameRef.current = username;
    usernameVersionRef.current += 1;
    setAvailability(INITIAL_AVAILABILITY_STATE);
  }, [username]);

  useEffect(() => {
    if (!username || debouncedUsername !== username || !validation.isValid) {
      return;
    }

    const requestUsername = debouncedUsername;
    const requestId = latestRequestIdRef.current + 1;
    const requestVersion = usernameVersionRef.current;

    latestRequestIdRef.current = requestId;
    setAvailability({
      checkedUsername: requestUsername,
      message: null,
      status: 'checking',
    });

    const checkAvailability = async () => {
      try {
        await authApi.checkUsernameAvailability({
          username: requestUsername,
        });

        if (
          !shouldApplyResponse({
            currentRequestId: requestId,
            latestRequestId: latestRequestIdRef.current,
            requestUsername,
            requestVersion,
            username: currentUsernameRef.current,
            version: usernameVersionRef.current,
          })
        ) {
          return;
        }

        setAvailability({
          checkedUsername: requestUsername,
          message: AVAILABLE_MESSAGE,
          status: 'available',
        });
      } catch (error) {
        if (
          !shouldApplyResponse({
            currentRequestId: requestId,
            latestRequestId: latestRequestIdRef.current,
            requestUsername,
            requestVersion,
            username: currentUsernameRef.current,
            version: usernameVersionRef.current,
          })
        ) {
          return;
        }

        const result = mapAvailabilityResult(error);

        setAvailability({
          checkedUsername: requestUsername,
          ...result,
        });
      }
    };

    void checkAvailability();
  }, [debouncedUsername, username, validation.isValid]);

  const helperText: string =
    validation.message ??
    (availability.status === 'checking'
      ? CHECKING_MESSAGE
      : availability.status === 'available' || availability.status === 'duplicate' || availability.status === 'error'
        ? (availability.message ?? DEFAULT_HELPER_TEXT)
        : DEFAULT_HELPER_TEXT);
  const helperTone: 'default' | 'success' | 'error' =
    validation.message || availability.status === 'duplicate' || availability.status === 'error'
      ? 'error'
      : availability.status === 'available'
        ? 'success'
        : 'default';
  const isAvailable = availability.status === 'available' && availability.checkedUsername === username;

  return {
    availability,
    helperText,
    helperTone,
    isAvailable,
    validation,
  };
}
