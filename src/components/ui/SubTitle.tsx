import type { HTMLAttributes, ReactNode } from 'react';

type SubTitleProps = HTMLAttributes<HTMLParagraphElement> & {
  children: ReactNode;
};

export function SubTitle({ children, className = '', ...props }: SubTitleProps) {
  return (
    <p
      className={['text-[clamp(15px,4vw,16px)] font-medium leading-[1.4] text-[#838383]', className]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      {children}
    </p>
  );
}
