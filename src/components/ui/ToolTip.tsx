import { useState, type HTMLAttributes, type KeyboardEvent, type ReactNode } from 'react';

type ToolTipType = 'RightDown' | 'LeftDown' | 'LeftUp' | 'RightUp';

type ToolTipProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  type?: ToolTipType;
};

const arrowClassNames: Record<ToolTipType, string> = {
  RightDown: '-bottom-[7px] right-3 border-x-[7px] border-t-[8px] border-x-transparent border-t-[#101112]',
  LeftDown: '-bottom-[7px] left-3 border-x-[7px] border-t-[8px] border-x-transparent border-t-[#101112]',
  LeftUp: '-top-[7px] left-3 border-x-[7px] border-b-[8px] border-x-transparent border-b-[#101112]',
  RightUp: '-top-[7px] right-3 border-x-[7px] border-b-[8px] border-x-transparent border-b-[#101112]',
};

export function ToolTip({
  children,
  type = 'RightDown',
  className = '',
  onClick,
  onKeyDown,
  ...props
}: ToolTipProps) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) {
    return null;
  }

  const close = () => {
    setIsVisible(false);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event);

    if (event.defaultPrevented) {
      return;
    }

    if (event.key !== 'Enter' && event.key !== ' ') {
      return;
    }

    event.preventDefault();
    close();
  };

  return (
    <div
      role="tooltip"
      onClick={(event) => {
        onClick?.(event);
        close();
      }}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      className={[
        'relative inline-flex h-7 w-fit max-w-[calc(100vw-32px)] cursor-pointer items-center justify-end rounded-[8px] bg-[#101112] px-3 py-1 text-right text-sm font-normal leading-[1.4] text-white outline-none focus-visible:ring-2 focus-visible:ring-[#31FFCC]',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      <span className="whitespace-nowrap">{children}</span>
      <span
        className={['absolute h-0 w-0', arrowClassNames[type]]
          .filter(Boolean)
          .join(' ')}
        aria-hidden="true"
      />
    </div>
  );
}
