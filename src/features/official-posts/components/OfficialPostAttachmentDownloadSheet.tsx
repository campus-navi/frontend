import type { OfficialPostAttachment } from '@/api/modules/officialPost';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { CtaButton } from '@/components/ui/CtaButton';
import { OfficialPostFile } from '@/features/official-posts/components/OfficialPostFile';

type OfficialPostAttachmentDownloadSheetProps = {
  attachments: OfficialPostAttachment[];
  isOpen: boolean;
  onClose: () => void;
};

export function OfficialPostAttachmentDownloadSheet({
  attachments,
  isOpen,
  onClose,
}: OfficialPostAttachmentDownloadSheetProps) {
  return (
    <BottomSheet
      footer={
        <CtaButton type="button" variant="primary" size="xlg" className="text-[#292B2C]">
          모두 다운받기
        </CtaButton>
      }
      footerClassName="!pb-[max(60px,env(safe-area-inset-bottom))]"
      isOpen={isOpen}
      title={
        <span className="flex min-w-0 items-start gap-1 text-left">
          <span className="text-[18px] font-semibold leading-[1.4] text-[#292B2C]">첨부파일</span>
          <span className="text-[16px] font-bold leading-[1.5] text-[#0BC798]">
            {attachments.length}
          </span>
        </span>
      }
      type="left"
      onClose={onClose}
    >
      <div className="min-h-0 w-full flex-1 overflow-y-auto px-5">
        <div className="flex w-full flex-col gap-2">
          {attachments.map((attachment) => (
            <OfficialPostFile
              key={attachment.id}
              completedLabel="파일보기"
              fileName={attachment.name}
              status={attachment.isDownloaded ? 'completed' : 'unread'}
              type="filedetail"
            />
          ))}
        </div>
      </div>
    </BottomSheet>
  );
}
