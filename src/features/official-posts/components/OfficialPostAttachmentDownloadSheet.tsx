import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import { officialPostApi } from '@/api';
import type { OfficialPostAttachment } from '@/api/modules/officialPost';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { CtaButton } from '@/components/ui/CtaButton';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { OfficialPostFile } from '@/features/official-posts/components/OfficialPostFile';
import { getOfficialPostDetailQueryKey } from '@/features/official-posts/hooks/useOfficialPostDetail';
import { triggerBrowserDownload } from '@/features/official-posts/utils/downloadFile';

type OfficialPostAttachmentDownloadSheetProps = {
  attachments: OfficialPostAttachment[];
  isOpen: boolean;
  postId: number;
  onClose: () => void;
};

export function OfficialPostAttachmentDownloadSheet({
  attachments,
  isOpen,
  postId,
  onClose,
}: OfficialPostAttachmentDownloadSheetProps) {
  const queryClient = useQueryClient();
  const [downloadingAttachmentIds, setDownloadingAttachmentIds] = useState<Array<number | string>>([]);
  const [isDownloadingAll, setIsDownloadingAll] = useState(false);
  const isAnyAttachmentDownloading = downloadingAttachmentIds.length > 0;

  const invalidateOfficialPostDetail = async () => {
    await queryClient.invalidateQueries({
      queryKey: getOfficialPostDetailQueryKey(postId),
    });
  };

  const downloadAttachment = async (attachment: OfficialPostAttachment) => {
    const response = await officialPostApi.getAttachmentDownloadUrl(postId, attachment.id);

    triggerBrowserDownload(response.data.downloadUrl, attachment.name);
    await invalidateOfficialPostDetail();
  };

  const handleAttachmentDownload = async (attachment: OfficialPostAttachment) => {
    if (isDownloadingAll || downloadingAttachmentIds.includes(attachment.id)) {
      return;
    }

    setDownloadingAttachmentIds((currentIds) => [...currentIds, attachment.id]);

    try {
      await downloadAttachment(attachment);
    } catch (error) {
      console.error('첨부파일 다운로드 URL 발급에 실패했습니다.', error);
    } finally {
      setDownloadingAttachmentIds((currentIds) => currentIds.filter((id) => id !== attachment.id));
    }
  };

  const handleDownloadAll = async () => {
    if (isDownloadingAll || isAnyAttachmentDownloading) {
      return;
    }

    setIsDownloadingAll(true);

    try {
      for (const attachment of attachments) {
        setDownloadingAttachmentIds([attachment.id]);

        try {
          await downloadAttachment(attachment);
        } catch (error) {
          console.error('첨부파일 다운로드 URL 발급에 실패했습니다.', error);
        }
      }
    } finally {
      setDownloadingAttachmentIds([]);
      setIsDownloadingAll(false);
    }
  };

  return (
    <BottomSheet
      footer={
        <CtaButton
          type="button"
          variant="primary"
          size="xlg"
          className="text-[#292B2C]"
          disabled={isDownloadingAll || isAnyAttachmentDownloading}
          onClick={handleDownloadAll}
        >
          {isDownloadingAll ? (
            <span className="flex items-center justify-center gap-2">
              <LoadingSpinner ariaLabel="전체 첨부파일 다운로드 URL 발급 중" />
              다운로드 중
            </span>
          ) : (
            '모두 다운받기'
          )}
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
              actionContent={
                downloadingAttachmentIds.includes(attachment.id) ? (
                  <LoadingSpinner ariaLabel={`${attachment.name} 다운로드 URL 발급 중`} className="h-3.5 w-3.5" />
                ) : undefined
              }
              completedLabel="파일보기"
              disabled={isDownloadingAll || downloadingAttachmentIds.includes(attachment.id)}
              fileName={attachment.name}
              status={attachment.isDownloaded ? 'completed' : 'unread'}
              type="filedetail"
              onActionClick={() => void handleAttachmentDownload(attachment)}
            />
          ))}
        </div>
      </div>
    </BottomSheet>
  );
}
