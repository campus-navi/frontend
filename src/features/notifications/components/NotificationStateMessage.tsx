import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export function NotificationStateMessage({
  action,
  isLoading = false,
  message,
}: {
  action?: {
    label: string;
    onClick: () => void;
  };
  isLoading?: boolean;
  message: string;
}) {
  return (
    <div className="flex min-h-[180px] flex-col items-center justify-center px-5 py-10 text-center">
      {isLoading ? <LoadingSpinner ariaLabel={message} className="mb-4 h-8 w-8 text-[#292B2C]" /> : null}
      <p className="whitespace-pre-line text-[15px] font-medium leading-6 text-[#8F969D]">{message}</p>
      {action ? (
        <button
          type="button"
          className="mt-4 rounded-[8px] bg-[#F2F4F6] px-3 py-2 text-[13px] font-semibold leading-none text-[#292B2C]"
          onClick={action.onClick}
        >
          {action.label}
        </button>
      ) : null}
    </div>
  );
}
