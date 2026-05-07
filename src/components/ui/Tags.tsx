import type { HTMLAttributes, ReactNode } from 'react';

type TagsSize = 'sm' | 'lg';
type TagsType = 'tertiary' | 'secondary' | 'brand' | 'primary';

type TagsProps = HTMLAttributes<HTMLSpanElement> & {
  children: ReactNode;
  size?: TagsSize;
  type?: TagsType;
};

const sizeClassNames: Record<TagsSize, string> = {
  sm: 'h-7 rounded-[8px] px-2.5 py-1 text-xs font-medium leading-[1.4]',
  lg: 'h-8 rounded-[8px] px-2.5 py-1.5 text-sm font-medium leading-[1.4]',
};

const typeClassNames: Record<TagsType, string> = {
  tertiary: 'bg-[#F6F7F9] text-[#292B2C]',
  secondary: 'bg-[#EEF0F2] text-[#292B2C]',
  brand: 'bg-[#31FFCC] text-[#292B2C]',
  primary: 'bg-[#292B2C] text-white',
};

export function Tags({
  children,
  size = 'sm',
  type = 'tertiary',
  className = '',
  ...props
}: TagsProps) {
  return (
    <span
      className={[
        'inline-flex shrink-0 items-center justify-center whitespace-nowrap tracking-normal',
        sizeClassNames[size],
        typeClassNames[type],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      {children}
    </span>
  );
}
