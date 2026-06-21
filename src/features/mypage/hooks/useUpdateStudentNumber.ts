import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  memberApi,
  type MyPageSummary,
  type UpdateStudentNumberRequest,
} from '@/api';
import { MY_PAGE_SUMMARY_QUERY_KEY } from '@/features/mypage/hooks/useMyPageSummary';

export function useUpdateStudentNumber() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateStudentNumberRequest) =>
      memberApi.updateStudentNumber(payload),
    onSuccess: (_, payload) => {
      queryClient.setQueryData<MyPageSummary>(MY_PAGE_SUMMARY_QUERY_KEY, (current) =>
        current
          ? {
              ...current,
              admissionYear: payload.admissionYear,
              studentNumber: payload.studentNumber,
            }
          : current,
      );
      void queryClient.invalidateQueries({ queryKey: MY_PAGE_SUMMARY_QUERY_KEY });
    },
  });
}
