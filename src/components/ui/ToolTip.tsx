import { useState, type HTMLAttributes, type ReactNode } from 'react';

type ToolTipType = 'RightDown' | 'LeftDown' | 'LeftUp' | 'RightUp';
type ToolTipPlacement = 'top' | 'bottom';
type ToolTipAlign = 'start' | 'end';

type ToolTipProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  placement?: ToolTipPlacement;
  align?: ToolTipAlign;
  type?: ToolTipType;
  arrowClassName?: string;
  contentClassName?: string;
};

const arrowClassNames: Record<ToolTipType, string> = {
  RightDown: '-bottom-[7px] right-3 border-x-[7px] border-t-[8px] border-x-transparent border-t-[#101112]',
  LeftDown: '-bottom-[7px] left-3 border-x-[7px] border-t-[8px] border-x-transparent border-t-[#101112]',
  LeftUp: '-top-[7px] left-3 border-x-[7px] border-b-[8px] border-x-transparent border-b-[#101112]',
  RightUp: '-top-[7px] right-3 border-x-[7px] border-b-[8px] border-x-transparent border-b-[#101112]',
};

const tooltipTypeByPlacement: Record<ToolTipPlacement, Record<ToolTipAlign, ToolTipType>> = {
  top: {
    start: 'LeftDown',
    end: 'RightDown',
  },
  bottom: {
    start: 'LeftUp',
    end: 'RightUp',
  },
};

export function ToolTip({
  children,
  placement,
  align = 'end',
  type,
  arrowClassName = '',
  contentClassName = '',
  className = '',
  onClick,
  ...props
}: ToolTipProps) {
  const [isVisible, setIsVisible] = useState(true);
  const tooltipType = type ?? tooltipTypeByPlacement[placement ?? 'top'][align];

  if (!isVisible) {
    return null;
  }

  const close = () => {
    setIsVisible(false);
  };

  return (
    <div
      role="tooltip"
      onClick={(event) => {
        onClick?.(event);
        close();
      }}
      className={[
        'relative inline-flex h-7 w-fit max-w-[calc(100vw-32px)] cursor-pointer items-center justify-end rounded-[8px] bg-[#101112] px-3 py-1 text-right text-sm font-normal leading-[1.4] text-white outline-none focus-visible:ring-2 focus-visible:ring-[#31FFCC]',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      <span className={['whitespace-nowrap', contentClassName].filter(Boolean).join(' ')}>{children}</span>
      <span
        className={['absolute h-0 w-0', arrowClassNames[tooltipType], arrowClassName]
          .filter(Boolean)
          .join(' ')}
        aria-hidden="true"
      />
    </div>
  );
}
