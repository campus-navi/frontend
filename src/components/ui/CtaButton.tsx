import type { ButtonHTMLAttributes, ReactNode } from 'react';

type CtaButtonVariant = 'primary' | 'secondary' | 'tertiary';
type CtaButtonSize = 'xlg' | 'md' | 'sm' | 'xsm';
type CtaButtonState = 'default' | 'disabled' | 'ghosted';

type CtaButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: CtaButtonVariant;
  size?: CtaButtonSize;
  state?: CtaButtonState;
  fullWidth?: boolean;
};

const variantClassNames: Record<CtaButtonVariant, Record<CtaButtonState, string>> = {
  primary: {
    default: 'bg-[#31FFCC] text-[#333333]',
    ghosted: 'bg-[#31FFCC] text-[#333333] opacity-30',
    disabled: 'bg-[#E7E7E7] text-[#BBBBBB]',
  },
  secondary: {
    default: 'bg-[#1E2530] text-white',
    ghosted: 'bg-[#1E2530] text-white opacity-30',
    disabled: 'bg-[#E7E7E7] text-[#BBBBBB]',
  },
  tertiary: {
    default: 'border border-[#D6D6D6] bg-white text-[#333333]',
    ghosted: 'border border-[#D6D6D6] bg-white text-[#333333] opacity-30',
    disabled: 'bg-[#E7E7E7] text-[#BBBBBB]',
  },
};

const sizeClassNames: Record<CtaButtonSize, string> = {
  xlg: 'h-14 rounded-[12px] px-4 py-5 text-base font-semibold leading-none',
  md: 'h-12 rounded-[10px] p-4 text-base font-medium leading-none',
  sm: 'h-[34px] rounded-[8px] px-3 py-2.5 text-sm font-semibold leading-none',
  xsm: 'h-7 rounded-[6px] px-3 py-2 text-xs font-semibold leading-none',
};

export function CtaButton({
  children,
  variant = 'primary',
  size = 'xlg',
  state,
  fullWidth = true,
  className = '',
  type = 'button',
  disabled = false,
  ...props
}: CtaButtonProps) {
  const resolvedState = state ?? (disabled ? 'disabled' : 'default');
  const isDisabled = disabled || state === 'disabled';
  const baseClassName = 'inline-flex items-center justify-center tracking-normal transition-colors duration-200';
  const widthClassName = fullWidth ? 'w-full' : '';

  return (
    <button
      type={type}
      disabled={isDisabled}
      className={[
        baseClassName,
        widthClassName,
        sizeClassNames[size],
        variantClassNames[variant][resolvedState],
        isDisabled ? 'cursor-not-allowed' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      {children}
    </button>
  );
}
