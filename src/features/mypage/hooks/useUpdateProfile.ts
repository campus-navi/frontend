import { useMutation, useQueryClient } from '@tanstack/react-query';

import { memberApi, type MyPageSummary, type UpdateMemberProfileRequest } from '@/api';
import { MEMBER_ME_QUERY_KEY } from '@/features/home/memberMeQueryKey';
import { MY_PAGE_SUMMARY_QUERY_KEY } from '@/features/mypage/hooks/useMyPageSummary';

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateMemberProfileRequest) => memberApi.updateProfile(payload),
    onSuccess: (_, payload) => {
      queryClient.setQueryData<MyPageSummary>(MY_PAGE_SUMMARY_QUERY_KEY, (current) =>
        current
          ? {
              ...current,
              grade: payload.grade,
              nickname: payload.nickname,
              studentNumber: payload.studentNumber,
            }
          : current,
      );
      queryClient.setQueryData(MEMBER_ME_QUERY_KEY, (current: unknown) => {
        if (!current || typeof current !== 'object') {
          return current;
        }

        return {
          ...current,
          nickname: payload.nickname,
        };
      });
      void queryClient.invalidateQueries({ queryKey: MY_PAGE_SUMMARY_QUERY_KEY });
      void queryClient.invalidateQueries({ queryKey: MEMBER_ME_QUERY_KEY });
    },
  });
}
