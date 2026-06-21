import { useEffect, useMemo, useRef, useState } from 'react';

import { authApi, normalizeApiError } from '@/api';
import { signupNicknamePolicy } from '@/features/signup/constants';
import { useDebouncedValue } from '@/features/signup/hooks/useDebouncedValue';
import { validateSignupNickname } from '@/features/signup/utils';

type AvailabilityStatus = 'idle' | 'checking' | 'available' | 'duplicate' | 'error';

type AvailabilityState = {
  checkedNickname: string | null;
  message: string | null;
  status: AvailabilityStatus;
};

const INITIAL_AVAILABILITY: AvailabilityState = {
  checkedNickname: null,
  message: null,
  status: 'idle',
};

export function useProfileNicknameValidation(nickname: string, originalNickname: string) {
  const debouncedNickname = useDebouncedValue(
    nickname,
    signupNicknamePolicy.checkDebounceMs,
  );
  const currentNicknameRef = useRef(nickname);
  const latestRequestIdRef = useRef(0);
  const nicknameVersionRef = useRef(0);
  const [availability, setAvailability] = useState<AvailabilityState>(INITIAL_AVAILABILITY);
  const validation = useMemo(() => {
    const result = validateSignupNickname(nickname);

    if (/\s/.test(nickname)) {
      return {
        ...result,
        message: '닉네임에 공백(띄어쓰기)을 포함할 수 없습니다.',
      };
    }

    return result;
  }, [nickname]);
  const isChanged = nickname !== originalNickname;

  useEffect(() => {
    currentNicknameRef.current = nickname;
    nicknameVersionRef.current += 1;
    setAvailability(INITIAL_AVAILABILITY);
  }, [nickname]);

  useEffect(() => {
    if (
      !isChanged ||
      !validation.isValid ||
      debouncedNickname !== nickname
    ) {
      return;
    }

    const requestId = latestRequestIdRef.current + 1;
    const requestNickname = debouncedNickname;
    const requestVersion = nicknameVersionRef.current;
    latestRequestIdRef.current = requestId;
    setAvailability({
      checkedNickname: requestNickname,
      message: null,
      status: 'checking',
    });

    const checkAvailability = async () => {
      try {
        await authApi.checkNicknameAvailability({ nickname: requestNickname });

        if (
          requestId !== latestRequestIdRef.current ||
          requestNickname !== currentNicknameRef.current ||
          requestVersion !== nicknameVersionRef.current
        ) {
          return;
        }

        setAvailability({
          checkedNickname: requestNickname,
          message: '사용가능한 닉네임입니다.',
          status: 'available',
        });
      } catch (error) {
        if (
          requestId !== latestRequestIdRef.current ||
          requestNickname !== currentNicknameRef.current ||
          requestVersion !== nicknameVersionRef.current
        ) {
          return;
        }

        const normalizedError = normalizeApiError(error);
        const isDuplicate = normalizedError.status === 409;
        setAvailability({
          checkedNickname: requestNickname,
          message: isDuplicate
            ? '이미 사용 중인 닉네임입니다.'
            : '닉네임 확인 중 문제가 발생했습니다. 다시 시도해주세요.',
          status: isDuplicate ? 'duplicate' : 'error',
        });
      }
    };

    void checkAvailability();
  }, [debouncedNickname, isChanged, nickname, validation.isValid]);

  const isAvailable =
    !isChanged ||
    (availability.status === 'available' && availability.checkedNickname === nickname);
  const helperText = !isChanged
    ? undefined
    : validation.message ??
      (availability.status === 'checking'
        ? undefined
        : availability.message ?? undefined);
  const helperTone =
    validation.message ||
    availability.status === 'duplicate' ||
    availability.status === 'error'
      ? 'error'
      : availability.status === 'available'
        ? 'success'
        : 'default';

  return {
    availability,
    helperText,
    helperTone,
    isAvailable,
    isChanged,
    validation,
  } as const;
}
