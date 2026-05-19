import { BottomSheet } from '@/components/ui/BottomSheet';
import { CtaButton } from '@/components/ui/CtaButton';
import { hasOfficialPostText } from '@/features/official-posts/utils/officialPostApplication';

type OfficialPostApplyMethodBottomSheetProps = {
  applyMethodDetail: string | null | undefined;
  isOpen: boolean;
  onClose: () => void;
};

export function OfficialPostApplyMethodBottomSheet({
  applyMethodDetail,
  isOpen,
  onClose,
}: OfficialPostApplyMethodBottomSheetProps) {
  const hasApplyMethodDetail = hasOfficialPostText(applyMethodDetail);
  const displayText = hasApplyMethodDetail ? applyMethodDetail.trim() : '신청방법 정보가 없습니다.';

  return (
    <BottomSheet
      footer={
        <CtaButton type="button" variant="tertiary" state="default" size="xlg" onClick={onClose}>
          닫기
        </CtaButton>
      }
      isOpen={isOpen}
      title="신청방법 확인"
      type="center"
      onClose={onClose}
    >
      <div className="max-h-[244px] min-h-0 w-full overflow-y-auto px-4 pb-4">
        <div className="rounded-[8px] bg-[#FAFBFD] px-4 py-5">
          <p className="whitespace-pre-wrap break-words text-[14px] font-medium leading-[1.6] tracking-normal text-[#717171]">
            {displayText}
          </p>
        </div>
      </div>
    </BottomSheet>
  );
}
