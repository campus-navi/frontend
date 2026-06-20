import { SvgIcon } from '@/components/ui/SvgIcon';

export function HomeNotificationButton({
  hasNewNotification,
}: {
  hasNewNotification: boolean;
}) {
  return (
    <button
      type="button"
      className="relative flex h-7 w-7 items-center justify-center text-[#BFC4C8]"
      aria-label="알림"
    >
      <SvgIcon size={28} viewBox="0 0 28 28">
        <path
          d="M21 12.4a7 7 0 0 0-14 0v3.4l-1.6 2.8a1.1 1.1 0 0 0 1 1.7h15.2a1.1 1.1 0 0 0 1-1.7L21 15.8v-3.4ZM11.2 22.3a3 3 0 0 0 5.6 0"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.16667"
        />
      </SvgIcon>
      {hasNewNotification ? (
        <span className="absolute right-[5px] top-0.5 h-[7px] w-[7px] rounded-full bg-[#FF5E47]" aria-hidden="true" />
      ) : null}
    </button>
  );
}
