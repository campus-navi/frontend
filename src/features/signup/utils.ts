import { signupNicknamePolicy, signupPasswordPolicy, signupUsernamePolicy } from '@/features/signup/constants';
import type {
  EmailVerificationState,
  NicknameValidationResult,
  PasswordValidationResult,
  SignupForm,
  SignupStep,
  UsernameValidationResult,
} from '@/features/signup/types';

export function formatRemainingTime(timeLeft: number) {
  const minutes = Math.floor(timeLeft / 60)
    .toString()
    .padStart(2, '0');
  const seconds = (timeLeft % 60).toString().padStart(2, '0');

  return `${minutes}:${seconds}`;
}

const HANGUL_BASE = 0xac00;
const HANGUL_LAST = 0xd7a3;
const HANGUL_INITIALS = ['ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];

function extractInitials(value: string) {
  return Array.from(value)
    .map((character) => {
      const codePoint = character.charCodeAt(0);

      if (codePoint >= HANGUL_BASE && codePoint <= HANGUL_LAST) {
        return HANGUL_INITIALS[Math.floor((codePoint - HANGUL_BASE) / 588)];
      }

      return /[ㄱ-ㅎa-z0-9]/i.test(character) ? character.toLowerCase() : '';
    })
    .join('');
}

export function normalizeUniversityKeyword(value: string) {
  return normalizeSearchKeyword(value)
    .replace(/campus/g, '캠퍼스');
}

export function normalizeSearchKeyword(value: string) {
  return value
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(/[()]/g, '');
}

function hasComposedHangul(value: string) {
  return /[가-힣]/.test(value);
}

function hasKoreanJamo(value: string) {
  return /[ㄱ-ㅎㅏ-ㅣ]/.test(value);
}

function hasLatinOrDigit(value: string) {
  return /[a-z0-9]/i.test(value);
}

export function shouldShowSearchResults(query: string, normalize: (value: string) => string = normalizeSearchKeyword) {
  const normalizedQuery = normalize(query);

  if (!normalizedQuery) {
    return false;
  }

  return hasComposedHangul(normalizedQuery) || hasKoreanJamo(normalizedQuery) || hasLatinOrDigit(normalizedQuery);
}

export function shouldShowUniversitySearchResults(query: string) {
  return shouldShowSearchResults(query, normalizeUniversityKeyword);
}

export function shouldHideUniversityEmptyState(query: string) {
  const normalizedQuery = normalizeUniversityKeyword(query);

  if (!normalizedQuery) {
    return false;
  }

  return hasComposedHangul(normalizedQuery) && hasKoreanJamo(normalizedQuery);
}

export function shouldHideSearchEmptyState(query: string) {
  const normalizedQuery = normalizeSearchKeyword(query);

  if (!normalizedQuery) {
    return false;
  }

  return hasComposedHangul(normalizedQuery) && hasKoreanJamo(normalizedQuery);
}

export function matchesSearchName(name: string, query: string, normalize: (value: string) => string = normalizeSearchKeyword) {
  const normalizedQuery = normalize(query);

  if (!normalizedQuery) {
    return false;
  }

  const normalizedName = normalize(name);

  if (normalizedName.includes(normalizedQuery)) {
    return true;
  }

  if (hasComposedHangul(normalizedQuery) || hasLatinOrDigit(normalizedQuery)) {
    return false;
  }

  const initialsQuery = extractInitials(normalizedQuery);
  return initialsQuery.length > 0 && extractInitials(normalizedName).includes(initialsQuery);
}

export function matchesUniversityName(universityName: string, query: string) {
  return matchesSearchName(universityName, query, normalizeUniversityKeyword);
}

export function getSuggestions<TItem>(items: readonly TItem[], query: string, getLabel: (item: TItem) => string) {
  return items.filter((item) => matchesSearchName(getLabel(item), query)).slice(0, 12);
}

export function isSignupStepValid(step: SignupStep, form: SignupForm, emailVerification?: EmailVerificationState) {
  if (step === 0) return Boolean(form.selectedUniversity);
  if (step === 1) return Boolean(emailVerification?.verifiedToken.isVerified);
  if (step === 2) return form.departmentId !== null;
  if (step === 3) return Boolean(form.admissionYear);
  if (step === 4) return form.grade !== null;
  if (step === 5) return Boolean(form.name.trim()) && Boolean(form.studentNumber.trim());
  if (step === 6) return validateSignupUsername(form.username).isValid && validateSignupPassword(form.password).isValid;
  if (step === 7) return validateSignupNickname(form.nickname).isValid;

  return true;
}

export function validateSignupUsername(username: string): UsernameValidationResult {
  if (!username) {
    return {
      isValid: false,
      message: null,
    };
  }

  if (!/^[a-z0-9_]+$/.test(username)) {
    return {
      isValid: false,
      message: '영문 소문자, 숫자, 밑줄(_)만 사용가능합니다.',
    };
  }

  if (username.length < signupUsernamePolicy.minLength || username.length > signupUsernamePolicy.maxLength) {
    return {
      isValid: false,
      message: `아이디는 ${signupUsernamePolicy.minLength}~${signupUsernamePolicy.maxLength}자 이내로 입력해주세요.`,
    };
  }

  return {
    isValid: true,
    message: null,
  };
}

export function validateSignupPassword(password: string): PasswordValidationResult {
  const checks = {
    hasLetter: /[a-z]/i.test(password),
    hasNumber: /\d/.test(password),
    hasSpecialCharacter: /[^A-Za-z0-9\s]/.test(password),
    hasWhitespace: /\s/.test(password),
    isLengthValid: password.length >= signupPasswordPolicy.minLength && password.length <= signupPasswordPolicy.maxLength,
  };

  if (!password) {
    return {
      isValid: false,
      message: '영문, 숫자, 특수문자를 포함한 8~16자를 입력해주세요.',
      checks,
    };
  }

  if (checks.hasWhitespace) {
    return {
      isValid: false,
      message: '비밀번호에는 공백을 포함할 수 없습니다.',
      checks,
    };
  }

  if (!checks.isLengthValid) {
    return {
      isValid: false,
      message: `비밀번호는 ${signupPasswordPolicy.minLength}~${signupPasswordPolicy.maxLength}자 이내로 입력해주세요.`,
      checks,
    };
  }

  if (!checks.hasLetter || !checks.hasNumber || !checks.hasSpecialCharacter) {
    return {
      isValid: false,
      message: '영문, 숫자, 특수문자를 모두 포함해야 합니다.',
      checks,
    };
  }

  return {
    isValid: true,
    message: '사용 가능한 비밀번호입니다.',
    checks,
  };
}

export function validateSignupNickname(nickname: string): NicknameValidationResult {
  const trimmedNickname = nickname.trim();

  if (!trimmedNickname) {
    return {
      isValid: false,
      message: null,
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

  if (trimmedNickname.length < signupNicknamePolicy.minLength || trimmedNickname.length > signupNicknamePolicy.maxLength) {
    return {
      isValid: false,
      message: `닉네임은 ${signupNicknamePolicy.minLength}~${signupNicknamePolicy.maxLength}자 이내로 입력해주세요.`,
    };
  }

  return {
    isValid: true,
    message: null,
  };
}
