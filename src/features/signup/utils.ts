import type { SignupForm, SignupStep } from '@/features/signup/types';

export function getSuggestions(items: string[], query: string) {
  const keyword = query.trim().toLowerCase();

  if (!keyword) {
    return [];
  }

  return items.filter((item) => item.toLowerCase().includes(keyword)).slice(0, 12);
}

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
  return value
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(/[()]/g, '')
    .replace(/campus/g, '캠퍼스');
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

export function shouldShowUniversitySearchResults(query: string) {
  const normalizedQuery = normalizeUniversityKeyword(query);

  if (!normalizedQuery) {
    return false;
  }

  return hasComposedHangul(normalizedQuery) || hasKoreanJamo(normalizedQuery) || hasLatinOrDigit(normalizedQuery);
}

export function shouldHideUniversityEmptyState(query: string) {
  const normalizedQuery = normalizeUniversityKeyword(query);

  if (!normalizedQuery) {
    return false;
  }

  return hasComposedHangul(normalizedQuery) && hasKoreanJamo(normalizedQuery);
}

export function matchesUniversityName(universityName: string, query: string) {
  const normalizedQuery = normalizeUniversityKeyword(query);

  if (!normalizedQuery) {
    return false;
  }

  const normalizedName = normalizeUniversityKeyword(universityName);

  if (normalizedName.includes(normalizedQuery)) {
    return true;
  }

  if (hasComposedHangul(normalizedQuery) || hasLatinOrDigit(normalizedQuery)) {
    return false;
  }

  const initialsQuery = extractInitials(normalizedQuery);
  return initialsQuery.length > 0 && extractInitials(normalizedName).includes(initialsQuery);
}

export function isSignupStepValid(step: SignupStep, form: SignupForm) {
  if (step === 0) return Boolean(form.selectedUniversity);
  if (step === 1) return form.emailVerified;
  if (step === 2) return Boolean(form.department);
  if (step === 3) return Boolean(form.admissionYear);
  if (step === 4) return /^[a-z0-9_]{4,20}$/.test(form.username);
  if (step === 5) return form.password.length >= 8 && form.password === form.passwordConfirm;
  if (step === 6) return form.nickname.trim().length >= 2;

  return true;
}
