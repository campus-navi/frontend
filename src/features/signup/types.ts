import type { ReactNode } from 'react';

export const totalSignupSteps = 7;

export type SignupStep = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

export type SignupForm = {
  university: string;
  emailLocalPart: string;
  emailVerified: boolean;
  department: string;
  admissionYear: number;
  username: string;
  password: string;
  passwordConfirm: string;
  nickname: string;
};

export type VerificationState = {
  sent: boolean;
  code: string;
  error: string;
};

export type SignupState = {
  step: SignupStep;
  form: SignupForm;
  universityQuery: string;
  departmentQuery: string;
  verification: VerificationState;
};

export type SearchSelectStepProps = {
  label: string;
  title: ReactNode;
  placeholder: string;
  value: string;
  suggestions: string[];
  onChange: (value: string) => void;
  onClear: () => void;
  onSelect: (value: string) => void;
};
