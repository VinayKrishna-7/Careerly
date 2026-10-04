import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Spinner from '../ui/Spinner.jsx';

export const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useSelector((state) => state.auth);
  const location = useLocation();

  const hasToken = typeof window !== 'undefined' && Boolean(localStorage.getItem('token'));

  // If user has no token and is not authenticated, immediately redirect to login
  if (!hasToken && !isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If user has a token and is currently authenticating, show loader
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#faf5eb] dark:bg-[#000000]">
        <Spinner size="lg" message="Authenticating session..." />
      </div>
    );
  }

  // If verification failed or ended without auth, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
