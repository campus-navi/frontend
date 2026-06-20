import { SvgIcon } from '@/components/ui/SvgIcon';
import type { HomeCommunityPost as HomeCommunityPostItem } from '@/features/home/types';

export function HomeCommunityPost({
  hasImage,
  title,
  body,
}: Omit<HomeCommunityPostItem, 'id'>) {
  return (
    <article className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-1">
          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#FAFAFC] text-[#BFC4C8]">
            <SvgIcon size={16} viewBox="0 0 16 16">
              <path
                d="M8 8.2a2.6 2.6 0 1 0 0-5.2 2.6 2.6 0 0 0 0 5.2ZM3.2 13.3a4.8 4.8 0 0 1 9.6 0"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="1"
              />
            </SvgIcon>
          </span>
          <span className="text-[14px] font-medium leading-[1.4] text-[#565656]">익명</span>
          <span className="text-[14px] font-semibold leading-[1.4] tracking-[0.015em] text-[#0BC798]">N%가 본 글이에요</span>
        </div>
        <button type="button" className="flex h-4 w-4 shrink-0 items-center justify-center text-[#292B2C]" aria-label="더보기">
          <MoreIcon />
        </button>
      </div>

      <div className="flex gap-3 pl-5">
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-[16px] font-semibold leading-[1.4] tracking-[0.01em] text-[#292B2C]">{title}</h3>
          <p className="mt-1 line-clamp-2 text-[14px] font-normal leading-[1.4] text-[#565656]">{body}</p>
          <p className="mt-1 text-[12px] font-normal leading-[1.4] text-[#BFC4C8]">1일전</p>
        </div>
        {hasImage ? <div className="h-[72px] w-[72px] shrink-0 rounded-lg bg-[#FFD36E]" aria-hidden="true" /> : null}
      </div>
    </article>
  );
}

function MoreIcon() {
  return (
    <SvgIcon size={16} viewBox="0 0 16 16">
      <path
        d="M8 3.3v.01M8 8v.01M8 12.7v.01"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="2"
      />
    </SvgIcon>
  );
}
