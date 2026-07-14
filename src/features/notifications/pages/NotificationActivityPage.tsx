import { useNavigate } from 'react-router-dom';

import { isApiError } from '@/api';
import { NotificationListItem } from '@/features/notifications/components/NotificationListItem';
import { NotificationStateMessage } from '@/features/notifications/components/NotificationStateMessage';
import { NotificationsShell } from '@/features/notifications/components/NotificationsShell';
import { useActivityNotifications } from '@/features/notifications/hooks/useActivityNotifications';
import { formatMissedDateLabel } from '@/features/notifications/utils/notificationDate';

export function NotificationActivityPage() {
  const navigate = useNavigate();
  const { data, error, isError, isLoading, refetch } = useActivityNotifications();
  const notifications = data ?? [];
  const isUnauthorized = isApiError(error) && error.status === 401;

  return (
    <NotificationsShell activeTab="activity">
      <section className="flex flex-1 flex-col px-4">
        {isLoading ? <NotificationStateMessage isLoading message="활동 알림을 불러오는 중이에요." /> : null}
        {!isLoading && isError ? (
          <NotificationStateMessage
            message={
              isUnauthorized
                ? '로그인이 필요한 알림이에요.'
                : '활동 알림을 불러오지 못했어요.'
            }
            action={{ label: '다시 시도', onClick: () => void refetch() }}
          />
        ) : null}
        {!isLoading && !isError && notifications.length === 0 ? (
          <NotificationStateMessage message="확인할 활동 알림이 없어요." />
        ) : null}
        {!isLoading && !isError && notifications.length > 0 ? (
          <div className="divide-y divide-[#EEF0F2]">
            {notifications.map((notification) => (
              <NotificationListItem
                key={notification.missedDate}
                actionLabel={`${notification.count}건 확인하기`}
                description="놓친 추천 공지가 있어요"
                meta={formatMissedDateLabel(notification.missedDate)}
                title="추천 공지를 놓치셨어요."
                typeLabel="활동 알림"
                variant="activity"
                onClick={() => navigate(`/notifications/activity/${notification.missedDate}`)}
              />
            ))}
          </div>
        ) : null}
      </section>
    </NotificationsShell>
  );
}
