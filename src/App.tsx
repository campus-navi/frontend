import { Navigate, Route, Routes } from 'react-router-dom';

import { ProtectedRoute } from '@/components/routing/ProtectedRoute';
import { PublicOnlyRoute } from '@/components/routing/PublicOnlyRoute';
import CardNewsDetailPage from '@/pages/CardNewsDetailPage';
import DeadlinesPage from '@/pages/DeadlinesPage';
import HomePage from '@/pages/HomePage';
import InfoPage from '@/pages/InfoPage';
import InfoPostDetailPage from '@/pages/InfoPostDetailPage';
import InfoSearchPage from '@/pages/InfoSearchPage';
import MyPage from '@/pages/MyPage';
import MyPageProfileEditPage from '@/pages/MyPageProfileEditPage';
import MyPageProfileNicknameEditPage from '@/pages/MyPageProfileNicknameEditPage';
import MyPageProfileStudentNumberEditPage from '@/pages/MyPageProfileStudentNumberEditPage';
import MyPageScrapFolderPage from '@/pages/MyPageScrapFolderPage';
import MyPageScrapsPage from '@/pages/MyPageScrapsPage';
import NoticeInterestsCompletePage from '@/pages/NoticeInterestsCompletePage';
import NoticeInterestsPage from '@/pages/NoticeInterestsPage';
import OnboardingPage from '@/pages/OnboardingPage';
import LoginPage from '@/pages/LoginPage';
import SignupCompletePage from '@/pages/SignupCompletePage';
import SignupPage from '@/pages/SignupPage';

export default function App() {
  return (
    <Routes>
      <Route
        index
        element={
          <PublicOnlyRoute>
            <OnboardingPage />
          </PublicOnlyRoute>
        }
      />
      <Route
        path="/card-news/:postId"
        element={
          <ProtectedRoute>
            <CardNewsDetailPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/deadlines"
        element={
          <ProtectedRoute>
            <DeadlinesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/info"
        element={
          <ProtectedRoute>
            <InfoPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/info/posts/:postId"
        element={
          <ProtectedRoute>
            <InfoPostDetailPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/official-posts/:postId"
        element={
          <ProtectedRoute>
            <InfoPostDetailPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/info/search"
        element={
          <ProtectedRoute>
            <InfoSearchPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/mypage"
        element={
          <ProtectedRoute>
            <MyPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/mypage/profile/edit"
        element={
          <ProtectedRoute>
            <MyPageProfileEditPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/mypage/profile/edit/nickname"
        element={
          <ProtectedRoute>
            <MyPageProfileNicknameEditPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/mypage/profile/edit/student-number"
        element={
          <ProtectedRoute>
            <MyPageProfileStudentNumberEditPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/mypage/scraps"
        element={
          <ProtectedRoute>
            <MyPageScrapsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/mypage/scraps/folders/:folderId"
        element={
          <ProtectedRoute>
            <MyPageScrapFolderPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/login"
        element={
          <PublicOnlyRoute>
            <LoginPage />
          </PublicOnlyRoute>
        }
      />
      <Route
        path="/notice-interests"
        element={
          <ProtectedRoute>
            <NoticeInterestsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/notice-interests/complete"
        element={
          <ProtectedRoute>
            <NoticeInterestsCompletePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/signup"
        element={
          <PublicOnlyRoute>
            <SignupPage />
          </PublicOnlyRoute>
        }
      />
      <Route path="/signup/complete" element={<SignupCompletePage />} />
      <Route path="*" element={<Navigate replace to="/" />} />
    </Routes>
  );
}
