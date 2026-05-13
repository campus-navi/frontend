import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';

import { BottomSheet } from '@/components/ui/BottomSheet';
import { CtaButton } from '@/components/ui/CtaButton';
import { RadioChip } from '@/components/ui/RadioChip';
import { SvgIcon } from '@/components/ui/SvgIcon';

export type OfficialPostCategoryFilter = '전체' | '수강' | '학사' | '장학/금융' | '학생 지원' | '활동' | '시설';
export type OfficialPostSortFilter = '최신순' | '마감순';

type OfficialPostListControlsProps = {
  isFilterSheetOpen: boolean;
  selectedCategory: OfficialPostCategoryFilter;
  selectedSort: OfficialPostSortFilter;
  onCategoryChange: (category: OfficialPostCategoryFilter) => void;
  onCloseSheet: () => void;
  onOpenFilterSheet: () => void;
  onResetCategory: () => void;
  onResetSort: () => void;
  onSortChange: (sort: OfficialPostSortFilter) => void;
};

const categoryOptions: OfficialPostCategoryFilter[] = ['전체', '수강', '학사', '장학/금융', '학생 지원', '활동', '시설'];
const sortOptions: OfficialPostSortFilter[] = ['최신순', '마감순'];

export function OfficialPostListControls({
  isFilterSheetOpen,
  selectedCategory,
  selectedSort,
  onCategoryChange,
  onCloseSheet,
  onOpenFilterSheet,
  onResetCategory,
  onResetSort,
  onSortChange,
}: OfficialPostListControlsProps) {
  return (
    <>
      <section className="flex flex-col bg-white" aria-label="교내정보 필터와 정렬">
        <div className="flex items-center justify-center p-4">
          <div className="flex h-12 w-full items-center justify-between rounded-full bg-[#F5F7FA] p-3 text-[#BFC4C8]">
            <span className="text-[16px] font-normal leading-[1.4]">키워드로 검색해보세요</span>
            <SvgIcon size={24} viewBox="0 0 24 24" className="shrink-0 text-[#BFC4C8]">
              <path
                d="M10.8 18.1a7.3 7.3 0 1 1 0-14.6 7.3 7.3 0 0 1 0 14.6Zm5.2-2.1 4 4"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            </SvgIcon>
          </div>
        </div>

        <div className="flex items-center px-4 py-2">
          <div className="flex shrink-0 items-center gap-3">
            <button
              type="button"
              className="flex h-6 w-6 items-center justify-center text-[#292B2C]"
              aria-label="필터 열기"
              onClick={onOpenFilterSheet}
            >
              <FilterIcon />
            </button>
            <div className="h-6 w-px bg-[#DCDFE2]" aria-hidden="true" />
          </div>

          <div className="ml-3 flex min-w-0 items-center gap-2 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <SelectedFilterChip
              label={selectedCategory}
              onClick={onOpenFilterSheet}
              onRemove={selectedCategory === '전체' ? undefined : onResetCategory}
            />
            <SelectedFilterChip
              label={selectedSort}
              onClick={onOpenFilterSheet}
              onRemove={selectedSort === '최신순' ? undefined : onResetSort}
            />
          </div>
        </div>
      </section>

      <OfficialPostFilterBottomSheet
        isOpen={isFilterSheetOpen}
        selectedCategory={selectedCategory}
        selectedSort={selectedSort}
        onApply={(category, sort) => {
          onCategoryChange(category);
          onSortChange(sort);
          onCloseSheet();
        }}
        onClose={onCloseSheet}
      />
    </>
  );
}

