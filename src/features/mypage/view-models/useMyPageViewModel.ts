import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import type { MyPageSummary } from '@/api';
import { useMyPageSummary } from '@/features/mypage/hooks/useMyPageSummary';

const fallbackMyPageSummary: MyPageSummary = {
  admissionYear: 0,
  campus: '',
  departments: [],
  name: '캠퍼스네비',
  nickname: '캠퍼스네비',
  email: 'campusnavi@example.com',
  grade: 0,
  interestCount: 0,
  remindCount: 0,
  scrapCount: 0,
  studentNumber: '',
};

export function useMyPageViewModel() {
  const navigate = useNavigate();
  const [isInterestGuideVisible, setIsInterestGuideVisible] = useState(true);
  const { data: myPageSummary, isError, isLoading } = useMyPageSummary();
  const summary = myPageSummary ?? fallbackMyPageSummary;
  const shouldShowInterestGuide = myPageSummary?.interestCount === 0 && isInterestGuideVisible;

  return {
    onCloseInterestGuide: () => setIsInterestGuideVisible(false),
    onEditProfile: () => navigate('/mypage/profile/edit'),
    shouldOffsetSummary: shouldShowInterestGuide || isLoading || isError,
    shouldShowErrorMessage: isError,
    shouldShowInterestGuide,
    shouldShowLoadingMessage: isLoading,
    summary,
  };
}
