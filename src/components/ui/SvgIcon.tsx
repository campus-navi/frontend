import type { ComponentPropsWithoutRef, ReactNode } from 'react';

type SvgIconProps = Omit<ComponentPropsWithoutRef<'svg'>, 'children'> & {
  children: ReactNode;
  title?: string;
  size?: number | string;
  decorative?: boolean;
};

export function SvgIcon({
  children,
  title,
  size,
  decorative = !title,
  width,
  height,
  role,
  'aria-hidden': ariaHidden,
  'aria-label': ariaLabel,
  ...props
}: SvgIconProps) {
  const resolvedSize = size ?? undefined;

  return (
    <svg
      role={decorative ? undefined : role ?? 'img'}
      aria-hidden={decorative ? true : ariaHidden}
      aria-label={decorative ? undefined : ariaLabel}
      width={width ?? resolvedSize}
      height={height ?? resolvedSize}
      {...props}
    >
      {title ? <title>{title}</title> : null}
      {children}
    </svg>
  );
}
