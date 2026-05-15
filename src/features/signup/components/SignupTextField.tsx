import type { HTMLInputAutoCompleteAttribute, HTMLInputTypeAttribute, ReactNode, Ref } from 'react';

import { signupValidationFeedbackClassNames } from '@/features/signup/constants';

type SignupTextFieldProps = {
  autoCapitalize?: string;
  autoComplete?: HTMLInputAutoCompleteAttribute;
  autoCorrect?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode'];
  containerClassName?: string;
  inputClassName?: string;
  inputRef?: Ref<HTMLInputElement>;
  layout?: 'default' | 'account';
  lang?: string;
  label: string;
  trailingActions?: ReactNode;
  value: string;
  placeholder: string;
  spellCheck?: boolean;
  type?: HTMLInputTypeAttribute;
  helperText?: string;
  helperTone?: 'default' | 'success' | 'error';
  onBlur?: () => void;
  onChange: (value: string) => void;
  onFocus?: () => void;
};

export function SignupTextField({
  autoCapitalize,
  autoComplete,
  autoCorrect,
  containerClassName,
  inputMode,
  inputClassName,
  inputRef,
  layout = 'default',
  lang,
  label,
  trailingActions,
  value,
  placeholder,
  spellCheck,
  type = 'text',
  helperText,
  helperTone = 'default',
  onBlur,
  onChange,
  onFocus,
}: SignupTextFieldProps) {
  const helperToneClassName = signupValidationFeedbackClassNames.helperText[helperTone];
  const borderToneClassName =
    helperTone === 'error'
      ? signupValidationFeedbackClassNames.border.error
      : signupValidationFeedbackClassNames.border.default;
  const isAccountLayout = layout === 'account';
  const labelClassName = isAccountLayout
    ? 'text-[14px] font-medium leading-[140%] text-[#565656]'
    : 'text-[15px] font-medium leading-none text-[#7E7E7E]';
  const containerSpacingClassName = isAccountLayout ? 'border-b-2 pb-3 pt-6' : label ? 'mt-5 border-b' : 'border-b';
  const inputBaseClassName = isAccountLayout
    ? 'h-6 min-w-0 flex-1 border-0 bg-transparent px-0 text-[16px] font-medium leading-[140%] text-[#292B2C] placeholder:text-[#BFC4C8] focus:outline-none'
    : 'h-12 min-w-0 flex-1 border-0 bg-transparent px-0 text-[17px] text-[#202020] placeholder:text-[#B9B9B9] focus:outline-none';

  return (
    <div>
      {label ? <p className={labelClassName}>{label}</p> : null}
      <div
        className={[
          containerSpacingClassName,
          borderToneClassName,
          'flex items-center gap-2',
          containerClassName,
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <input
          ref={inputRef}
          autoCapitalize={autoCapitalize}
          autoComplete={autoComplete}
          autoCorrect={autoCorrect}
          inputMode={inputMode}
          lang={lang}
          spellCheck={spellCheck}
          type={type}
          value={value}
          onBlur={onBlur}
          onChange={(event) => onChange(event.target.value)}
          onFocus={onFocus}
          placeholder={placeholder}
          className={[inputBaseClassName, inputClassName]
            .filter(Boolean)
            .join(' ')}
        />
        {trailingActions ? <div className="flex shrink-0 items-center gap-1 pb-0">{trailingActions}</div> : null}
      </div>
      {helperText ? <p className={['mt-3 text-sm', helperToneClassName].join(' ')}>{helperText}</p> : null}
    </div>
  );
}
