import { AppHeader } from '@/components/ui/AppHeader';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { SvgIcon } from '@/components/ui/SvgIcon';
import type { ReactNode } from 'react';
import type { useAcademicPlanTargetSelectionViewModel } from '@/features/academic-plans/view-models/useAcademicPlanTargetSelectionViewModel';

type AcademicPlanTargetSelectionViewProps = ReturnType<typeof useAcademicPlanTargetSelectionViewModel>;

export function AcademicPlanTargetSelectionView({
  campusQuery,
  onBack,
  onSelectCampus,
  onSelectTarget,
  selectedPlanTypeLabel,
  selection,
  targetKindLabel,
  targetQuery,
  targetSearchQuery,
  onTargetSearchQueryChange,
}: AcademicPlanTargetSelectionViewProps) {
  const isCampusStep = selection.selectedCampusId === null;
  const highlightedCampusText = '캠퍼스';
  const highlightedTargetText = targetKindLabel;

  return (
    <main className="min-h-[100svh] bg-white">
      <div className="mx-auto flex min-h-[100svh] w-full max-w-[393px] flex-col bg-white">
        <AppHeader title="학업계획서" onBack={onBack} />

        <section className="flex min-h-0 flex-1 flex-col px-4 pt-12">
          {isCampusStep ? (
            <>
              <h1 className="text-[24px] font-bold leading-[1.42] text-[#292B2C]">
                {selectedPlanTypeLabel || '학업계획서'}을 원하는
                <br />
                <span className="text-[#00C99A]">{highlightedCampusText}</span>를 선택해주세요.
              </h1>

              <div className="mt-10 flex flex-col gap-3.5">
                {campusQuery.isLoading ? (
                  <AcademicPlanMessage>
                    <LoadingSpinner ariaLabel="캠퍼스 목록을 불러오는 중" />
                    목록을 불러오는 중입니다.
                  </AcademicPlanMessage>
                ) : null}
                {campusQuery.errorMessage ? (
                  <AcademicPlanErrorMessage message={campusQuery.errorMessage} onRetry={campusQuery.onRetry} />
                ) : null}
                {!campusQuery.isLoading && !campusQuery.errorMessage && campusQuery.campuses.length === 0 ? (
                  <AcademicPlanMessage>선택할 수 있는 캠퍼스가 없어요.</AcademicPlanMessage>
                ) : null}
                {!campusQuery.isLoading && !campusQuery.errorMessage
                  ? campusQuery.campuses.map((campus) => (
                      <button
                        type="button"
                        key={campus.id}
                        onClick={() => onSelectCampus(campus)}
                        className="flex h-[62px] w-full items-center rounded-[10px] bg-[#F8F9FA] px-4 text-left text-[16px] font-semibold leading-[22px] text-[#292B2C]"
                      >
                        {campus.name}
                      </button>
                    ))
                  : null}
              </div>
            </>
          ) : (
            <>
              <h1 className="text-[24px] font-bold leading-[1.42] text-[#292B2C]">
                {selectedPlanTypeLabel || '학업계획서'}을 원하는
                <br />
                <span className="text-[#00C99A]">{highlightedTargetText}</span>를 선택해주세요.
              </h1>

              <div className="relative mt-10">
                <input
                  type="search"
                  value={targetSearchQuery}
                  onChange={(event) => onTargetSearchQueryChange(event.target.value)}
                  placeholder={`${targetKindLabel}를 검색해보세요.`}
                  className="h-12 w-full rounded-full border-0 bg-[#F4F6F8] px-4 pr-12 text-[16px] font-medium text-[#292B2C] placeholder:text-[#C3C8CE] focus:outline-none"
                />
                <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#B8BEC5]">
                  <SearchIcon />
                </span>
              </div>

              <div className="mt-4 min-h-0 flex-1 overflow-y-auto pb-[max(24px,env(safe-area-inset-bottom))] [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {targetQuery.isLoading ? (
                  <AcademicPlanMessage>
                    <LoadingSpinner ariaLabel="대상 목록을 불러오는 중" />
                    목록을 불러오는 중입니다.
                  </AcademicPlanMessage>
                ) : null}
                {targetQuery.errorMessage ? (
                  <AcademicPlanErrorMessage message={targetQuery.errorMessage} onRetry={targetQuery.onRetry} />
                ) : null}
                {!targetQuery.isLoading && !targetQuery.errorMessage && targetQuery.targets.length === 0 ? (
                  <AcademicPlanMessage>선택할 수 있는 {targetKindLabel}가 없어요.</AcademicPlanMessage>
                ) : null}
                {!targetQuery.isLoading && !targetQuery.errorMessage
                  ? targetQuery.targets.map((target) => (
                      <button
                        type="button"
                        key={target.id}
                        onClick={() => onSelectTarget(target)}
                        className="flex h-[58px] w-full items-center px-2 text-left text-[16px] font-semibold leading-[22px] text-[#292B2C]"
                      >
                        {target.name}
                      </button>
                    ))
                  : null}
              </div>
            </>
          )}
        </section>
      </div>
    </main>
  );
}

function AcademicPlanMessage({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-[88px] items-center gap-2 rounded-[10px] bg-[#F8F9FA] px-4 text-[15px] font-medium leading-6 text-[#8A929A]">
      {children}
    </div>
  );
}

function AcademicPlanErrorMessage({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="rounded-[10px] bg-[#FFF8F8] px-4 py-4">
      <p className="text-[15px] font-semibold text-[#BE4A4A]">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-3 text-[14px] font-semibold text-[#292B2C] underline underline-offset-4"
      >
        다시 시도
      </button>
    </div>
  );
}

function SearchIcon() {
  return (
    <SvgIcon size={24} viewBox="0 0 24 24">
      <path
        d="m20 20-4.4-4.4M17.5 10.8a6.7 6.7 0 1 1-13.4 0 6.7 6.7 0 0 1 13.4 0Z"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </SvgIcon>
  );
}
