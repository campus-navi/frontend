import { create } from 'zustand';

import type {
  EmailVerificationState,
  EmailVerificationSendErrorReason,
  EmailVerificationVerifyErrorReason,
  SelectedUniversity,
  SignupForm,
  SignupState,
  SignupStep,
} from '@/features/signup/types';

type SignupFlowStore = SignupState & {
  actions: {
    clearEmailVerificationSendError: () => void;
    clearEmailVerificationVerifyError: () => void;
    clearDepartmentQuery: () => void;
    clearUniversityQuery: () => void;
    nextStep: () => void;
    previousStep: () => void;
    returnToEmailVerificationStep: () => void;
    resetFlow: () => void;
    selectAdmissionYear: (value: number) => void;
    selectDepartment: (value: string) => void;
    selectUniversity: (value: SelectedUniversity) => void;
    setStep: (step: SignupStep) => void;
    startEmailVerificationSend: () => void;
    startEmailVerificationVerify: () => void;
    updateDepartmentQuery: (value: string) => void;
    updateEmailLocalPart: (value: string) => void;
    updateNickname: (value: string) => void;
    updatePassword: (value: string) => void;
    updatePasswordConfirm: (value: string) => void;
    updateUniversityQuery: (value: string) => void;
    updateUsername: (value: string) => void;
    updateVerificationCode: (value: string) => void;
    emailVerificationSendFailure: (payload: {
      blockedEndsAt?: number | null;
      cooldownEndsAt?: number | null;
      message: string;
      reason: EmailVerificationSendErrorReason;
    }) => void;
    emailVerificationSendSuccess: (payload: {
      blockedEndsAt?: number | null;
      cooldownEndsAt: number;
      email: string;
      expiresAt: number;
    }) => void;
    emailVerificationVerifyFailure: (payload: {
      blockedEndsAt?: number | null;
      message: string;
      reason: EmailVerificationVerifyErrorReason;
    }) => void;
    emailVerificationVerifySuccess: (payload: {
      email: string;
      expiresAt: number;
      verifiedToken: string;
    }) => void;
  };
};

const initialEmailVerificationState: EmailVerificationState = {
  send: {
    blockedEndsAt: null,
    cooldownEndsAt: null,
    errorMessage: null,
    errorReason: null,
    expiresAt: null,
    lastSentEmail: null,
    status: 'idle',
  },
  verify: {
    blockedEndsAt: null,
    code: '',
    errorMessage: null,
    errorReason: null,
    status: 'idle',
  },
  verifiedToken: {
    email: null,
    expiresAt: null,
    isVerified: false,
    value: null,
  },
};

const initialFormState: SignupForm = {
  admissionYear: 2026,
  department: '',
  emailLocalPart: '',
  nickname: '',
  password: '',
  passwordConfirm: '',
  selectedUniversity: null,
  username: '',
};

const resetUniversityDependentFields = (form: SignupForm): SignupForm => ({
  ...form,
  emailLocalPart: '',
});

const resetEmailVerificationState = (): EmailVerificationState => ({
  send: { ...initialEmailVerificationState.send },
  verify: { ...initialEmailVerificationState.verify },
  verifiedToken: { ...initialEmailVerificationState.verifiedToken },
});

const createInitialSignupState = (): SignupState => ({
  departmentQuery: '',
  emailVerification: resetEmailVerificationState(),
  form: initialFormState,
  step: 0,
  universityQuery: '',
});

