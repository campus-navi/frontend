import type { ButtonHTMLAttributes, ReactNode } from 'react';

type RadioBtnProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  selected?: boolean;
};

export function RadioBtn({ children, className = '', selected = false, type = 'button', ...props }: RadioBtnProps) {
  return (
    <button
      type={type}
      aria-pressed={selected}
      className={[
        'h-[54px] rounded-[12px] px-4 text-center text-[16px] font-medium leading-none transition-colors',
        selected ? 'border border-[#DBDBDB] bg-[#F2F2F2]' : 'border border-[#EFEFEF] bg-white',
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
