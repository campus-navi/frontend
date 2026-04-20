import type { HTMLInputAutoCompleteAttribute, HTMLInputTypeAttribute, ReactNode, Ref } from 'react';

type SignupTextFieldProps = {
  autoCapitalize?: string;
  autoComplete?: HTMLInputAutoCompleteAttribute;
  autoCorrect?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode'];
  containerClassName?: string;
  inputClassName?: string;
  inputRef?: Ref<HTMLInputElement>;
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
  const helperToneClassName =
    helperTone === 'success' ? 'text-[#3A7A44]' : helperTone === 'error' ? 'text-[#D34B4B]' : 'text-[#8D8D8D]';

  return (
    <div>
      {label ? <p className="text-[15px] font-medium leading-none text-[#7E7E7E]">{label}</p> : null}
      <div
        className={[
          label ? 'mt-5 border-b border-[#E1E1E1] focus-within:border-[#1F1F1F]' : 'border-b border-[#E1E1E1] focus-within:border-[#1F1F1F]',
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
          className={['h-12 min-w-0 flex-1 border-0 bg-transparent px-0 text-[17px] text-[#202020] placeholder:text-[#B9B9B9] focus:outline-none', inputClassName]
            .filter(Boolean)
            .join(' ')}
        />
        {trailingActions ? <div className="flex shrink-0 items-center gap-1 pb-0">{trailingActions}</div> : null}
      </div>
      {helperText ? <p className={['mt-3 text-sm', helperToneClassName].join(' ')}>{helperText}</p> : null}
    </div>
  );
}
