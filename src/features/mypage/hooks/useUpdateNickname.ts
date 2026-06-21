import { useMutation, useQueryClient } from '@tanstack/react-query';

import { memberApi, type MyPageSummary, type UpdateMemberNicknameRequest } from '@/api';
import { MEMBER_ME_QUERY_KEY } from '@/features/home/memberMeQueryKey';
import { MY_PAGE_SUMMARY_QUERY_KEY } from '@/features/mypage/hooks/useMyPageSummary';

export function useUpdateNickname() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateMemberNicknameRequest) =>
      memberApi.updateNickname(payload),
    onSuccess: (_, payload) => {
      queryClient.setQueryData<MyPageSummary>(MY_PAGE_SUMMARY_QUERY_KEY, (current) =>
        current ? { ...current, nickname: payload.nickname } : current,
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
