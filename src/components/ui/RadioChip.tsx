import type { ButtonHTMLAttributes, ReactNode } from 'react';

type RadioChipSize = 'sm' | 'md';

type RadioChipProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  selected?: boolean;
  size?: RadioChipSize;
};

const sizeClassNames: Record<RadioChipSize, string> = {
  sm: 'h-9 px-4 py-2.5 text-[16px] font-medium leading-none tracking-[0.015em]',
  md: 'h-10 px-4 py-3 text-[16px] leading-none tracking-[0.015em]',
};

export function RadioChip({
  children,
  className = '',
  selected = false,
  size = 'sm',
  type = 'button',
  ...props
}: RadioChipProps) {
  return (
    <button
      type={type}
      aria-pressed={selected}
      className={[
        'inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-full transition-colors',
        sizeClassNames[size],
        selected
          ? 'border-0 bg-[#292B2C] font-semibold text-white'
          : 'border border-[#DCDFE2] bg-transparent font-medium text-[#BFC4C8]',
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
