import { create } from 'zustand';

import { defaultAdmissionYear } from '@/features/signup/constants';
import type {
  EmailVerificationState,
  EmailVerificationSendErrorReason,
  EmailVerificationVerifyErrorReason,
  SelectedUniversity,
  SignupForm,
  SignupState,
  SignupStep,
} from '@/features/signup/types';

type EmailVerificationRequestContext = {
  flowId: number;
  requestId: number;
};

type OptionalEmailVerificationRequestContext = Partial<EmailVerificationRequestContext>;

type SignupFlowStore = SignupState & {
  emailVerificationRequest: {
    sendRequestId: number;
    verifyRequestId: number;
  };
  flowId: number;
  actions: {
    clearEmailVerificationSendError: () => void;
    clearEmailVerificationVerifyError: () => void;
    clearDepartmentQuery: () => void;
    clearUniversityQuery: () => void;
    nextStep: () => void;
    previousStep: () => void;
    returnToEmailVerificationStep: () => void;
    returnToUniversityStep: () => void;
    resetFlow: () => void;
    selectAdmissionYear: (value: number) => void;
    selectDepartment: (value: { id: number | string; name: string }) => void;
    selectUniversity: (value: SelectedUniversity) => void;
    setStep: (step: SignupStep) => void;
    startEmailVerificationSend: () => EmailVerificationRequestContext;
    startEmailVerificationVerify: () => EmailVerificationRequestContext;
    updateDepartmentQuery: (value: string) => void;
    updateEmailLocalPart: (value: string) => void;
    updateNickname: (value: string) => void;
    updatePassword: (value: string) => void;
    updatePasswordConfirm: (value: string) => void;
    updateUniversityQuery: (value: string) => void;
    updateUsername: (value: string) => void;
    updateVerificationCode: (value: string) => void;
    emailVerificationSendFailure: (payload: OptionalEmailVerificationRequestContext & {
      blockedEndsAt?: number | null;
      cooldownEndsAt?: number | null;
      message: string;
      reason: EmailVerificationSendErrorReason;
    }) => void;
    emailVerificationSendSuccess: (payload: OptionalEmailVerificationRequestContext & {
      blockedEndsAt?: number | null;
      cooldownEndsAt: number;
      email: string;
      expiresAt: number;
    }) => void;
    emailVerificationVerifyFailure: (payload: OptionalEmailVerificationRequestContext & {
      blockedEndsAt?: number | null;
      message: string;
      reason: EmailVerificationVerifyErrorReason;
    }) => void;
    emailVerificationVerifySuccess: (payload: OptionalEmailVerificationRequestContext & {
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
  admissionYear: defaultAdmissionYear,
  department: '',
  departmentId: null,
  emailLocalPart: '',
  nickname: '',
  password: '',
  passwordConfirm: '',
  selectedUniversity: null,
  username: '',
};

const resetUniversityDependentFields = (form: SignupForm): SignupForm => ({
  ...form,
  department: '',
  departmentId: null,
  emailLocalPart: '',
});

const resetEmailVerificationDependentFields = (form: SignupForm): SignupForm => ({
  ...form,
  admissionYear: defaultAdmissionYear,
  department: '',
  departmentId: null,
  emailLocalPart: '',
  nickname: '',
  password: '',
  passwordConfirm: '',
  username: '',
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

const createNextFlowId = (currentFlowId: number) => currentFlowId + 1;

const hasActiveSendRequest = (state: SignupFlowStore, context: EmailVerificationRequestContext) =>
  state.flowId === context.flowId && state.emailVerificationRequest.sendRequestId === context.requestId;

const hasActiveVerifyRequest = (state: SignupFlowStore, context: EmailVerificationRequestContext) =>
  state.flowId === context.flowId && state.emailVerificationRequest.verifyRequestId === context.requestId;

const hasRequestContext = (context: OptionalEmailVerificationRequestContext): context is EmailVerificationRequestContext =>
  typeof context.flowId === 'number' && typeof context.requestId === 'number';

export const useSignupFlowStore = create<SignupFlowStore>((set, get) => ({
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
        form: state.form.department || state.form.departmentId !== null ? { ...state.form, department: '', departmentId: null } : state.form,
      })),
    clearUniversityQuery: () =>
      set((state) => ({
        emailVerificationRequest: {
          sendRequestId: state.emailVerificationRequest.sendRequestId + 1,
          verifyRequestId: state.emailVerificationRequest.verifyRequestId + 1,
        },
        emailVerification: resetEmailVerificationState(),
        form: resetUniversityDependentFields({ ...state.form, selectedUniversity: null }),
        departmentQuery: '',
        universityQuery: '',
      })),
    nextStep: () =>
      set((state) => ({
        step: Math.min(6, state.step + 1) as SignupStep,
      })),
    previousStep: () =>
      set((state) => ({
        step: Math.max(0, state.step - 1) as SignupStep,
        form: state.form,
      })),
    returnToEmailVerificationStep: () =>
      set((state) => ({
        emailVerificationRequest: {
          sendRequestId: state.emailVerificationRequest.sendRequestId + 1,
          verifyRequestId: state.emailVerificationRequest.verifyRequestId + 1,
        },
        departmentQuery: '',
        emailVerification: resetEmailVerificationState(),
        form: resetEmailVerificationDependentFields(state.form),
        step: 1,
      })),
    returnToUniversityStep: () =>
      set((state) => ({
        emailVerificationRequest: {
          sendRequestId: state.emailVerificationRequest.sendRequestId + 1,
          verifyRequestId: state.emailVerificationRequest.verifyRequestId + 1,
        },
        departmentQuery: '',
        emailVerification: resetEmailVerificationState(),
        form: resetEmailVerificationDependentFields(state.form),
        step: 0,
      })),
    resetFlow: () =>
      set((state) => ({
        ...createInitialSignupState(),
        emailVerificationRequest: {
          sendRequestId: 0,
          verifyRequestId: 0,
        },
        flowId: createNextFlowId(state.flowId),
      })),
    selectAdmissionYear: (value) =>
      set((state) => ({
        form: { ...state.form, admissionYear: value },
      })),
    selectDepartment: (value) =>
      set((state) => ({
        departmentQuery: value.name,
        form: { ...state.form, department: value.name, departmentId: Number(value.id) },
      })),
    selectUniversity: (value) =>
      set((state) => ({
        emailVerificationRequest: {
          sendRequestId: state.emailVerificationRequest.sendRequestId + 1,
          verifyRequestId: state.emailVerificationRequest.verifyRequestId + 1,
        },
        emailVerification: resetEmailVerificationState(),
        form: {
          ...resetUniversityDependentFields(state.form),
          selectedUniversity: value,
        },
        departmentQuery: '',
        universityQuery: value.universityName,
      })),
    setStep: (step) => set({ step }),
    startEmailVerificationSend: () => {
      const { emailVerificationRequest, flowId } = get();
      const requestId = emailVerificationRequest.sendRequestId + 1;

      set((state) => ({
        emailVerificationRequest: {
          ...state.emailVerificationRequest,
          sendRequestId: requestId,
          verifyRequestId: state.emailVerificationRequest.verifyRequestId + 1,
        },
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
      }));

      return { flowId, requestId };
    },
    startEmailVerificationVerify: () => {
      const { emailVerificationRequest, flowId } = get();
      const requestId = emailVerificationRequest.verifyRequestId + 1;

      set((state) => ({
        emailVerificationRequest: {
          ...state.emailVerificationRequest,
          verifyRequestId: requestId,
        },
        emailVerification: {
          ...state.emailVerification,
          verify: {
            ...state.emailVerification.verify,
            errorMessage: null,
            errorReason: null,
            status: 'loading',
          },
        },
      }));

      return { flowId, requestId };
    },
    updateDepartmentQuery: (value) =>
      set((state) => ({
        departmentQuery: value,
        form:
          state.form.department && state.form.department !== value
            ? { ...state.form, department: '', departmentId: null }
            : state.form,
      })),
    updateEmailLocalPart: (value) =>
      set((state) => ({
        emailVerificationRequest: {
          sendRequestId: state.emailVerificationRequest.sendRequestId + 1,
          verifyRequestId: state.emailVerificationRequest.verifyRequestId + 1,
        },
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
        form:
          state.form.password === value
            ? state.form
            : {
                ...state.form,
                password: value,
                passwordConfirm: '',
              },
      })),
    updatePasswordConfirm: (value) =>
      set((state) => ({
        form: { ...state.form, passwordConfirm: value },
      })),
    updateUniversityQuery: (value) =>
      set((state) => ({
        emailVerificationRequest: {
          sendRequestId: state.emailVerificationRequest.sendRequestId + 1,
          verifyRequestId: state.emailVerificationRequest.verifyRequestId + 1,
        },
        emailVerification: resetEmailVerificationState(),
        form:
          state.form.selectedUniversity && state.form.selectedUniversity.universityName !== value
            ? resetUniversityDependentFields({ ...state.form, selectedUniversity: null })
            : state.form,
        departmentQuery:
          state.form.selectedUniversity && state.form.selectedUniversity.universityName !== value ? '' : state.departmentQuery,
        universityQuery: value,
      })),
    updateUsername: (value) =>
      set((state) => ({
        form: {
          ...state.form,
          password: state.form.username === value ? state.form.password : '',
          passwordConfirm: state.form.username === value ? state.form.passwordConfirm : '',
          username: value,
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
    emailVerificationSendFailure: ({ blockedEndsAt = null, cooldownEndsAt = null, flowId, message, reason, requestId }) =>
      set((state) => {
        const requestContext = { flowId, requestId };

        if (hasRequestContext(requestContext) && !hasActiveSendRequest(state, requestContext)) {
          return state;
        }

        return {
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
      };
      }),
    emailVerificationSendSuccess: ({ blockedEndsAt = null, cooldownEndsAt, email, expiresAt, flowId, requestId }) =>
      set((state) => {
        const requestContext = { flowId, requestId };

        if (hasRequestContext(requestContext) && !hasActiveSendRequest(state, requestContext)) {
          return state;
        }

        return {
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
      };
      }),
    emailVerificationVerifyFailure: ({ blockedEndsAt = null, flowId, message, reason, requestId }) =>
      set((state) => {
        const requestContext = { flowId, requestId };

        if (hasRequestContext(requestContext) && !hasActiveVerifyRequest(state, requestContext)) {
          return state;
        }

        return {
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
      };
      }),
    emailVerificationVerifySuccess: ({ email, expiresAt, flowId, requestId, verifiedToken }) =>
      set((state) => {
        const requestContext = { flowId, requestId };

        if (hasRequestContext(requestContext) && !hasActiveVerifyRequest(state, requestContext)) {
          return state;
        }

        return {
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
      };
      }),
  },
  emailVerificationRequest: {
    sendRequestId: 0,
    verifyRequestId: 0,
  },
  flowId: 0,
  ...createInitialSignupState(),
}));
