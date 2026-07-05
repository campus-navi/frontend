import { StudioSparkIcon } from '@/features/studio/components/StudioSparkIcon';

export function StudioToolCard({
  title,
  description,
  ready,
  compact = false,
  onClick,
}: {
  title: string;
  description: string;
  ready: boolean;
  compact?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!onClick}
      className={[
        'relative flex shrink-0 flex-col items-start rounded-[12px] bg-white p-4 text-left shadow-[0_6px_22px_rgba(25,31,40,0.06)]',
        compact ? 'h-36 w-[260px]' : 'h-36 w-full',
      ].join(' ')}
    >
      <StudioSparkIcon />
      {!ready ? (
        <span className="absolute right-4 top-6 rounded-full bg-[#F2F4F6] px-2.5 py-1 text-[13px] font-semibold leading-none text-[#292B2C]">
          준비중
        </span>
      ) : null}
      <strong className="mt-4 text-[17px] font-bold leading-[22px] text-[#292B2C]">{title}</strong>
      <span className="mt-2 max-w-[220px] text-[13px] font-medium leading-[17px] text-[#B9BEC4]">
        {description}
      </span>
    </button>
  );
}
