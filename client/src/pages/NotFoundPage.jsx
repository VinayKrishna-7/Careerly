import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button.jsx';
import { Home } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 space-y-4">
      <span className="text-6xl font-extrabold text-brand-600 dark:text-brand-400 font-display">404</span>
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Page Not Found</h1>
      <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm">
        The page you are looking for does not exist or might have been moved.
      </p>
      <div className="pt-2">
        <Link to="/">
          <Button size="sm" leftIcon={<Home className="h-4 w-4" />}>
            Return Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
