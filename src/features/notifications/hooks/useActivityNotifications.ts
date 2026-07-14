import { useQuery } from '@tanstack/react-query';

import { notificationApi } from '@/api';

export const ACTIVITY_NOTIFICATIONS_QUERY_KEY = ['notifications', 'activity'] as const;

export function useActivityNotifications() {
  return useQuery({
    queryFn: async () => {
      const response = await notificationApi.getActivityNotifications();

      return response.data;
    },
    queryKey: ACTIVITY_NOTIFICATIONS_QUERY_KEY,
  });
}
