import { StudioToolCard } from '@/features/studio/components/StudioToolCard';
import { studioToolCards } from '@/features/studio/constants/studioToolCards';
import { useHorizontalDragScroll } from '@/features/studio/hooks/useHorizontalDragScroll';

export function StudioToolsView({ onAcademicPlanClick }: { onAcademicPlanClick: () => void }) {
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
          {studioToolCards.map((card, index) => (
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
          {studioToolCards.concat(studioToolCards.slice(1, 2)).map((card, index) => (
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