export const useSignupFlowStore = create<SignupFlowStore>((set) => ({
  actions: {
    clearEmailVerificationSendError: () =>
      set((state) => ({
        emailVerification: {
          ...state.emailVerification,
          send: {
            ...state.emailVerification.send,
            errorMessage: null,
            errorReason: null,
            status: state.emailVerification.send.status === 'error' ? 'idle' : state.emailVerification.send.status,
          },
        },
      })),
    clearEmailVerificationVerifyError: () =>
      set((state) => ({
        emailVerification: {
          ...state.emailVerification,
          verify: {
            ...state.emailVerification.verify,
            errorMessage: null,
            errorReason: null,
            status: state.emailVerification.verify.status === 'error' ? 'idle' : state.emailVerification.verify.status,
          },
        },
      })),
    clearDepartmentQuery: () =>
      set((state) => ({
        departmentQuery: '',
        form: state.form.department ? { ...state.form, department: '' } : state.form,
      })),
    clearUniversityQuery: () =>
      set((state) => ({
        emailVerification: resetEmailVerificationState(),
        form: resetUniversityDependentFields({ ...state.form, selectedUniversity: null }),
        universityQuery: '',
      })),
    nextStep: () =>
      set((state) => ({
        step: Math.min(7, state.step + 1) as SignupStep,
      })),
    previousStep: () =>
      set((state) => ({
        step: Math.max(0, state.step - 1) as SignupStep,
      })),
    returnToEmailVerificationStep: () =>
      set((state) => ({
        emailVerification: resetEmailVerificationState(),
        form: {
          ...state.form,
          emailLocalPart: '',
        },
        step: 1,
      })),
    resetFlow: () => set(createInitialSignupState()),
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
        emailVerification: resetEmailVerificationState(),
        form: {
          ...resetUniversityDependentFields(state.form),
          selectedUniversity: value,
        },
        universityQuery: value.universityName,
      })),
    setStep: (step) => set({ step }),
    startEmailVerificationSend: () =>
      set((state) => ({
        emailVerification: {
          send: {
            ...state.emailVerification.send,
            errorMessage: null,
            errorReason: null,
            status: 'loading',
          },
          verify: {
            ...initialEmailVerificationState.verify,
          },
          verifiedToken: {
            ...initialEmailVerificationState.verifiedToken,
          },
        },
      })),
    startEmailVerificationVerify: () =>
      set((state) => ({
        emailVerification: {
          ...state.emailVerification,
          verify: {
            ...state.emailVerification.verify,
            errorMessage: null,
            errorReason: null,
            status: 'loading',
          },
        },
      })),
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
        emailVerification: {
          send:
            state.emailVerification.send.lastSentEmail !== null
              ? {
                  ...initialEmailVerificationState.send,
                  lastSentEmail: state.emailVerification.send.lastSentEmail,
                }
              : {
                  ...initialEmailVerificationState.send,
                },
          verify: {
            ...initialEmailVerificationState.verify,
          },
          verifiedToken: {
            ...initialEmailVerificationState.verifiedToken,
          },
        },
        form: {
          ...state.form,
          emailLocalPart: value.replace(/[^a-zA-Z0-9._-]/g, ''),
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
        emailVerification: resetEmailVerificationState(),
        form:
          state.form.selectedUniversity && state.form.selectedUniversity.universityName !== value
            ? resetUniversityDependentFields({ ...state.form, selectedUniversity: null })
            : state.form,
        universityQuery: value,
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
        emailVerification: {
          ...state.emailVerification,
          verify: {
            ...state.emailVerification.verify,
            errorMessage: null,
            errorReason: null,
            status: state.emailVerification.verify.status === 'error' ? 'idle' : state.emailVerification.verify.status,
            code: value.replace(/\D/g, '').slice(0, 6),
          },
        },
      })),
    emailVerificationSendFailure: ({ blockedEndsAt = null, cooldownEndsAt = null, message, reason }) =>
      set((state) => ({
        emailVerification: {
          ...state.emailVerification,
          send: {
            ...state.emailVerification.send,
            blockedEndsAt,
            cooldownEndsAt: cooldownEndsAt ?? state.emailVerification.send.cooldownEndsAt,
            expiresAt: reason === 'verify_blocked' ? null : state.emailVerification.send.expiresAt,
            errorMessage: message,
            errorReason: reason,
            status: 'error',
          },
          verify:
            reason === 'verify_blocked'
              ? {
                  ...state.emailVerification.verify,
                  blockedEndsAt,
                  code: '',
                }
              : state.emailVerification.verify,
        },
      })),
    emailVerificationSendSuccess: ({ blockedEndsAt = null, cooldownEndsAt, email, expiresAt }) =>
      set(() => ({
        emailVerification: {
          send: {
            blockedEndsAt,
            cooldownEndsAt,
            errorMessage: null,
            errorReason: null,
            expiresAt,
            lastSentEmail: email,
            status: 'success',
          },
          verify: {
            ...initialEmailVerificationState.verify,
          },
          verifiedToken: {
            ...initialEmailVerificationState.verifiedToken,
          },
        },
      })),
    emailVerificationVerifyFailure: ({ blockedEndsAt = null, message, reason }) =>
      set((state) => ({
        emailVerification: {
          ...state.emailVerification,
          verifiedToken: {
            ...initialEmailVerificationState.verifiedToken,
          },
          verify: {
            ...state.emailVerification.verify,
            blockedEndsAt,
            code: reason === 'verify_blocked' ? '' : state.emailVerification.verify.code,
            errorMessage: message,
            errorReason: reason,
            status: 'error',
          },
          send:
            reason === 'verify_blocked'
              ? {
                  ...state.emailVerification.send,
                  expiresAt: null,
                }
              : state.emailVerification.send,
        },
      })),
    emailVerificationVerifySuccess: ({ email, expiresAt, verifiedToken }) =>
      set((state) => ({
        emailVerification: {
          ...state.emailVerification,
          verify: {
            ...state.emailVerification.verify,
            errorMessage: null,
            errorReason: null,
            status: 'success',
          },
          verifiedToken: {
            email,
            expiresAt,
            isVerified: true,
            value: verifiedToken,
          },
        },
      })),
  },
  ...createInitialSignupState(),
}));
