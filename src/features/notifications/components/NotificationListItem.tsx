import { SvgIcon } from '@/components/ui/SvgIcon';

export function NotificationListItem({
  actionLabel,
  description,
  isRemoveMenuOpen = false,
  isRemovePending = false,
  meta,
  metaPlacement = 'header',
  onCloseRemoveMenu,
  onClick,
  onMoreClick,
  onRemove,
  title,
  typeLabel,
  variant,
}: {
  actionLabel?: string;
  description: string;
  isRemoveMenuOpen?: boolean;
  isRemovePending?: boolean;
  meta?: string;
  metaPlacement?: 'header' | 'footer';
  onCloseRemoveMenu?: () => void;
  onClick?: () => void;
  onMoreClick?: () => void;
  onRemove?: () => void;
  title: string;
  typeLabel: string;
  variant: 'activity' | 'remind';
}) {
  const content = (
    <>
      <div className="flex h-5 items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-1">
          <NotificationIcon variant={variant} />
          <span className="truncate text-[14px] font-semibold leading-5 text-[#292B2C]">{typeLabel}</span>
        </div>
        {meta && metaPlacement === 'header' ? (
          <span className="shrink-0 text-[12px] font-medium leading-[17px] text-[#8F969D]">{meta}</span>
        ) : null}
      </div>

      <div className="min-w-0 pl-6">
        <p
          className={[
            'text-[16px] font-semibold leading-[22px] text-[#292B2C]',
            variant === 'remind' ? 'truncate' : 'line-clamp-2',
          ].join(' ')}
        >
          {title}
        </p>
        <p className="mt-0.5 text-[16px] font-medium leading-[22px] text-[#707376]">{description}</p>
        {meta && metaPlacement === 'footer' ? (
          <p className="mt-1 text-[14px] font-semibold leading-5 text-[#0BC798]">{meta}</p>
        ) : null}
        {actionLabel ? (
          <span className="mt-1 inline-flex items-center text-[14px] font-semibold leading-5 text-[#00B88D]">
            {actionLabel}
            <SvgIcon size={20} viewBox="0 0 20 20">
              <path
                d="m8 5 5 5-5 5"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.6"
              />
            </SvgIcon>
          </span>
        ) : null}
      </div>
    </>
  );

  const className = [
    'flex w-full flex-col gap-2 text-left',
    variant === 'remind' ? 'py-0' : 'py-5',
    onClick
      ? 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#0BC798]'
      : '',
  ]
    .filter(Boolean)
    .join(' ');

  if (onRemove) {
    return (
      <article className="relative w-full">
        <div className="flex items-start gap-2">
          {onClick ? (
            <button type="button" className={`${className} min-w-0 flex-1`} onClick={onClick}>
              {content}
            </button>
          ) : (
            <div className={`${className} min-w-0 flex-1`}>{content}</div>
          )}
          <button
            type="button"
            className="relative z-20 flex h-5 w-5 shrink-0 items-center justify-center text-[#292B2C] disabled:cursor-not-allowed disabled:opacity-50"
            aria-expanded={isRemoveMenuOpen}
            aria-haspopup="menu"
            aria-label={`${title} 알림 더보기`}
            disabled={isRemovePending}
            onClick={onMoreClick}
          >
            <MoreIcon />
          </button>
        </div>

        {isRemoveMenuOpen ? (
          <NotificationRemoveMenu
            title={title}
            isRemovePending={isRemovePending}
            onClose={onCloseRemoveMenu}
            onRemove={onRemove}
          />
        ) : null}
      </article>
    );
  }

  if (onClick) {
    return (
      <button type="button" className={className} onClick={onClick}>
        {content}
      </button>
    );
  }

  return (
    <article className={className}>
      {content}
    </article>
  );
}

function NotificationRemoveMenu({
  isRemovePending,
  onClose,
  onRemove,
  title,
}: {
  isRemovePending: boolean;
  onClose?: () => void;
  onRemove: () => void;
  title: string;
}) {
  return (
    <>
      <button
        type="button"
        className="fixed inset-0 z-10 cursor-default"
        onClick={onClose}
        aria-label="알림 관리 메뉴 닫기"
      />
      <div
        className="absolute right-3 top-7 z-30 w-[166px] overflow-hidden rounded-xl bg-[#EBEDF0] shadow-[0_8px_24px_rgba(0,0,0,0.12)]"
        role="menu"
        aria-label={`${title} 알림 관리 메뉴`}
      >
        <button
          type="button"
          className="flex h-12 w-full items-center bg-white px-3 py-3 text-left text-[16px] font-normal leading-[1.2] text-[#FF5E47] disabled:cursor-not-allowed disabled:opacity-50"
          disabled={isRemovePending}
          onClick={onRemove}
          role="menuitem"
        >
          제거
        </button>
      </div>
    </>
  );
}

function NotificationIcon({ variant }: { variant: 'activity' | 'remind' }) {
  if (variant === 'remind') {
    return (
      <SvgIcon size={20} viewBox="0 0 20 20">
        <path
          d="M10 17.5a6.25 6.25 0 1 0 0-12.5 6.25 6.25 0 0 0 0 12.5ZM10 8.1v3.2l2.1 1.25M4.65 3.35 2.75 5.1M15.35 3.35l1.9 1.75M7.35 18.05l-.75 1.2M12.65 18.05l.75 1.2"
          fill="none"
          stroke="#0BC798"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
        />
      </SvgIcon>
    );
  }

  return (
    <SvgIcon size={20} viewBox="0 0 20 20">
      <path
        d="M5.5 4.5h9M5.5 8.5h9M5.5 12.5h5.5M4.2 2.8h11.6A1.2 1.2 0 0 1 17 4v12l-3-2H4.2A1.2 1.2 0 0 1 3 12.8V4a1.2 1.2 0 0 1 1.2-1.2Z"
        fill="none"
        stroke="#707376"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.4"
      />
    </SvgIcon>
  );
}

function MoreIcon() {
  return (
    <SvgIcon size={16} viewBox="0 0 16 16">
      <circle cx="8" cy="3.5" r="1.25" fill="currentColor" />
      <circle cx="8" cy="8" r="1.25" fill="currentColor" />
      <circle cx="8" cy="12.5" r="1.25" fill="currentColor" />
    </SvgIcon>
  );
}
