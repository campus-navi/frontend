import type { ComponentPropsWithoutRef } from 'react';

type DimmedOverlayProps = ComponentPropsWithoutRef<'div'>;

export function DimmedOverlay({ className = '', ...props }: DimmedOverlayProps) {
  return (
    <div
      className={['bg-[#292B2C]/50', className].filter(Boolean).join(' ')}
      {...props}
    />
  );
}
