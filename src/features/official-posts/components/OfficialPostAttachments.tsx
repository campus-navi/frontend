import { useState } from 'react';

import type { OfficialPostAttachment } from '@/api/modules/officialPost';
import { OfficialPostAttachmentDownloadSheet } from '@/features/official-posts/components/OfficialPostAttachmentDownloadSheet';
import { OfficialPostFile } from '@/features/official-posts/components/OfficialPostFile';

type OfficialPostAttachmentsProps = {
  attachments?: OfficialPostAttachment[];
  hasUnreadAttachments: boolean;
  postId: number;
};

export function OfficialPostAttachments({ attachments, hasUnreadAttachments, postId }: OfficialPostAttachmentsProps) {
  const [isDownloadSheetOpen, setIsDownloadSheetOpen] = useState(false);
  const attachmentItems = attachments ?? [];
  const hasAttachments = attachmentItems.length > 0;
  const hasUnreadAttachment = hasUnreadAttachments || attachmentItems.some((file) => file.isDownloaded === false);

  if (!hasAttachments) {
    return null;
  }

  return (
    <>
      <section className="flex flex-col gap-2 border-t border-[#EEF0F2] py-4" aria-labelledby="official-post-attachments-title">
        <h2 id="official-post-attachments-title" className="sr-only">
          첨부파일
        </h2>

        <OfficialPostFile
          count={attachmentItems.length}
          hasTooltip={hasUnreadAttachment}
          status={hasUnreadAttachment ? 'unread' : 'completed'}
          type="files"
          onActionClick={() => setIsDownloadSheetOpen(true)}
        />
      </section>

      <OfficialPostAttachmentDownloadSheet
        attachments={attachmentItems}
        isOpen={isDownloadSheetOpen}
        postId={postId}
        onClose={() => setIsDownloadSheetOpen(false)}
      />
    </>
  );
}
