import { useDeferredValue, useMemo, useReducer } from 'react';

import { admissionYears, departments, universities, verificationCodeAnswer, verificationDurationSeconds } from '@/features/signup/data';
import type { SignupState, SignupStep } from '@/features/signup/types';
import { getSchoolEmailDomain, getSuggestions, isSignupStepValid } from '@/features/signup/utils';

import { useVerificationTimer } from './useVerificationTimer';

type SignupAction =
  | { type: 'previous_step' }
  | { type: 'next_step' }
  | { type: 'update_university_query'; payload: string }
  | { type: 'select_university'; payload: string }
  | { type: 'update_email_local_part'; payload: string }
  | { type: 'send_verification' }
  | { type: 'update_verification_code'; payload: string }
  | { type: 'verification_success' }
  | { type: 'verification_failure'; payload: string }
  | { type: 'update_department_query'; payload: string }
  | { type: 'select_department'; payload: string }
  | { type: 'select_admission_year'; payload: number }
  | { type: 'update_username'; payload: string }
  | { type: 'update_password'; payload: string }
  | { type: 'update_password_confirm'; payload: string }
  | { type: 'update_nickname'; payload: string };

const initialState: SignupState = {
  step: 0,
  form: {
    university: '',
    emailLocalPart: '',
    emailVerified: false,
    department: '',
    admissionYear: 2026,
    username: '',
    password: '',
    passwordConfirm: '',
    nickname: '',
  },
  universityQuery: '',
  departmentQuery: '',
  verification: {
    sent: false,
    code: '',
    error: '',
  },
};

function reducer(state: SignupState, action: SignupAction): SignupState {
  switch (action.type) {
    case 'previous_step':
      return { ...state, step: Math.max(0, state.step - 1) as SignupStep };
    case 'next_step':
      return { ...state, step: Math.min(7, state.step + 1) as SignupStep };
    case 'update_university_query':
      return {
        ...state,
        universityQuery: action.payload,
        form:
          state.form.university && state.form.university !== action.payload
            ? { ...state.form, university: '', emailLocalPart: '', emailVerified: false }
            : state.form,
        verification: { sent: false, code: '', error: '' },
      };
    case 'select_university':
      return {
        ...state,
        universityQuery: action.payload,
        form: {
          ...state.form,
          university: action.payload,
          emailLocalPart: '',
          emailVerified: false,
        },
        verification: { sent: false, code: '', error: '' },
      };
    case 'update_email_local_part':
      return {
        ...state,
        form: {
          ...state.form,
          emailLocalPart: action.payload,
          emailVerified: false,
        },
        verification: {
          ...state.verification,
          code: '',
          error: '',
        },
      };
    case 'send_verification':
      return {
        ...state,
        form: { ...state.form, emailVerified: false },
        verification: { sent: true, code: '', error: '' },
      };
    case 'update_verification_code':
      return {
        ...state,
        verification: { ...state.verification, code: action.payload, error: '' },
      };
    case 'verification_success':
      return {
        ...state,
        form: { ...state.form, emailVerified: true },
        verification: { ...state.verification, error: '' },
      };
    case 'verification_failure':
      return {
        ...state,
        form: { ...state.form, emailVerified: false },
        verification: { ...state.verification, error: action.payload },
      };
    case 'update_department_query':
      return {
        ...state,
        departmentQuery: action.payload,
        form:
          state.form.department && state.form.department !== action.payload
            ? { ...state.form, department: '' }
            : state.form,
      };
    case 'select_department':
      return {
        ...state,
        departmentQuery: action.payload,
        form: { ...state.form, department: action.payload },
      };
    case 'select_admission_year':
      return {
        ...state,
        form: { ...state.form, admissionYear: action.payload },
      };
    case 'update_username':
      return {
        ...state,
        form: { ...state.form, username: action.payload },
      };
    case 'update_password':
      return {
        ...state,
        form: { ...state.form, password: action.payload },
      };
    case 'update_password_confirm':
      return {
        ...state,
        form: { ...state.form, passwordConfirm: action.payload },
      };
    case 'update_nickname':
      return {
        ...state,
        form: { ...state.form, nickname: action.payload },
      };
    default:
      return state;
  }
}

export function useSignupFlow() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const deferredUniversityQuery = useDeferredValue(state.universityQuery);
  const deferredDepartmentQuery = useDeferredValue(state.departmentQuery);
  const verificationTimer = useVerificationTimer(verificationDurationSeconds);

  const emailDomain = useMemo(() => getSchoolEmailDomain(state.form.university), [state.form.university]);
  const filteredUniversities = useMemo(
    () =>
      state.form.university && state.form.university === state.universityQuery
        ? []
        : getSuggestions(universities, deferredUniversityQuery),
    [deferredUniversityQuery, state.form.university, state.universityQuery],
  );
  const filteredDepartments = useMemo(
    () =>
      state.form.department && state.form.department === state.departmentQuery
        ? []
        : getSuggestions(departments, deferredDepartmentQuery),
    [deferredDepartmentQuery, state.form.department, state.departmentQuery],
  );
  const isCurrentStepValid = isSignupStepValid(state.step, state.form);
  const progressValue = (Math.min(state.step, 6) + 1) / 7;

  const updateUniversityQuery = (value: string) => dispatch({ type: 'update_university_query', payload: value });
  const updateDepartmentQuery = (value: string) => dispatch({ type: 'update_department_query', payload: value });

  return {
    state,
    emailDomain,
    filteredUniversities,
    filteredDepartments,
    isCurrentStepValid,
    progressValue,
    admissionYears,
    timeLeft: verificationTimer.timeLeft,
    actions: {
      previousStep: () => dispatch({ type: 'previous_step' }),
      nextStep: () => {
        if (!isCurrentStepValid) return;
        dispatch({ type: 'next_step' });
      },
      updateUniversityQuery,
      selectUniversity: (value: string) => dispatch({ type: 'select_university', payload: value }),
      clearUniversityQuery: () => updateUniversityQuery(''),
      updateEmailLocalPart: (value: string) =>
        dispatch({ type: 'update_email_local_part', payload: value.replace(/[^a-zA-Z0-9._-]/g, '') }),
      sendVerification: () => {
        dispatch({ type: 'send_verification' });
        verificationTimer.start();
      },
      updateVerificationCode: (value: string) =>
        dispatch({ type: 'update_verification_code', payload: value.replace(/\D/g, '').slice(0, 6) }),
      submitVerification: () => {
        if (verificationTimer.timeLeft <= 0) {
          dispatch({ type: 'verification_failure', payload: '인증 시간이 만료되었습니다. 다시 전송해주세요.' });
          return;
        }

        if (state.verification.code === verificationCodeAnswer) {
          dispatch({ type: 'verification_success' });
          verificationTimer.reset();
          return;
        }

        dispatch({ type: 'verification_failure', payload: '인증번호가 올바르지 않습니다.' });
      },
      updateDepartmentQuery,
      selectDepartment: (value: string) => dispatch({ type: 'select_department', payload: value }),
      clearDepartmentQuery: () => updateDepartmentQuery(''),
      selectAdmissionYear: (value: number) => dispatch({ type: 'select_admission_year', payload: value }),
      updateUsername: (value: string) =>
        dispatch({ type: 'update_username', payload: value.toLowerCase().replace(/[^a-z0-9_]/g, '') }),
      updatePassword: (value: string) => dispatch({ type: 'update_password', payload: value }),
      updatePasswordConfirm: (value: string) => dispatch({ type: 'update_password_confirm', payload: value }),
      updateNickname: (value: string) => dispatch({ type: 'update_nickname', payload: value }),
    },
  };
}
