import { create } from 'zustand';

import type { SelectedUniversity, SignupForm, SignupState, SignupStep, VerificationState } from '@/features/signup/types';

type SignupFlowStore = SignupState & {
  actions: {
    clearDepartmentQuery: () => void;
    clearUniversityQuery: () => void;
    nextStep: () => void;
    previousStep: () => void;
    resetFlow: () => void;
    selectAdmissionYear: (value: number) => void;
    selectDepartment: (value: string) => void;
    selectUniversity: (value: SelectedUniversity) => void;
    sendVerification: () => void;
    setStep: (step: SignupStep) => void;
    updateDepartmentQuery: (value: string) => void;
    updateEmailLocalPart: (value: string) => void;
    updateNickname: (value: string) => void;
    updatePassword: (value: string) => void;
    updatePasswordConfirm: (value: string) => void;
    updateUniversityQuery: (value: string) => void;
    updateUsername: (value: string) => void;
    updateVerificationCode: (value: string) => void;
    verificationFailure: (message: string) => void;
    verificationSuccess: () => void;
  };
};

const initialVerificationState: VerificationState = {
  sent: false,
  code: '',
  error: '',
};

const initialFormState: SignupForm = {
  admissionYear: 2026,
  department: '',
  emailLocalPart: '',
  emailVerified: false,
  nickname: '',
  password: '',
  passwordConfirm: '',
  selectedUniversity: null,
  username: '',
};

const resetUniversityDependentFields = (form: SignupForm): SignupForm => ({
  ...form,
  emailLocalPart: '',
  emailVerified: false,
});

const initialSignupState: SignupState = {
  departmentQuery: '',
  form: initialFormState,
  step: 0,
  universityQuery: '',
  verification: initialVerificationState,
};

export const useSignupFlowStore = create<SignupFlowStore>((set) => ({
  actions: {
    clearDepartmentQuery: () =>
      set((state) => ({
        departmentQuery: '',
        form: state.form.department ? { ...state.form, department: '' } : state.form,
      })),
    clearUniversityQuery: () =>
      set((state) => ({
        form: resetUniversityDependentFields({ ...state.form, selectedUniversity: null }),
        universityQuery: '',
        verification: initialVerificationState,
      })),
    nextStep: () =>
      set((state) => ({
        step: Math.min(7, state.step + 1) as SignupStep,
      })),
    previousStep: () =>
      set((state) => ({
        step: Math.max(0, state.step - 1) as SignupStep,
      })),
    resetFlow: () => set(initialSignupState),
    selectAdmissionYear: (value) =>
      set((state) => ({
        form: { ...state.form, admissionYear: value },
      })),
    selectDepartment: (value) =>
      set((state) => ({
        departmentQuery: value,
        form: { ...state.form, department: value },
      })),
    selectUniversity: (value) =>
      set((state) => ({
        form: {
          ...resetUniversityDependentFields(state.form),
          selectedUniversity: value,
        },
        universityQuery: value.universityName,
        verification: initialVerificationState,
      })),
    sendVerification: () =>
      set((state) => ({
        form: { ...state.form, emailVerified: false },
        verification: { sent: true, code: '', error: '' },
      })),
    setStep: (step) => set({ step }),
    updateDepartmentQuery: (value) =>
      set((state) => ({
        departmentQuery: value,
        form:
          state.form.department && state.form.department !== value
            ? { ...state.form, department: '' }
            : state.form,
      })),
    updateEmailLocalPart: (value) =>
      set((state) => ({
        form: {
          ...state.form,
          emailLocalPart: value.replace(/[^a-zA-Z0-9._-]/g, ''),
          emailVerified: false,
        },
        verification: {
          ...state.verification,
          code: '',
          error: '',
        },
      })),
    updateNickname: (value) =>
      set((state) => ({
        form: { ...state.form, nickname: value },
      })),
    updatePassword: (value) =>
      set((state) => ({
        form: { ...state.form, password: value },
      })),
    updatePasswordConfirm: (value) =>
      set((state) => ({
        form: { ...state.form, passwordConfirm: value },
      })),
    updateUniversityQuery: (value) =>
      set((state) => ({
        form:
          state.form.selectedUniversity && state.form.selectedUniversity.universityName !== value
            ? resetUniversityDependentFields({ ...state.form, selectedUniversity: null })
            : state.form,
        universityQuery: value,
        verification: initialVerificationState,
      })),
    updateUsername: (value) =>
      set((state) => ({
        form: {
          ...state.form,
          username: value.toLowerCase().replace(/[^a-z0-9_]/g, ''),
        },
      })),
    updateVerificationCode: (value) =>
      set((state) => ({
        verification: {
          ...state.verification,
          code: value.replace(/\D/g, '').slice(0, 6),
          error: '',
        },
      })),
    verificationFailure: (message) =>
      set((state) => ({
        form: { ...state.form, emailVerified: false },
        verification: { ...state.verification, error: message },
      })),
    verificationSuccess: () =>
      set((state) => ({
        form: { ...state.form, emailVerified: true },
        verification: { ...state.verification, error: '' },
      })),
  },
  ...initialSignupState,
}));
