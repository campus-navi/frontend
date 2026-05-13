import { Navigate, Route, Routes } from 'react-router-dom';

import CardNewsDetailPage from '@/pages/CardNewsDetailPage';
import HomePage from '@/pages/HomePage';
import InfoPage from '@/pages/InfoPage';
import InfoPostDetailPage from '@/pages/InfoPostDetailPage';
import InfoSearchPage from '@/pages/InfoSearchPage';
import NoticeInterestsCompletePage from '@/pages/NoticeInterestsCompletePage';
import NoticeInterestsPage from '@/pages/NoticeInterestsPage';
import OnboardingPage from '@/pages/OnboardingPage';
import LoginPage from '@/pages/LoginPage';
import SignupCompletePage from '@/pages/SignupCompletePage';
import SignupPage from '@/pages/SignupPage';

export default function App() {
  return (
    <Routes>
      <Route index element={<OnboardingPage />} />
      <Route path="/card-news/:postId" element={<CardNewsDetailPage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/info" element={<InfoPage />} />
      <Route path="/info/posts/:postId" element={<InfoPostDetailPage />} />
      <Route path="/info/search" element={<InfoSearchPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/notice-interests" element={<NoticeInterestsPage />} />
      <Route path="/notice-interests/complete" element={<NoticeInterestsCompletePage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/signup/complete" element={<SignupCompletePage />} />
      <Route path="*" element={<Navigate replace to="/" />} />
    </Routes>
  );
}
