import type { OfficialPostAttachment } from '@/api/modules/officialPost';
import { OfficialPostFile } from '@/features/official-posts/components/OfficialPostFile';

type OfficialPostAttachmentsProps = {
  attachments: OfficialPostAttachment[];
  hasUnreadAttachments: boolean;
};

export function OfficialPostAttachments({ attachments, hasUnreadAttachments }: OfficialPostAttachmentsProps) {
  return (
    <section className="flex flex-col gap-2 border-t border-[#EEF0F2] py-4" aria-labelledby="official-post-attachments-title">
      <h2 id="official-post-attachments-title" className="sr-only">
        첨부파일
      </h2>

      <OfficialPostFile count={attachments.length} hasTooltip={hasUnreadAttachments} type="files" />
    </section>
  );
}
