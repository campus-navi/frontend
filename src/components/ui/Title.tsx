import type { HTMLAttributes, ReactNode } from 'react';

type TitleProps = HTMLAttributes<HTMLHeadingElement> & {
  children: ReactNode;
};

export function Title({ children, className = '', ...props }: TitleProps) {
  return (
    <h1
      className={[
        'self-stretch text-[clamp(28px,8vw,32px)] font-bold leading-[1.4] tracking-[-0.03em] text-[#565656]',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      {children}
    </h1>
  );
}
