import { Navigate, Route, Routes } from 'react-router-dom';

import ApiUniversityTestPage from '@/pages/ApiUniversityTestPage';
import OnboardingPage from '@/pages/OnboardingPage';
import LoginPage from '@/pages/LoginPage';
import SignupPage from '@/pages/SignupPage';

export default function App() {
  return (
    <Routes>
      <Route index element={<OnboardingPage />} />
      <Route path="/api-test/universities" element={<ApiUniversityTestPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="*" element={<Navigate replace to="/" />} />
    </Routes>
  );
}
