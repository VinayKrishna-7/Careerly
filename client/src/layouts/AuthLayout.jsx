import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import ThemeToggle from '../components/ui/ThemeToggle.jsx';

export const AuthLayout = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 relative overflow-hidden transition-colors">
      {/* Background Subtle Gradient Blobs */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-brand-200/40 dark:bg-brand-900/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-200/40 dark:bg-indigo-900/20 rounded-full blur-3xl pointer-events-none" />

      {/* Top right theme toggle */}
      <div className="absolute top-4 right-4 z-20">
        <ThemeToggle />
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center z-10">
        <Link to="/" className="inline-flex items-center gap-2.5 font-display font-extrabold text-slate-900 dark:text-white text-2xl tracking-tight">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-600 via-indigo-600 to-purple-600 text-white shadow-md shadow-brand-500/20">
            <Sparkles className="h-6 w-6" />
          </div>
          <span>
            Career<span className="text-brand-600 dark:text-brand-400">ly</span>
          </span>
        </Link>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10 px-4 sm:px-0">
        <div className="bg-white dark:bg-slate-900 py-8 px-6 sm:px-10 shadow-floating rounded-2xl border border-slate-100 dark:border-slate-800 transition-colors">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
