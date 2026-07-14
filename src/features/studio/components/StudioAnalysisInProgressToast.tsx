export function StudioAnalysisInProgressToast({
  isVisible,
  onOpen,
}: {
  isVisible: boolean;
  onOpen: () => void;
}) {
  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-[calc(54px+max(32px,env(safe-area-inset-bottom))+16px)] left-1/2 z-50 w-full max-w-[393px] -translate-x-1/2 px-3">
      <div className="flex h-[52px] items-center justify-between rounded-[10px] bg-[#101112] px-4 text-white shadow-[0_8px_24px_rgba(0,0,0,0.18)]">
        <span className="text-[13px] font-medium leading-[18px]">학업계획서 분석 진행중이에요.</span>
        <button
          type="button"
          onClick={onOpen}
          className="shrink-0 rounded-[6px] px-2 py-1 text-[13px] font-semibold leading-none text-[#31FFCC]"
        >
          확인하기
        </button>
      </div>
    </div>
  );
}
