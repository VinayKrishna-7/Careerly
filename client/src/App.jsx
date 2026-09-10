import React, { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { checkAuth } from './store/slices/authSlice.js';

// Layouts
import AppLayout from './layouts/AppLayout.jsx';
import AuthLayout from './layouts/AuthLayout.jsx';
import ProtectedRoute from './components/common/ProtectedRoute.jsx';
import PublicRoute from './components/common/PublicRoute.jsx';
import Spinner from './components/ui/Spinner.jsx';

// Pages (Lazy Loaded for maximum speed and instant initial bundle rendering)
const LandingPage = lazy(() => import('./pages/LandingPage.jsx'));
const LoginPage = lazy(() => import('./pages/LoginPage.jsx'));
const RegisterPage = lazy(() => import('./pages/RegisterPage.jsx'));
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage.jsx'));
const ResetPasswordPage = lazy(() => import('./pages/ResetPasswordPage.jsx'));
const DashboardPage = lazy(() => import('./pages/DashboardPage.jsx'));
const ResumeEditorPage = lazy(() => import('./pages/ResumeEditorPage.jsx'));
const ResumePreviewPage = lazy(() => import('./pages/ResumePreviewPage.jsx'));
const ProfilePage = lazy(() => import('./pages/ProfilePage.jsx'));
const CoverLetterDashboardPage = lazy(() => import('./pages/CoverLetterDashboardPage.jsx'));
const CoverLetterEditorPage = lazy(() => import('./pages/CoverLetterEditorPage.jsx'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage.jsx'));
import Toast from './components/ui/Toast.jsx';

const PageLoader = () => (
  <div className="min-h-[70vh] flex items-center justify-center">
    <Spinner size="md" />
  </div>
);

export const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Verify existing session on initial application load
    dispatch(checkAuth());
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Public Landing & Marketing */}
          <Route element={<AppLayout />}>
            <Route path="/" element={<LandingPage />} />
          </Route>

          {/* Auth Pages (Restricted to logged-out users) */}
          <Route element={<PublicRoute />}>
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
            </Route>
          </Route>

          {/* Password Recovery Flows */}
          <Route element={<AuthLayout />}>
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
          </Route>

          {/* Protected Dashboard & Settings */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/cover-letters" element={<CoverLetterDashboardPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Route>

            {/* Full-view Editor & Fullscreen Preview */}
            <Route path="/editor/:id" element={<ResumeEditorPage />} />
            <Route path="/preview/:id" element={<ResumePreviewPage />} />
            <Route path="/cover-letters/editor/:id" element={<CoverLetterEditorPage />} />
          </Route>

          {/* 404 Not Found Catch-All */}
          <Route element={<AppLayout />}>
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </Suspense>
      <Toast />
    </BrowserRouter>
  );
};

export default App;
