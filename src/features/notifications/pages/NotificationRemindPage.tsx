import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { isApiError } from '@/api';
import { NotificationListItem } from '@/features/notifications/components/NotificationListItem';
import { NotificationStateMessage } from '@/features/notifications/components/NotificationStateMessage';
import { NotificationsShell } from '@/features/notifications/components/NotificationsShell';
import { useDisableReminderNotification } from '@/features/notifications/hooks/useDisableReminderNotification';
import { useReminderNotifications } from '@/features/notifications/hooks/useReminderNotifications';
import { formatReminderDDay } from '@/features/notifications/utils/notificationDate';

export function NotificationRemindPage() {
  const navigate = useNavigate();
  const [openMenuPostId, setOpenMenuPostId] = useState<number | null>(null);
  const { data, error, isError, isLoading, refetch } = useReminderNotifications();
  const disableReminderNotification = useDisableReminderNotification();
  const notifications = data ?? [];
  const isUnauthorized = isApiError(error) && error.status === 401;

  const handleRemoveNotification = (postId: number) => {
    disableReminderNotification.mutate(postId, {
      onSuccess: () => setOpenMenuPostId(null),
    });
  };

  return (
    <NotificationsShell activeTab="remind">
      <section className="flex flex-1 flex-col px-4">
        {isLoading ? <NotificationStateMessage isLoading message="리마인드 알림을 불러오는 중이에요." /> : null}
        {!isLoading && isError ? (
          <NotificationStateMessage
            message={
              isUnauthorized
                ? '로그인이 필요한 알림이에요.'
                : '리마인드 알림을 불러오지 못했어요.'
            }
            action={{ label: '다시 시도', onClick: () => void refetch() }}
          />
        ) : null}
        {!isLoading && !isError && notifications.length === 0 ? (
          <NotificationStateMessage message="확인할 리마인드 알림이 없어요." />
        ) : null}
        {!isLoading && !isError && notifications.length > 0 ? (
          <div className="flex flex-col gap-7 pt-5">
            {notifications.map((notification) => (
              <NotificationListItem
                key={notification.postId}
                description="공지의 마감기한이 얼마 남지 않았어요"
                isRemoveMenuOpen={openMenuPostId === notification.postId}
                isRemovePending={
                  disableReminderNotification.isPending &&
                  disableReminderNotification.variables === notification.postId
                }
                meta={formatReminderDDay(notification.endDate)}
                metaPlacement="footer"
                title={notification.title}
                typeLabel="마감기한 알림"
                variant="remind"
                onCloseRemoveMenu={() => setOpenMenuPostId(null)}
                onClick={() => navigate(`/info/posts/${notification.postId}`)}
                onMoreClick={() =>
                  setOpenMenuPostId((currentPostId) =>
                    currentPostId === notification.postId ? null : notification.postId,
                  )
                }
                onRemove={() => handleRemoveNotification(notification.postId)}
              />
            ))}
          </div>
        ) : null}
      </section>
    </NotificationsShell>
  );
}
