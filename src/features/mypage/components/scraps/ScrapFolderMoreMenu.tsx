import { SelectList, type SelectListItem } from '@/features/mypage/components/scraps/SelectList';

type ScrapFolderMoreMenuProps = {
  folderName: string;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

export function ScrapFolderMoreMenu({
  folderName,
  onClose,
  onDelete,
  onEdit,
}: ScrapFolderMoreMenuProps) {
  const items: SelectListItem[] = [
    {
      id: 'edit',
      label: '수정',
      onClick: onEdit,
    },
    {
      id: 'delete',
      label: '폴더 제거',
      tone: 'danger',
      onClick: onDelete,
    },
  ];

  return (
    <>
      <button
        type="button"
        className="fixed inset-0 z-20 cursor-default"
        onClick={onClose}
        aria-label="폴더 더보기 메뉴 닫기"
      />
      <SelectList
        ariaLabel={`${folderName} 폴더 관리 메뉴`}
        items={items}
        className="absolute right-4 top-11 z-30"
      />
    </>
  );
}
