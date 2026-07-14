import { useNavigate } from 'react-router-dom';

import { isApiError } from '@/api';
import { NotificationListItem } from '@/features/notifications/components/NotificationListItem';
import { NotificationStateMessage } from '@/features/notifications/components/NotificationStateMessage';
import { NotificationsShell } from '@/features/notifications/components/NotificationsShell';
import { useMemberMe } from '@/features/home/hooks/useMemberMe';
import { useActivityNotifications } from '@/features/notifications/hooks/useActivityNotifications';
import {
  formatMissedDateLabel,
  formatMissedNoticeTitle,
  getMissedDateDayDiff,
} from '@/features/notifications/utils/notificationDate';

export function NotificationActivityPage() {
  const navigate = useNavigate();
  const { data, error, isError, isLoading, refetch } = useActivityNotifications();
  const memberMe = useMemberMe();
  const notifications = data ?? [];
  const isUnauthorized = isApiError(error) && error.status === 401;
  const latestBoundaryIndex = notifications.findIndex((notification) => {
    const dayDiff = getMissedDateDayDiff(notification.missedDate);

    return dayDiff !== null && dayDiff > 1;
  });
  const shouldShowLatestBoundary = latestBoundaryIndex > 0;

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
          <div className="flex flex-col gap-6 pt-5">
            {notifications.map((notification, index) => (
              <div key={notification.missedDate} className="contents">
                {shouldShowLatestBoundary && index === latestBoundaryIndex ? (
                  <div className="flex h-[66px] items-center justify-center text-[12px] font-normal leading-[18px] text-[#BFC4C8]">
                    여기까지가 최신 알림이에요.
                  </div>
                ) : null}
                <NotificationListItem
                  actionLabel={`${notification.count}건 확인하기`}
                  description=""
                  meta={formatMissedDateLabel(notification.missedDate)}
                  title={formatMissedNoticeTitle(notification.missedDate, memberMe.data?.nickname)}
                  typeLabel="지나친 공지"
                  variant="activity"
                  onClick={() =>
                    navigate(`/notifications/activity/${notification.missedDate}`, {
                      state: { fromActivityList: true },
                    })
                  }
                />
              </div>
            ))}
          </div>
        ) : null}
      </section>
    </NotificationsShell>
  );
}
