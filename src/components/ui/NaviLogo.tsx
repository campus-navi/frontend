import { useId } from 'react';

import { SvgIcon } from '@/components/ui/SvgIcon';

import type { ComponentPropsWithoutRef } from 'react';

type NaviLogoProps = Omit<ComponentPropsWithoutRef<typeof SvgIcon>, 'children' | 'viewBox'>;

export function NaviLogo({ className = '', title = 'NAVI', ...props }: NaviLogoProps) {
  const clipPathId = useId();

  return (
    <SvgIcon
      viewBox="0 0 120 32"
      className={['h-8 w-[120px] text-[#424242]', className].filter(Boolean).join(' ')}
      fill="none"
      title={title}
      {...props}
    >
      <path
        d="M24.1601 28H19.0439L8.13628 14.1434V28H2.02519V3.12927H7.14145L18.049 16.9858V3.12927H24.1601V28ZM33.5187 22.9903L31.6001 28H25.2759L35.7571 3.12927H41.8682L52.3494 28H45.883L43.9644 22.9903H33.5187ZM38.7416 9.45354L35.4729 18.0872H42.0103L38.7416 9.45354ZM63.7779 28H57.6313L47.5408 3.12927H54.2204L60.9355 20.0058L67.7927 3.12927H73.9038L63.7779 28ZM81.1853 3.12927V28H75.0032V3.12927H81.1853Z"
        fill="currentColor"
      />
      <g clipPath={`url(#${clipPathId})`}>
        <path
          d="M114.822 4.14583C115.394 3.99273 115.916 4.51557 115.763 5.08694L109.812 27.298C109.59 28.1264 108.383 28.0238 108.304 27.1699L107.046 13.5577C107.012 13.1892 106.72 12.8973 106.351 12.8632L92.7393 11.6047C91.8853 11.5257 91.7828 10.3192 92.6111 10.0973L114.822 4.14583Z"
          fill="currentColor"
        />
        <path
          d="M97.119 17.3662L98.189 21.7008L102.524 22.7708L98.189 23.8409L97.119 28.1754L96.0489 23.8409L91.7144 22.7708L96.0489 21.7008L97.119 17.3662Z"
          fill="currentColor"
          opacity="0.5"
        />
      </g>
      <defs>
        <clipPath id={clipPathId}>
          <rect width="31.9767" height="31.9767" fill="white" transform="translate(87.9971 0.0117188)" />
        </clipPath>
      </defs>
    </SvgIcon>
  );
}
