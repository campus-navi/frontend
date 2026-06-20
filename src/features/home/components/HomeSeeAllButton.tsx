import { SvgIcon } from '@/components/ui/SvgIcon';

export function HomeSeeAllButton() {
  return (
    <button
      type="button"
      className="flex shrink-0 items-center gap-1 text-[14px] font-normal leading-[1.2] tracking-[-0.02em] text-[#9D9D9D]"
    >
      모두보기
      <SvgIcon size={8} viewBox="0 0 8 8">
        <path d="m3 1.5 2.5 2.5L3 6.5" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="1.2" />
      </SvgIcon>
    </button>
  );
}
