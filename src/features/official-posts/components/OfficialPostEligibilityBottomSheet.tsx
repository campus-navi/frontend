import { BottomSheet } from '@/components/ui/BottomSheet';
import { CtaButton } from '@/components/ui/CtaButton';
import { hasOfficialPostText } from '@/features/official-posts/utils/officialPostApplication';

type OfficialPostEligibilityBottomSheetProps = {
  eligibility: string | null | undefined;
  isOpen: boolean;
  onClose: () => void;
};

export function OfficialPostEligibilityBottomSheet({
  eligibility,
  isOpen,
  onClose,
}: OfficialPostEligibilityBottomSheetProps) {
  const eligibilityLines = hasOfficialPostText(eligibility)
    ? eligibility
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean)
    : [];
  const hasEligibilityLines = eligibilityLines.length > 0;

  return (
    <BottomSheet
      footer={
        <CtaButton type="button" variant="tertiary" size="xlg" onClick={onClose}>
          확인
        </CtaButton>
      }
      isOpen={isOpen}
      title="지원자격"
      type="left"
      onClose={onClose}
    >
      <div className="max-h-[244px] min-h-0 w-full overflow-y-auto px-4 pb-4">
        {hasEligibilityLines ? (
          <ul className="flex flex-col gap-2">
            {eligibilityLines.map((line, index) => (
              <li key={`${line}-${index}`} className="rounded-[8px] bg-[#FAFBFD] px-2 py-4">
                <p className="flex gap-1 break-words text-[14px] font-medium leading-[1.2] tracking-normal text-[#717171]">
                  <span className="shrink-0">{index + 1}.</span>
                  <span className="min-w-0">{line}</span>
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="rounded-[8px] bg-[#FAFBFD] px-2 py-4 text-[14px] font-medium leading-[1.2] tracking-normal text-[#717171]">
            지원자격 정보가 없습니다.
          </p>
        )}
      </div>
    </BottomSheet>
  );
}
