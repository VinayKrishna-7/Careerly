import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Spinner from '../ui/Spinner.jsx';

export const PublicRoute = () => {
  const { isAuthenticated, isLoading } = useSelector((state) => state.auth);

  const hasToken = typeof window !== 'undefined' && Boolean(localStorage.getItem('token'));

  if (isLoading && hasToken) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#faf5eb] dark:bg-[#000000]">
        <Spinner size="lg" message="Loading..." />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default PublicRoute;
