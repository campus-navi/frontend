import { useEffect, useRef, useState } from 'react';
import type { MouseEventHandler, PointerEventHandler, ReactNode } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';

import type { AcademicPlanType } from '@/api';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { MobileGnb } from '@/components/ui/MobileGnb';
import { academicPlanTypeOptions } from '@/features/academic-plans/view-models/useAcademicPlanTargetSelectionViewModel';
import { StudioDocumentsView } from '@/features/studio/components/StudioDocumentsView';
import { StudioDraftToast } from '@/features/studio/components/StudioDraftToast';
import { StudioSparkIcon } from '@/features/studio/components/StudioSparkIcon';
import { useStudioDocumentsViewModel } from '@/features/studio/view-models/useStudioDocumentsViewModel';

type StudioTab = 'tools' | 'documents';
type StudioRouteState = {
  showAcademicPlanDraftToast?: boolean;
};

const toolCards = [
  { title: '학업계획서', description: '자기소개서 AI에 대한 기능 설명이 여기에 들어가야합니다.', ready: true },
  { title: '자기소개서', description: '자기소개서 AI에 대한 기능 설명이 여기에 들어가야합니다.', ready: false },
  { title: '자기소개서', description: '자기소개서 AI에 대한 기능 설명이 여기에 들어가야합니다.', ready: false },
];

function isStudioRouteState(state: unknown): state is StudioRouteState {
  return typeof state === 'object' && state !== null && 'showAcademicPlanDraftToast' in state;
}

export function StudioPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<StudioTab>(() =>
    searchParams.get('tab') === 'documents' ? 'documents' : 'tools',
  );
  const [isPlanTypeSheetOpen, setIsPlanTypeSheetOpen] = useState(false);
  const [isDraftToastVisible, setIsDraftToastVisible] = useState(false);
  const studioDocumentsViewModel = useStudioDocumentsViewModel();

  useEffect(() => {
    if (!isStudioRouteState(location.state) || location.state.showAcademicPlanDraftToast !== true) {
      return;
    }

    setIsDraftToastVisible(true);
    navigate(
      {
        pathname: location.pathname,
        search: location.search,
      },
      { replace: true, state: null },
    );
  }, [location.pathname, location.search, location.state, navigate]);

  useEffect(() => {
    if (!isDraftToastVisible) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setIsDraftToastVisible(false);
    }, 3000);

    return () => window.clearTimeout(timeoutId);
  }, [isDraftToastVisible]);

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
              내 문서함{' '}
              <span className={activeTab === 'documents' ? 'text-[#00C99A]' : ''}>
                {studioDocumentsViewModel.counts.all}
              </span>
            </StudioTabButton>
          </div>
        </header>

        {activeTab === 'tools' ? (
          <StudioToolsView onAcademicPlanClick={openAcademicPlanFlow} />
        ) : (
          <StudioDocumentsView viewModel={studioDocumentsViewModel} />
        )}
      </div>

      <MobileGnb activeItem="studio" />
      <StudioDraftToast isVisible={isDraftToastVisible} />

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

