import { useMutation, useQueryClient } from '@tanstack/react-query';

import { officialPostApi, type OfficialPostDetail, type ReminderNotification } from '@/api';
import { MY_PAGE_SUMMARY_QUERY_KEY } from '@/features/mypage/hooks/useMyPageSummary';
import { getOfficialPostDetailQueryKey } from '@/features/official-posts/hooks/useOfficialPostDetail';
import { REMINDER_NOTIFICATIONS_QUERY_KEY } from '@/features/notifications/hooks/useReminderNotifications';

export function useDisableReminderNotification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postId: number) => {
      await officialPostApi.disableNotification(postId);
      return postId;
    },
    onSuccess: (postId) => {
      queryClient.setQueryData<ReminderNotification[]>(
        REMINDER_NOTIFICATIONS_QUERY_KEY,
        (current) => current?.filter((notification) => notification.postId !== postId) ?? current,
      );
      queryClient.setQueryData<OfficialPostDetail>(
        getOfficialPostDetailQueryKey(postId),
        (current) => (current ? { ...current, isNotificationOn: false } : current),
      );
      void queryClient.invalidateQueries({ exact: true, queryKey: REMINDER_NOTIFICATIONS_QUERY_KEY });
      void queryClient.invalidateQueries({ queryKey: MY_PAGE_SUMMARY_QUERY_KEY });
    },
  });
}
