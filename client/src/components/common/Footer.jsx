import React from 'react';
import { Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/90 backdrop-blur-md py-6 sm:py-8 text-sm text-slate-600 dark:text-slate-300 no-print mt-auto transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Brand & Tagline */}
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 text-center sm:text-left">
            <Link
              to="/"
              className="flex items-center gap-2.5 font-display font-extrabold text-base sm:text-lg text-slate-900 dark:text-white hover:opacity-90 transition-opacity"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-600 text-white shadow-sm">
                <Sparkles className="h-4 w-4" />
              </div>
              <span>
                Career<span className="text-brand-600 dark:text-brand-400">ly</span>
              </span>
            </Link>
            <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">•</span>
            <span className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
              Modern ATS Resume &amp; Career Builder
            </span>
          </div>

          {/* Quick Nav Links */}
          <div className="flex items-center gap-6 text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300">
            <Link
              to="/dashboard"
              className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
            >
              Resumes
            </Link>
            <Link
              to="/cover-letters"
              className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
            >
              Cover Letters
            </Link>
            <Link
              to="/profile"
              className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
            >
              Account
            </Link>
          </div>

          {/* Copyright */}
          <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium text-center sm:text-right">
            © {new Date().getFullYear()} Careerly. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
