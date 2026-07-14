export function StudioDraftToast({
  isVisible,
  message = '작성내용이 임시 저장되었어요',
}: {
  isVisible: boolean;
  message?: string;
}) {
  if (!isVisible) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed bottom-[calc(54px+max(32px,env(safe-area-inset-bottom))+16px)] left-1/2 z-50 w-full max-w-[393px] -translate-x-1/2 px-3">
      <div className="flex min-h-11 items-center rounded-[10px] bg-[#101112] px-4 py-3 text-[13px] font-medium leading-[18px] text-white">
        {message}
      </div>
    </div>
  );
}
