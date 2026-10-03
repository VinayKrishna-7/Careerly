import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import ThemeToggle from '../components/ui/ThemeToggle.jsx';

export const AuthLayout = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 relative overflow-hidden transition-colors">
      {/* Top right theme toggle */}
      <div className="absolute top-4 right-4 z-20">
        <ThemeToggle />
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center z-10">
        <Link to="/" className="inline-flex items-center gap-2.5 font-display font-extrabold text-black dark:text-[#faf5eb] text-2xl tracking-tight">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black text-[#faf5eb] dark:bg-[#faf5eb] dark:text-black shadow-xs">
            <Sparkles className="h-6 w-6" />
          </div>
          <span>
            Career<span>ly</span>
          </span>
        </Link>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10 px-4 sm:px-0">
        <div className="bg-white dark:bg-[#0c0c0e] py-8 px-6 sm:px-10 shadow-floating rounded-2xl border border-black/15 dark:border-[#222225] transition-colors">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
