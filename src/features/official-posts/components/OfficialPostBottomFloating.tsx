import { CtaButton } from '@/components/ui/CtaButton';
import { SvgIcon } from '@/components/ui/SvgIcon';

type OfficialPostBottomFloatingProps = {
  endDate: string | null;
  isScrapped: boolean;
};

export function OfficialPostBottomFloating({ endDate, isScrapped }: OfficialPostBottomFloatingProps) {
  const deadlineText = getDeadlineText(endDate);

  return (
    <div className="fixed bottom-0 left-1/2 z-50 w-full max-w-[393px] -translate-x-1/2 border-t border-[#DCDFE2] bg-white px-5 pb-[max(36px,env(safe-area-inset-bottom))] pt-2.5">
      <div className="flex items-center gap-2.5">
        <button
          type="button"
          className={[
            'flex h-6 w-6 shrink-0 items-center justify-center bg-white',
            isScrapped ? 'text-[#292B2C]' : 'text-[#BFC4C8]',
          ]
            .filter(Boolean)
            .join(' ')}
          aria-label={isScrapped ? '스크랩 해제' : '스크랩'}
          aria-pressed={isScrapped}
        >
          <SvgIcon size={24} viewBox="0 0 24 24">
            <path
              d="M6.5 4.5h11v15L12 16.25 6.5 19.5v-15Z"
              fill={isScrapped ? 'currentColor' : 'none'}
              stroke="currentColor"
              strokeLinejoin="round"
              strokeWidth="1.4"
            />
          </SvgIcon>
        </button>
        <span className="h-5 w-px shrink-0 bg-[#DCDFE2]" aria-hidden="true" />
        <div className="flex min-w-0 flex-1 items-center justify-end gap-1 pl-2">
          <p className="min-w-0 flex-1 truncate text-[20px] font-semibold leading-6 tracking-[-0.025em] text-[#292B2C]">
            {deadlineText}
          </p>
          <CtaButton className="w-auto shrink-0 px-4" fullWidth={false} variant="primary" state="default" size="md">
            신청하기
          </CtaButton>
        </div>
      </div>
    </div>
  );
}

function getDeadlineText(endDate: string | null) {
  const dDay = getDDay(endDate);
  return `마감까지 D-${dDay ?? 0}`;
}

function getDDay(endDate: string | null) {
  if (!endDate) {
    return null;
  }

  const normalizedDate = endDate.replace(/\./g, '-');
  const deadlineDate = new Date(normalizedDate);

  if (Number.isNaN(deadlineDate.getTime())) {
    return null;
  }

  const today = new Date();
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
  const deadlineStart = new Date(
    deadlineDate.getFullYear(),
    deadlineDate.getMonth(),
    deadlineDate.getDate(),
  ).getTime();

  return Math.ceil((deadlineStart - todayStart) / 86_400_000);
}
