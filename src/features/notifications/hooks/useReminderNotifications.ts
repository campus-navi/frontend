import { useQuery } from '@tanstack/react-query';

import { notificationApi } from '@/api';

export const REMINDER_NOTIFICATIONS_QUERY_KEY = ['notifications', 'remind'] as const;

export function useReminderNotifications() {
  return useQuery({
    queryFn: async () => {
      const response = await notificationApi.getReminderNotifications();

      return response.data;
    },
    queryKey: REMINDER_NOTIFICATIONS_QUERY_KEY,
  });
}
