import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';

import { isApiError } from '@/api';
import {
  CardNewsCarousel,
  type CardNewsItem,
} from '@/features/card-news/components/CardNewsCarousel';
import { NotificationStateMessage } from '@/features/notifications/components/NotificationStateMessage';
import {
  ACTIVITY_NOTIFICATIONS_QUERY_KEY,
} from '@/features/notifications/hooks/useActivityNotifications';
import { useActivityNotificationPosts } from '@/features/notifications/hooks/useActivityNotificationPosts';

function isValidMissedDate(value: string | undefined): value is string {
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function toCardNewsItems(posts: NonNullable<ReturnType<typeof useActivityNotificationPosts>['data']>): CardNewsItem[] {
  return posts.map(({ imageUrl, postId, summary, tagName, title }) => ({
    imageUrl,
    postId,
    summary,
    tagName,
    title,
  }));
}

export function NotificationActivityDetailPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { missedDate } = useParams();
  const normalizedMissedDate = isValidMissedDate(missedDate) ? missedDate : null;
  const query = useActivityNotificationPosts(normalizedMissedDate);
  const isNotFound = isApiError(query.error) && query.error.status === 404;
  const isUnauthorized = isApiError(query.error) && query.error.status === 401;

  useEffect(() => {
    if (!query.isSuccess) {
      return;
    }

    void queryClient.invalidateQueries({ exact: true, queryKey: ACTIVITY_NOTIFICATIONS_QUERY_KEY });
  }, [query.isSuccess, queryClient]);

  const handleBackClick = () => {
    navigate('/notifications/activity', { replace: true });
  };

  if (!normalizedMissedDate) {
    return (
      <NotificationDetailMessage
        message="올바른 활동 알림 날짜를 찾을 수 없어요."
        onBackClick={handleBackClick}
      />
    );
  }

  if (query.isLoading) {
    return <NotificationDetailMessage isLoading message="놓친 공지를 불러오는 중이에요." onBackClick={handleBackClick} />;
  }

  if (query.isError) {
    return (
      <NotificationDetailMessage
        message={
          isNotFound
            ? '해당 날짜의 활동 알림을 찾을 수 없어요.'
            : isUnauthorized
              ? '로그인이 필요한 알림이에요.'
              : '놓친 공지를 불러오지 못했어요.'
        }
        onBackClick={handleBackClick}
        onRetry={isNotFound ? undefined : () => void query.refetch()}
      />
    );
  }

  const cardNewsItems = toCardNewsItems(query.data ?? []);

  if (cardNewsItems.length === 0) {
    return (
      <NotificationDetailMessage
        message="확인할 놓친 공지가 없어요."
        onBackClick={handleBackClick}
      />
    );
  }

  return (
    <CardNewsCarousel
      initialPostId={cardNewsItems[0].postId}
      items={cardNewsItems}
      onBackClick={handleBackClick}
      onNoticeDetailClick={(postId) => navigate(`/info/posts/${postId}`)}
    />
  );
}

function NotificationDetailMessage({
  isLoading = false,
  message,
  onBackClick,
  onRetry,
}: {
  isLoading?: boolean;
  message: string;
  onBackClick: () => void;
  onRetry?: () => void;
}) {
  return (
    <main className="min-h-[100svh] bg-white">
      <div className="mx-auto flex min-h-[100svh] w-full max-w-[393px] flex-col bg-white">
        <div className="pt-[max(20px,env(safe-area-inset-top))]">
          <button
            type="button"
            className="ml-4 flex h-10 w-10 items-center justify-start text-[#292B2C]"
            aria-label="뒤로가기"
            onClick={onBackClick}
          >
            ←
          </button>
        </div>
        <NotificationStateMessage
          isLoading={isLoading}
          message={message}
          action={
            onRetry
              ? {
                  label: '다시 시도',
                  onClick: onRetry,
                }
              : {
                  label: '알림으로 돌아가기',
                  onClick: onBackClick,
                }
          }
        />
      </div>
    </main>
  );
}
