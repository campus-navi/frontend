import { Link } from 'react-router-dom';

type NotificationTab = 'activity' | 'remind';

export function NotificationTabs({ activeTab }: { activeTab: NotificationTab }) {
  return (
    <div className="grid h-[54px] grid-cols-2 border-b border-[#EEF0F2]" role="tablist" aria-label="알림 유형">
      <NotificationTabLink active={activeTab === 'activity'} to="/notifications/activity">
        활동
      </NotificationTabLink>
      <NotificationTabLink active={activeTab === 'remind'} to="/notifications/remind">
        리마인드
      </NotificationTabLink>
    </div>
  );
}

function NotificationTabLink({
  active,
  children,
  to,
}: {
  active: boolean;
  children: string;
  to: string;
}) {
  return (
    <Link
      to={to}
      role="tab"
      aria-selected={active}
      className={[
        'relative flex h-full items-center justify-center text-[16px] leading-none tracking-normal',
        active ? 'font-semibold text-[#292B2C]' : 'font-medium text-[#9EA4AA]',
      ].join(' ')}
    >
      {children}
      {active ? <span className="absolute bottom-0 h-0.5 w-full bg-[#292B2C]" aria-hidden="true" /> : null}
    </Link>
  );
}
