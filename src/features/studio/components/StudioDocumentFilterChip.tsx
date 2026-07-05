import type { ButtonHTMLAttributes, ReactNode } from 'react';

type StudioDocumentFilterChipProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  selected: boolean;
};

export function StudioDocumentFilterChip({
  children,
  className = '',
  selected,
  type = 'button',
  ...props
}: StudioDocumentFilterChipProps) {
  return (
    <button
      type={type}
      className={[
        'flex h-[38px] items-center justify-center rounded-full border px-4 text-[14px] font-medium leading-none transition-colors',
        selected ? 'border-[#292B2C] bg-[#292B2C] text-white' : 'border-[#DCDFE2] bg-white text-[#707376]',
        className,
      ].join(' ')}
      {...props}
    >
      {children}
    </button>
  );
}
