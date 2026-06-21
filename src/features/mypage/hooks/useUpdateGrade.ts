import { useMutation, useQueryClient } from '@tanstack/react-query';

import { memberApi, type MyPageSummary, type UpdateGradeRequest } from '@/api';
import { MY_PAGE_SUMMARY_QUERY_KEY } from '@/features/mypage/hooks/useMyPageSummary';

export function useUpdateGrade() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateGradeRequest) => memberApi.updateGrade(payload),
    onSuccess: (_, payload) => {
      queryClient.setQueryData<MyPageSummary>(MY_PAGE_SUMMARY_QUERY_KEY, (current) =>
        current ? { ...current, grade: payload.grade } : current,
      );
      void queryClient.invalidateQueries({ queryKey: MY_PAGE_SUMMARY_QUERY_KEY });
    },
  });
}
