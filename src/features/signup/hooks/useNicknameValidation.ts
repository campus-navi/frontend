import { useEffect, useMemo, useRef, useState } from 'react';

import { authApi, normalizeApiError } from '@/api';
import { signupNicknamePolicy } from '@/features/signup/constants';
import { useDebouncedValue } from '@/features/signup/hooks/useDebouncedValue';
import type { NicknameAvailabilityStatus } from '@/features/signup/types';
import { validateSignupNickname } from '@/features/signup/utils';

const DEFAULT_HELPER_TEXT = '게시판에서 사용할 닉네임을 정해주세요.';
const AVAILABLE_MESSAGE = '사용 가능한 닉네임입니다.';
const DUPLICATE_MESSAGE = '이미 사용 중인 닉네임입니다.';
const ERROR_MESSAGE = '닉네임 확인 중 문제가 발생했습니다. 다시 시도해주세요.';

type NicknameAvailabilityState = {
  checkedNickname: string | null;
  message: string | null;
  status: NicknameAvailabilityStatus;
};

const INITIAL_AVAILABILITY_STATE: NicknameAvailabilityState = {
  checkedNickname: null,
  message: null,
  status: 'idle',
};

function shouldApplyResponse(params: {
  currentRequestId: number;
  latestRequestId: number;
  requestNickname: string;
  requestVersion: number;
  nickname: string;
  version: number;
}) {
  return (
    params.currentRequestId === params.latestRequestId &&
    params.requestNickname === params.nickname &&
    params.requestVersion === params.version
  );
}

function mapAvailabilityResult(error: unknown): Pick<NicknameAvailabilityState, 'message' | 'status'> {
  const normalizedError = normalizeApiError(error);

  if (normalizedError.status === 409 && normalizedError.code === 'DUPLICATE_NICKNAME') {
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

export function useNicknameValidation(nickname: string) {
  const debouncedNickname = useDebouncedValue(nickname, signupNicknamePolicy.checkDebounceMs);
  const latestRequestIdRef = useRef(0);
  const nicknameVersionRef = useRef(0);
  const currentNicknameRef = useRef(nickname);
  const [availability, setAvailability] = useState<NicknameAvailabilityState>(INITIAL_AVAILABILITY_STATE);
  const validation = useMemo(() => validateSignupNickname(nickname), [nickname]);
  const trimmedNickname = nickname.trim();

  useEffect(() => {
    currentNicknameRef.current = nickname;
    nicknameVersionRef.current += 1;
    setAvailability(INITIAL_AVAILABILITY_STATE);
  }, [nickname]);

  useEffect(() => {
    if (!trimmedNickname || debouncedNickname !== nickname || !validation.isValid) {
      return;
    }

    const requestNickname = debouncedNickname;
    const requestId = latestRequestIdRef.current + 1;
    const requestVersion = nicknameVersionRef.current;

    latestRequestIdRef.current = requestId;
    setAvailability({
      checkedNickname: requestNickname,
      message: null,
      status: 'checking',
    });

    const checkAvailability = async () => {
      try {
        await authApi.checkNicknameAvailability({
          nickname: requestNickname,
        });

        if (
          !shouldApplyResponse({
            currentRequestId: requestId,
            latestRequestId: latestRequestIdRef.current,
            requestNickname,
            requestVersion,
            nickname: currentNicknameRef.current,
            version: nicknameVersionRef.current,
          })
        ) {
          return;
        }

        setAvailability({
          checkedNickname: requestNickname,
          message: AVAILABLE_MESSAGE,
          status: 'available',
        });
      } catch (error) {
        if (
          !shouldApplyResponse({
            currentRequestId: requestId,
            latestRequestId: latestRequestIdRef.current,
            requestNickname,
            requestVersion,
            nickname: currentNicknameRef.current,
            version: nicknameVersionRef.current,
          })
        ) {
          return;
        }

        const result = mapAvailabilityResult(error);

        setAvailability({
          checkedNickname: requestNickname,
          ...result,
        });
      }
    };

    void checkAvailability();
  }, [debouncedNickname, nickname, trimmedNickname, validation.isValid]);

  const helperText =
    (!trimmedNickname
      ? DEFAULT_HELPER_TEXT
      : validation.message ??
        (availability.status === 'checking'
          ? undefined
          : availability.status === 'available' || availability.status === 'duplicate' || availability.status === 'error'
            ? availability.message
            : undefined)) ?? undefined;
  const helperTone: 'default' | 'success' | 'error' =
    !trimmedNickname
      ? 'default'
      : validation.message || availability.status === 'duplicate' || availability.status === 'error'
        ? 'error'
        : availability.status === 'available'
          ? 'success'
          : 'default';
  const isAvailable = availability.status === 'available' && availability.checkedNickname === nickname;

  return {
    availability,
    helperText,
    helperTone,
    isAvailable,
    validation,
  };
}
