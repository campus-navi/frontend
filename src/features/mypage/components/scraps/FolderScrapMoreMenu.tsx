import { SelectList, type SelectListItem } from '@/features/mypage/components/scraps/SelectList';

type FolderScrapMoreMenuProps = {
  isDeleteDisabled: boolean;
  scrapTitle: string;
  onClose: () => void;
  onDelete: () => void;
  onMove: () => void;
};

export function FolderScrapMoreMenu({
  isDeleteDisabled,
  scrapTitle,
  onClose,
  onDelete,
  onMove,
}: FolderScrapMoreMenuProps) {
  const items: SelectListItem[] = [
    {
      id: 'move',
      label: '이동',
      onClick: onMove,
    },
    {
      id: 'delete',
      label: '삭제',
      tone: 'danger',
      onClick: () => {
        if (!isDeleteDisabled) {
          onDelete();
        }
      },
    },
  ];

  return (
    <>
      <button
        type="button"
        className="fixed inset-0 z-30 cursor-default"
        onClick={onClose}
        aria-label="스크랩 관리 메뉴 닫기"
      />
      <SelectList
        ariaLabel={`${scrapTitle} 스크랩 관리 메뉴`}
        items={items}
        className="absolute right-0 top-8 z-40"
      />
    </>
  );
}
