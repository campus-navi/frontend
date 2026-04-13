type SignupTextFieldProps = {
  label: string;
  value: string;
  placeholder: string;
  type?: 'text' | 'password';
  helperText?: string;
  helperTone?: 'default' | 'success' | 'error';
  onChange: (value: string) => void;
};

export function SignupTextField({
  label,
  value,
  placeholder,
  type = 'text',
  helperText,
  helperTone = 'default',
  onChange,
}: SignupTextFieldProps) {
  const helperToneClassName =
    helperTone === 'success' ? 'text-[#3A7A44]' : helperTone === 'error' ? 'text-[#D34B4B]' : 'text-[#8D8D8D]';

  return (
    <div>
      {label ? <p className="text-[15px] font-medium leading-none text-[#7E7E7E]">{label}</p> : null}
      <div className={label ? 'mt-5 border-b border-[#E1E1E1] focus-within:border-[#1F1F1F]' : 'border-b border-[#E1E1E1] focus-within:border-[#1F1F1F]'}>
        <input
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className="h-12 w-full border-0 bg-transparent px-0 text-[17px] text-[#202020] placeholder:text-[#B9B9B9] focus:outline-none"
        />
      </div>
      {helperText ? <p className={['mt-3 text-sm', helperToneClassName].join(' ')}>{helperText}</p> : null}
    </div>
  );
}
