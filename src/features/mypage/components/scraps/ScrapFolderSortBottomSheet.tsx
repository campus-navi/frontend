import type { MyPageScrapFolderSort } from '@/api';
import { BottomSheet } from '@/components/ui/BottomSheet';

type ScrapFolderSortBottomSheetProps = {
  currentSort: MyPageScrapFolderSort;
  isOpen: boolean;
  onClose: () => void;
  onSelect: (sort: MyPageScrapFolderSort) => void;
};

const sortOptions: Array<{
  label: string;
  value: MyPageScrapFolderSort;
}> = [
  { label: '최근 저장순', value: 'RECENT_SAVED' },
  { label: '이름 순(A-Z)', value: 'NAME_ASC' },
  { label: '이름 순(Z-A)', value: 'NAME_DESC' },
  { label: '리스트 추가 순', value: 'LIST_ADDED' },
];

export function ScrapFolderSortBottomSheet({
  currentSort,
  isOpen,
  onClose,
  onSelect,
}: ScrapFolderSortBottomSheetProps) {
  return (
    <BottomSheet
      isOpen={isOpen}
      title="필터"
      titleId="scrap-folder-sort-sheet-title"
      type="left"
      onClose={onClose}
    >
      <div
        className="flex h-[272px] w-full flex-col gap-2 px-4 pb-14"
        role="radiogroup"
        aria-label="스크랩 폴더 정렬"
      >
        {sortOptions.map((option) => {
          const isSelected = currentSort === option.value;

          return (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={isSelected}
              className="flex h-12 w-full shrink-0 items-center justify-between py-3 text-left text-[16px] font-medium leading-[1.4] text-[#292B2C]"
              onClick={() => onSelect(option.value)}
            >
              <span>{option.label}</span>
              <span
                className={[
                  'flex h-6 min-h-6 max-h-6 w-6 min-w-6 max-w-6 shrink-0 flex-none grow-0 items-center justify-center rounded-full border-[1.25px]',
                  isSelected
                    ? 'border-transparent bg-[#292B2C]'
                    : 'border-[#DCDFE2] bg-white',
                ].join(' ')}
                aria-hidden="true"
              >
                {isSelected ? <span className="h-2 w-2 rounded-full bg-white" /> : null}
              </span>
            </button>
          );
        })}
      </div>
    </BottomSheet>
  );
}
