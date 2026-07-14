import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

import { AppHeader } from '@/components/ui/AppHeader';
import { NotificationTabs } from '@/features/notifications/components/NotificationTabs';

export function NotificationsShell({
  activeTab,
  children,
}: {
  activeTab: 'activity' | 'remind';
  children: ReactNode;
}) {
  const navigate = useNavigate();

  return (
    <main className="min-h-[100svh] bg-white">
      <div className="mx-auto flex min-h-[100svh] w-full max-w-[393px] flex-col bg-white">
        <AppHeader title="알림" onBack={() => navigate(-1)} />
        <NotificationTabs activeTab={activeTab} />
        {children}
      </div>
    </main>
  );
}
