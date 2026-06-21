import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  memberApi,
  type MyPageSummary,
  type UpdateMemberStudentNumberRequest,
} from '@/api';
import { MY_PAGE_SUMMARY_QUERY_KEY } from '@/features/mypage/hooks/useMyPageSummary';

export function useUpdateStudentNumber() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateMemberStudentNumberRequest) =>
      memberApi.updateStudentNumber(payload),
    onSuccess: (_, payload) => {
      queryClient.setQueryData<MyPageSummary>(MY_PAGE_SUMMARY_QUERY_KEY, (current) =>
        current ? { ...current, studentNumber: payload.studentNumber } : current,
      );
      void queryClient.invalidateQueries({ queryKey: MY_PAGE_SUMMARY_QUERY_KEY });
    },
  });
}
