import { useQuery } from '@tanstack/react-query';

import { notificationApi } from '@/api';

export const activityNotificationPostsQueryKey = (missedDate: string) =>
  ['notifications', 'activity', missedDate] as const;

export function useActivityNotificationPosts(missedDate: string | null) {
  return useQuery({
    enabled: Boolean(missedDate),
    queryFn: async () => {
      if (!missedDate) {
        throw new Error('조회할 활동 알림 날짜가 없습니다.');
      }

      const response = await notificationApi.getActivityNotificationPosts(missedDate);

      return response.data;
    },
    queryKey: activityNotificationPostsQueryKey(missedDate ?? ''),
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    retry: false,
    staleTime: Infinity,
  });
}
