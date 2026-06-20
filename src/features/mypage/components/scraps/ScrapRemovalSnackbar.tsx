type ScrapRemovalSnackbarProps = {
  count: number;
  isVisible: boolean;
  onClose: () => void;
};

export function ScrapRemovalSnackbar({
  count,
  isVisible,
  onClose,
}: ScrapRemovalSnackbarProps) {
  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed inset-x-0 bottom-6 z-[60] flex justify-center px-4">
      <button
        type="button"
        className="w-full max-w-[361px] rounded-xl bg-[#101112] px-3 py-3 text-left text-[14px] font-medium leading-[1.4] text-white"
        onClick={onClose}
        role="status"
      >
        스크랩 {count}개를 제거했어요
      </button>
    </div>
  );
}
