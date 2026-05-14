import { useState } from 'react';

import { BottomSheet } from '@/components/ui/BottomSheet';
import { CtaButton } from '@/components/ui/CtaButton';
import { SvgIcon } from '@/components/ui/SvgIcon';
import {
  getOfficialPostApplicationStatus,
  getOfficialPostApplyMethodLabel,
  getOfficialPostDDay,
  shouldShowOfficialPostBottomFloating,
} from '@/features/official-posts/utils/officialPostApplication';

type OfficialPostBottomFloatingProps = {
  applyMethodType: string | null;
  endDate: string | null;
  endTime: string | null;
  isApplicable: boolean;
  isScrapped: boolean;
  requiredDocuments: string | null;
  startDate: string | null;
  startTime: string | null;
};

export function OfficialPostBottomFloating({
  applyMethodType,
  endDate,
  endTime,
  isApplicable,
  isScrapped,
  requiredDocuments,
  startDate,
  startTime,
}: OfficialPostBottomFloatingProps) {
  const [isApplyMethodSheetOpen, setIsApplyMethodSheetOpen] = useState(false);
  const shouldShow = shouldShowOfficialPostBottomFloating(requiredDocuments);
  const applicationStatus = getOfficialPostApplicationStatus({
    endDate,
    endTime,
    isApplicable,
    startDate,
    startTime,
  });
  const isButtonDisabled = applicationStatus !== 'applicable';
  const buttonText =
    applicationStatus === 'before'
      ? '신청기간이 아니에요'
      : applicationStatus === 'closed'
        ? '마감'
        : getOfficialPostApplyMethodLabel(applyMethodType);
  const deadlineText =
    applicationStatus === 'before' ? '신청기간이 아니에요.' : applicationStatus === 'closed' ? '마감' : getDeadlineText(endDate);

  if (!shouldShow) {
    return null;
  }

  const handleApplyClick = () => {
    if (applicationStatus === 'applicable' && applyMethodType === 'OTHER') {
      setIsApplyMethodSheetOpen(true);
    }
  };

  return (
    <>
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
            <CtaButton
              className="w-auto shrink-0 px-4"
              disabled={isButtonDisabled}
              fullWidth={false}
              variant="primary"
              size="md"
              onClick={handleApplyClick}
            >
              {buttonText}
            </CtaButton>
          </div>
        </div>
      </div>

      <BottomSheet
        footer={
          <CtaButton type="button" variant="primary" state="default" size="xlg" onClick={() => setIsApplyMethodSheetOpen(false)}>
            확인
          </CtaButton>
        }
        isOpen={isApplyMethodSheetOpen}
        title="신청방법 확인"
        type="left"
        onClose={() => setIsApplyMethodSheetOpen(false)}
      >
        <div className="min-h-10 w-full px-5" />
      </BottomSheet>
    </>
  );
}

function getDeadlineText(endDate: string | null | undefined) {
  const dDay = getOfficialPostDDay(endDate);

  if (dDay === null) {
    return '마감기한 없음';
  }

  if (dDay < 0) {
    return '마감 종료';
  }

  return `마감까지 D-${dDay}`;
}
