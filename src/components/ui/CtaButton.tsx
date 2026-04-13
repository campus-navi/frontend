import type { ButtonHTMLAttributes, ReactNode } from 'react';

type CtaButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  active?: boolean;
  fullWidth?: boolean;
};

export function CtaButton({
  children,
  active = false,
  fullWidth = true,
  className = '',
  type = 'button',
  ...props
}: CtaButtonProps) {
  const baseClassName =
    'rounded-[8px] px-4 py-[clamp(16px,4.5vw,20px)] text-[clamp(15px,4vw,16px)] font-semibold leading-none tracking-[0.015em] transition-colors duration-200';
  const widthClassName = fullWidth ? 'w-full' : '';
  const stateClassName = active
    ? 'bg-[#565656] text-white hover:bg-[#4b4b4b]'
    : 'bg-[#B6B6B6] text-white hover:bg-[#a9a9a9]';

  return (
    <button
      type={type}
      className={[baseClassName, widthClassName, stateClassName, className].filter(Boolean).join(' ')}
      {...props}
    >
      {children}
    </button>
  );
}
