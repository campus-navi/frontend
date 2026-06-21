const PROFILE_NICKNAME_MIN_LENGTH = 2;
const PROFILE_NICKNAME_MAX_LENGTH = 20;
const PROFILE_STUDENT_NUMBER_MIN_LENGTH = 6;
const PROFILE_STUDENT_NUMBER_MAX_LENGTH = 10;

export const profileNicknameCheckDebounceMs = 500;

export function validateProfileNickname(nickname: string) {
  const trimmedNickname = nickname.trim();

  if (!trimmedNickname) {
    return {
      isValid: false,
      message: '닉네임을 입력해주세요.',
    };
  }

  if (/\s/.test(nickname)) {
    return {
      isValid: false,
      message: '닉네임에는 공백을 포함할 수 없습니다.',
    };
  }

  if (!/^[A-Za-z0-9가-힣_]+$/.test(trimmedNickname)) {
    return {
      isValid: false,
      message: '한글, 영문, 숫자, 밑줄(_)만 사용 가능합니다.',
    };
  }

  if (
    trimmedNickname.length < PROFILE_NICKNAME_MIN_LENGTH ||
    trimmedNickname.length > PROFILE_NICKNAME_MAX_LENGTH
  ) {
    return {
      isValid: false,
      message: `닉네임은 ${PROFILE_NICKNAME_MIN_LENGTH}~${PROFILE_NICKNAME_MAX_LENGTH}자 이내로 입력해주세요.`,
    };
  }

  return {
    isValid: true,
    message: null,
  };
}

export function validateProfileStudentNumber(studentNumber: string) {
  if (!studentNumber) {
    return {
      isValid: false,
      message: '학번을 입력해주세요.',
    };
  }

  if (!/^\d+$/.test(studentNumber)) {
    return {
      isValid: false,
      message: '학번은 숫자만 입력해주세요.',
    };
  }

  if (
    studentNumber.length < PROFILE_STUDENT_NUMBER_MIN_LENGTH ||
    studentNumber.length > PROFILE_STUDENT_NUMBER_MAX_LENGTH
  ) {
    return {
      isValid: false,
      message: `학번은 ${PROFILE_STUDENT_NUMBER_MIN_LENGTH}~${PROFILE_STUDENT_NUMBER_MAX_LENGTH}자리 숫자로 입력해주세요.`,
    };
  }

  return {
    isValid: true,
    message: null,
  };
}
