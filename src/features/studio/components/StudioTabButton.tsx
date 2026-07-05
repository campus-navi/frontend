import type { ReactNode } from 'react';

export function StudioTabButton({
  children,
  selected,
  onClick,
}: {
  children: ReactNode;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'h-full text-[18px] font-bold leading-none transition-colors',
        selected ? 'text-[#292B2C]' : 'text-[#BFC4C8]',
      ].join(' ')}
    >
      {children}
    </button>
  );
}
