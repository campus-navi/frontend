import type { ReactNode } from 'react';

export type SelectListItem = {
  disabled?: boolean;
  id: string;
  label: string;
  tone?: 'default' | 'danger';
  icon?: ReactNode;
  onClick: () => void;
};

type SelectListProps = {
  ariaLabel: string;
  items: SelectListItem[];
  className?: string;
};

export function SelectList({ ariaLabel, items, className = '' }: SelectListProps) {
  return (
    <div
      className={['w-40 overflow-hidden rounded-xl bg-[#EBEDF0] shadow-[0_8px_24px_rgba(0,0,0,0.12)]', className]
        .filter(Boolean)
        .join(' ')}
      role="menu"
      aria-label={ariaLabel}
    >
      <div className="flex flex-col gap-px">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            className={[
              'flex h-12 w-full items-center gap-1 bg-white px-3 py-3 text-left text-base font-normal leading-[1.2]',
              item.tone === 'danger' ? 'text-[#FF5E47]' : 'text-[#292B2C]',
              item.disabled ? 'cursor-not-allowed opacity-50' : '',
            ].join(' ')}
            disabled={item.disabled}
            onClick={item.onClick}
            role="menuitem"
          >
            {item.icon ? <span className="flex h-5 w-5 shrink-0 items-center justify-center">{item.icon}</span> : null}
            <span className="min-w-0 truncate">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
