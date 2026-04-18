import type { EmailVerificationState, SignupForm, SignupStep } from '@/features/signup/types';

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
  if (step === 4) return /^[a-z0-9_]{4,20}$/.test(form.username);
  if (step === 5) return form.password.length >= 8 && form.password === form.passwordConfirm;
  if (step === 6) return form.nickname.trim().length >= 2;

  return true;
}