function SelectedFilterChip({
  label,
  onClick,
  onRemove,
}: {
  label: string;
  onClick: () => void;
  onRemove?: () => void;
}) {
  const isActive = Boolean(onRemove);

  return (
    <span
      className={[
        'inline-flex h-[38px] shrink-0 items-center rounded-full border bg-white text-[16px] font-medium leading-none tracking-[0.015em]',
        isActive ? 'border-[#292B2C] text-[#292B2C]' : 'border-[#DCDFE2] text-[#BFC4C8]',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <button type="button" className={isActive ? 'h-full pl-4 pr-1' : 'h-full px-4'} onClick={onClick}>
        {label}
      </button>
      {onRemove ? (
        <button
          type="button"
          aria-label={`${label} 선택 해제`}
          className="flex h-full items-center justify-center pl-1 pr-3 text-[#292B2C]"
          onClick={onRemove}
        >
          <SvgIcon size={16} viewBox="0 0 16 16">
            <path d="M5.5 5.5 10.5 10.5M10.5 5.5 5.5 10.5" stroke="currentColor" strokeLinecap="round" strokeWidth="1.4" />
          </SvgIcon>
        </button>
      ) : null}
    </span>
  );
}

function OfficialPostFilterBottomSheet({
  isOpen,
  selectedCategory,
  selectedSort,
  onApply,
  onClose,
}: {
  isOpen: boolean;
  selectedCategory: OfficialPostCategoryFilter;
  selectedSort: OfficialPostSortFilter;
  onApply: (category: OfficialPostCategoryFilter, sort: OfficialPostSortFilter) => void;
  onClose: () => void;
}) {
  const [draftCategory, setDraftCategory] = useState<OfficialPostCategoryFilter>(selectedCategory);
  const [draftSort, setDraftSort] = useState<OfficialPostSortFilter>(selectedSort);

  useEffect(() => {
    if (isOpen) {
      return;
    }

    setDraftCategory(selectedCategory);
    setDraftSort(selectedSort);
  }, [isOpen, selectedCategory, selectedSort]);

  return (
    <BottomSheet isOpen={isOpen} title="필터" type="left" onClose={onClose}>
      <div className="flex w-full flex-1 flex-col gap-5 overflow-hidden px-4 py-3">
        <FilterSection title="카테고리">
          <div className="flex flex-wrap items-center gap-2">
            {categoryOptions.map((category) => (
              <RadioChip
                key={category}
                selected={draftCategory === category}
                onClick={() => setDraftCategory(category)}
              >
                {category}
              </RadioChip>
            ))}
          </div>
        </FilterSection>

        <FilterSection title="정렬">
          <div className="flex items-center gap-2">
            {sortOptions.map((sort) => (
              <RadioChip
                key={sort}
                selected={draftSort === sort}
                onClick={() => setDraftSort(sort)}
              >
                {sort}
              </RadioChip>
            ))}
          </div>
        </FilterSection>
      </div>

      <div className="flex w-full items-center justify-center gap-2 px-4 pb-[max(60px,env(safe-area-inset-bottom))] pt-3">
        <CtaButton
          fullWidth={false}
          variant="tertiary"
          className="w-[112px] shrink-0 border-[#DCDFE2] text-[#292B2C] tracking-[0.015em]"
          onClick={() => {
            setDraftCategory('전체');
            setDraftSort('최신순');
          }}
        >
          초기화
        </CtaButton>
        <CtaButton
          fullWidth={false}
          className="min-w-px flex-[1_0_0] text-[#292B2C] tracking-[0.015em]"
          onClick={() => onApply(draftCategory, draftSort)}
        >
          적용
        </CtaButton>
      </div>
    </BottomSheet>
  );
}

function FilterSection({ children, title }: { children: ReactNode; title: string }) {
  return (
    <section className="flex w-full flex-col gap-3">
      <h3 className="text-[16px] font-semibold leading-[1.4] text-[#101112]">{title}</h3>
      {children}
    </section>
  );
}

function FilterIcon() {
  return (
    <SvgIcon size={24} viewBox="-2 -3 24 24">
      <path
        d="M7.75 14.75H18.75M0.75 14.75H3.75M3.75 14.75V16.75M3.75 14.75V12.75M17.75 8.75H18.75M0.75 8.75H13.75M13.75 8.75V10.75M13.75 8.75V6.75M11.75 2.75H18.75M0.75 2.75H7.75M7.75 2.75V4.75M7.75 2.75V0.75"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </SvgIcon>
  );
}
