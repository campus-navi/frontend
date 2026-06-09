import { useState } from 'react';

import type { MyPageSummary } from '@/api';
import { useMyPageSummary } from '@/features/mypage/hooks/useMyPageSummary';

const fallbackMyPageSummary: MyPageSummary = {
  admissionYear: 0,
  campus: '',
  departments: [],
  nickname: '캠퍼스네비',
  email: 'campusnavi@example.com',
  grade: 0,
  interestCount: 0,
  remindCount: 0,
  scrapCount: 0,
};

export function useMyPageViewModel() {
  const [isInterestGuideVisible, setIsInterestGuideVisible] = useState(true);
  const { data: myPageSummary, isError, isLoading } = useMyPageSummary();
  const summary = myPageSummary ?? fallbackMyPageSummary;
  const shouldShowInterestGuide = myPageSummary?.interestCount === 0 && isInterestGuideVisible;

  return {
    onCloseInterestGuide: () => setIsInterestGuideVisible(false),
    shouldOffsetSummary: shouldShowInterestGuide || isLoading || isError,
    shouldShowErrorMessage: isError,
    shouldShowInterestGuide,
    shouldShowLoadingMessage: isLoading,
    summary,
  };
}
