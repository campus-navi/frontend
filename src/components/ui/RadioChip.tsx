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
  const reservedLabel = typeof children === 'string' || typeof children === 'number' ? children : null;

  return (
    <button
      type={type}
      aria-pressed={selected}
      className={[
        'inline-grid shrink-0 place-items-center whitespace-nowrap rounded-full border transition-colors',
        sizeClassNames[size],
        selected
          ? 'border-[#292B2C] bg-[#292B2C] font-semibold text-white'
          : 'border border-[#DCDFE2] bg-transparent font-medium text-[#BFC4C8]',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      <span className="[grid-area:1/1]">{children}</span>
      {reservedLabel !== null ? (
        <span aria-hidden="true" className="invisible h-0 overflow-hidden font-semibold [grid-area:1/1]">
          {reservedLabel}
        </span>
      ) : null}
    </button>
  );
}
