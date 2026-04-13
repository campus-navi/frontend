import { universityEmailDomains } from '@/features/signup/data';
import type { SignupForm, SignupStep } from '@/features/signup/types';

export function getSchoolEmailDomain(university: string) {
  if (!university) {
    return 'school.ac.kr';
  }

  const exactDomain = universityEmailDomains[university];

  if (exactDomain) {
    return exactDomain;
  }

  const matchedEntry = Object.entries(universityEmailDomains).find(([name]) => university.includes(name));

  return matchedEntry?.[1] ?? 'school.ac.kr';
}

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

export function isSignupStepValid(step: SignupStep, form: SignupForm) {
  if (step === 0) return Boolean(form.university);
  if (step === 1) return form.emailVerified;
  if (step === 2) return Boolean(form.department);
  if (step === 3) return Boolean(form.admissionYear);
  if (step === 4) return /^[a-z0-9_]{4,20}$/.test(form.username);
  if (step === 5) return form.password.length >= 8 && form.password === form.passwordConfirm;
  if (step === 6) return form.nickname.trim().length >= 2;

  return true;
}
