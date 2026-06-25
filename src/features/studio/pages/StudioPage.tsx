import { useEffect, useRef, useState } from 'react';
import type { MouseEventHandler, PointerEventHandler, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

import { BottomSheet } from '@/components/ui/BottomSheet';
import { MobileGnb } from '@/components/ui/MobileGnb';
import { RadioChip } from '@/components/ui/RadioChip';
import { SvgIcon } from '@/components/ui/SvgIcon';
import type { AcademicPlanType } from '@/api';
import { academicPlanTypeOptions } from '@/features/academic-plans/view-models/useAcademicPlanTargetSelectionViewModel';

type StudioTab = 'tools' | 'documents';
type DocumentFilter = 'all' | 'completed' | 'draft';
type DocumentStatus = 'analyzing' | 'new' | 'draft' | 'completed';
type StudioDocument = {
  id: number;
  title: string;
  time: string;
  status: DocumentStatus;
};

const toolCards = [
  { title: '학업계획서', description: '자기소개서 AI에 대한 기능 설명이 여기에 들어가야합니다.', ready: true },
  { title: '자기소개서', description: '자기소개서 AI에 대한 기능 설명이 여기에 들어가야합니다.', ready: false },
  { title: '자기소개서', description: '자기소개서 AI에 대한 기능 설명이 여기에 들어가야합니다.', ready: false },
];

const documentCards: StudioDocument[] = [
  { id: 1, title: '학업계획서', time: '방금전', status: 'analyzing' },
  { id: 2, title: '학업계획서', time: '방금전', status: 'new' },
  { id: 3, title: '학업계획서', time: '방금전', status: 'draft' },
  { id: 4, title: '학업계획서', time: '6.15(월) 오후 9:03', status: 'completed' },
];

const documentFilterStatusMap: Record<Exclude<DocumentFilter, 'all'>, DocumentStatus> = {
  completed: 'completed',
  draft: 'draft',
};

export function StudioPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<StudioTab>('tools');
  const [documentFilter, setDocumentFilter] = useState<DocumentFilter>('all');
  const [isPlanTypeSheetOpen, setIsPlanTypeSheetOpen] = useState(false);

  const openAcademicPlanFlow = () => {
    setIsPlanTypeSheetOpen(true);
  };

  const selectPlanType = (type: AcademicPlanType) => {
    setIsPlanTypeSheetOpen(false);
    navigate(`/studio/academic-plans/target?type=${type}`);
  };

  return (
    <main className="min-h-[100svh] bg-white">
      <div className="mx-auto flex min-h-[100svh] w-full max-w-[393px] flex-col bg-white pb-[calc(54px+max(32px,env(safe-area-inset-bottom)))]">
        <header className="border-b border-[#DCDFE2] bg-white px-4 pt-[max(32px,env(safe-area-inset-top))]">
          <h1 className="pt-5 text-[22px] font-bold leading-none text-[#111111]">스튜디오</h1>
          <div className="mt-8 flex h-14 items-center gap-8">
            <StudioTabButton selected={activeTab === 'tools'} onClick={() => setActiveTab('tools')}>
              도구
            </StudioTabButton>
            <StudioTabButton selected={activeTab === 'documents'} onClick={() => setActiveTab('documents')}>
              내 문서함 <span className={activeTab === 'documents' ? 'text-[#00C99A]' : ''}>4</span>
            </StudioTabButton>
          </div>
        </header>

        {activeTab === 'tools' ? (
          <StudioToolsView onAcademicPlanClick={openAcademicPlanFlow} />
        ) : (
          <StudioDocumentsView selectedFilter={documentFilter} onFilterChange={setDocumentFilter} />
        )}
      </div>

      <MobileGnb activeItem="studio" />

      <BottomSheet
        isOpen={isPlanTypeSheetOpen}
        title="학업계획서 유형"
        type="center"
        onClose={() => setIsPlanTypeSheetOpen(false)}
      >
        <div className="grid w-full grid-cols-2 gap-3 px-4 pb-[max(56px,env(safe-area-inset-bottom))]">
          {academicPlanTypeOptions.map((option) => (
            <button
              type="button"
              key={option.type}
              onClick={() => selectPlanType(option.type)}
              className="h-14 rounded-[8px] border border-[#DADDE1] bg-white text-[16px] font-semibold leading-none text-[#292B2C]"
            >
              {option.label}
            </button>
          ))}
        </div>
      </BottomSheet>
    </main>
  );
}

function StudioTabButton({
  children,
  selected,
  onClick,
}: {
  children: ReactNode;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'h-full text-[18px] font-bold leading-none transition-colors',
        selected ? 'text-[#292B2C]' : 'text-[#BFC4C8]',
      ].join(' ')}
    >
      {children}
    </button>
  );
}

function StudioToolsView({ onAcademicPlanClick }: { onAcademicPlanClick: () => void }) {
  const { handlers: coreToolsHandlers, scrollRef: coreToolsRef } = useHorizontalDragScroll();

  return (
    <div className="flex flex-1 flex-col gap-7 overflow-y-auto px-4 py-6">
      <section>
        <h2 className="text-[16px] font-bold leading-none text-[#292B2C]">핵심 양식 3종</h2>
        <div
          ref={coreToolsRef}
          className="mt-4 flex cursor-grab gap-4 overflow-x-auto pb-2 active:cursor-grabbing [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          aria-label="핵심 양식 3종"
          onPointerDown={coreToolsHandlers.onPointerDown}
          onPointerMove={coreToolsHandlers.onPointerMove}
          onPointerUp={coreToolsHandlers.onPointerUp}
          onPointerCancel={coreToolsHandlers.onPointerCancel}
          onClickCapture={coreToolsHandlers.onClickCapture}
        >
          {toolCards.map((card, index) => (
            <StudioToolCard
              key={`${card.title}-${index}`}
              title={card.title}
              description={card.description}
              ready={card.ready}
              compact
              onClick={card.ready ? onAcademicPlanClick : undefined}
            />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-[16px] font-bold leading-none text-[#292B2C]">전체 양식</h2>
        <div className="mt-4 flex flex-col gap-4">
          {toolCards.concat(toolCards.slice(1, 2)).map((card, index) => (
            <StudioToolCard
              key={`${card.title}-wide-${index}`}
              title={card.title}
              description={card.description}
              ready={index === 0}
              onClick={index === 0 ? onAcademicPlanClick : undefined}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

function useHorizontalDragScroll() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const cleanupDragListenersRef = useRef<(() => void) | null>(null);
  const dragStateRef = useRef({
    hasDragged: false,
    isDragging: false,
    scrollLeft: 0,
    startX: 0,
  });

  const cleanupDragListeners = () => {
    cleanupDragListenersRef.current?.();
    cleanupDragListenersRef.current = null;
  };

  const endDrag = () => {
    dragStateRef.current.isDragging = false;
    cleanupDragListeners();
  };

  useEffect(() => cleanupDragListeners, []);

  const handlePointerDown: PointerEventHandler<HTMLDivElement> = (event) => {
    const container = scrollRef.current;

    if (!container || event.button !== 0) {
      return;
    }

    dragStateRef.current = {
      hasDragged: false,
      isDragging: true,
      scrollLeft: container.scrollLeft,
      startX: event.clientX,
    };

    cleanupDragListeners();

    const handleWindowPointerEnd = () => {
      endDrag();
    };

    window.addEventListener('pointerup', handleWindowPointerEnd);
    window.addEventListener('pointercancel', handleWindowPointerEnd);
    cleanupDragListenersRef.current = () => {
      window.removeEventListener('pointerup', handleWindowPointerEnd);
      window.removeEventListener('pointercancel', handleWindowPointerEnd);
    };
  };

  const handlePointerMove: PointerEventHandler<HTMLDivElement> = (event) => {
    const container = scrollRef.current;
    const dragState = dragStateRef.current;

    if (!container || !dragState.isDragging) {
      return;
    }

    const moveDistance = event.clientX - dragState.startX;

    if (Math.abs(moveDistance) <= 4) {
      return;
    }

    dragState.hasDragged = true;
    if (event.pointerType === 'touch') {
      event.preventDefault();
    }

    container.scrollLeft = dragState.scrollLeft - moveDistance;
  };

  const handleClickCapture: MouseEventHandler<HTMLDivElement> = (event) => {
    if (!dragStateRef.current.hasDragged) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    dragStateRef.current.hasDragged = false;
  };

  return {
    handlers: {
      onClickCapture: handleClickCapture,
      onPointerCancel: endDrag,
      onPointerDown: handlePointerDown,
      onPointerMove: handlePointerMove,
      onPointerUp: endDrag,
    },
    scrollRef,
  };
}

function StudioToolCard({
  title,
  description,
  ready,
  compact = false,
  onClick,
}: {
  title: string;
  description: string;
  ready: boolean;
  compact?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!onClick}
      className={[
        'relative flex shrink-0 flex-col items-start rounded-[12px] bg-white p-4 text-left shadow-[0_6px_22px_rgba(25,31,40,0.06)]',
        compact ? 'h-36 w-[260px]' : 'h-36 w-full',
      ].join(' ')}
    >
      <StudioSparkIcon />
      {!ready ? (
        <span className="absolute right-4 top-6 rounded-full bg-[#F2F4F6] px-2.5 py-1 text-[13px] font-semibold leading-none text-[#292B2C]">
          준비중
        </span>
      ) : null}
      <strong className="mt-4 text-[17px] font-bold leading-[22px] text-[#292B2C]">{title}</strong>
      <span className="mt-2 max-w-[220px] text-[13px] font-medium leading-[17px] text-[#B9BEC4]">
        {description}
      </span>
    </button>
  );
}

function StudioDocumentsView({
  selectedFilter,
  onFilterChange,
}: {
  selectedFilter: DocumentFilter;
  onFilterChange: (filter: DocumentFilter) => void;
}) {
  const filteredDocumentCards =
    selectedFilter === 'all'
      ? documentCards
      : documentCards.filter((document) => document.status === documentFilterStatusMap[selectedFilter]);

  return (
    <section className="flex flex-1 flex-col overflow-y-auto px-4 py-6">
      <div className="flex gap-2">
        <RadioChip selected={selectedFilter === 'all'} onClick={() => onFilterChange('all')}>
          전체
        </RadioChip>
        <RadioChip selected={selectedFilter === 'completed'} onClick={() => onFilterChange('completed')}>
          분석완료 2
        </RadioChip>
        <RadioChip selected={selectedFilter === 'draft'} onClick={() => onFilterChange('draft')}>
          임시저장 1
        </RadioChip>
      </div>

      <div className="mt-4 flex flex-col gap-2">
        {filteredDocumentCards.map((document) => (
          <StudioDocumentCard key={document.id} document={document} />
        ))}
        {filteredDocumentCards.length === 0 ? (
          <div className="flex min-h-[148px] items-center justify-center rounded-[10px] bg-white px-4 text-center text-[15px] font-medium leading-6 text-[#A0A7AF] shadow-[0_6px_22px_rgba(25,31,40,0.06)]">
            표시할 문서가 없어요.
          </div>
        ) : null}
      </div>
    </section>
  );
}

function StudioDocumentCard({
  document,
}: {
  document: StudioDocument;
}) {
  return (
    <article className="flex h-[106px] rounded-[10px] bg-white px-3 py-4 shadow-[0_6px_22px_rgba(25,31,40,0.06)]">
      <div className="pt-[17px]">
        <StudioSparkIcon />
      </div>
      <div className="ml-4 flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-[17px] font-bold leading-[22px] text-[#292B2C]">{document.title}</h3>
              {document.status !== 'completed' ? (
                <span className="rounded-[5px] bg-[#FF5E47] px-1.5 py-0.5 text-[11px] font-bold leading-none text-white">
                  N
                </span>
              ) : null}
            </div>
            <p className="mt-1 text-[13px] font-medium leading-[17px] text-[#7E858C]">{document.time}</p>
          </div>
          {document.status === 'draft' ? (
            <span className="rounded-[6px] bg-[#EDF1FF] px-2 py-1 text-[13px] font-semibold leading-none text-[#5576FF]">
              임시저장
            </span>
          ) : null}
        </div>

        {document.status === 'analyzing' ? (
          <div className="mt-auto flex items-center gap-2">
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#E8F8F5]">
              <div className="h-full w-[86%] rounded-full bg-[#31E7BC]" />
            </div>
            <span className="text-[13px] font-semibold leading-none text-[#00B88D]">분석중</span>
          </div>
        ) : (
          <div className="mt-auto flex gap-1">
            <span className="rounded-[5px] bg-[#F2F4F6] px-1.5 py-1 text-[12px] font-medium leading-none text-[#59616A]">
              고려대 서울캠퍼스
            </span>
            <span className="rounded-[5px] bg-[#F2F4F6] px-1.5 py-1 text-[12px] font-medium leading-none text-[#59616A]">
              경영학과
            </span>
          </div>
        )}
      </div>
    </article>
  );
}

function StudioSparkIcon() {
  return (
    <span className="flex h-10 w-10 items-center justify-center rounded-[8px] bg-[#F2F4F7] text-[#292B2C]">
      <SvgIcon size={24} viewBox="0 0 24 24">
        <path d="M13 2 10.2 10.2 2 13l8.2 2.8L13 24l2.8-8.2L24 13l-8.2-2.8L13 2Z" fill="currentColor" />
      </SvgIcon>
    </span>
  );
}
