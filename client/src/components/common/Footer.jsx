import React from 'react';
import { Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="border-t border-black/10 dark:border-white/10 bg-[#faf5eb] dark:bg-black py-6 sm:py-8 text-sm text-black dark:text-[#faf5eb] no-print mt-auto transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Brand & Tagline */}
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 text-center sm:text-left">
            <Link
              to="/"
              className="flex items-center gap-2.5 font-display font-extrabold text-base sm:text-lg text-black dark:text-[#faf5eb] hover:opacity-90 transition-opacity"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-black text-[#faf5eb] dark:bg-[#faf5eb] dark:text-black shadow-xs">
                <Sparkles className="h-4 w-4" />
              </div>
              <span>
                Career<span>ly</span>
              </span>
            </Link>
            <span className="text-black/30 dark:text-white/30 hidden sm:inline">•</span>
            <span className="text-xs sm:text-sm text-[#756d61] dark:text-[#a39b8e] font-medium">
              Modern ATS Resume &amp; Career Builder
            </span>
          </div>

          {/* Quick Nav Links */}
          <div className="flex items-center gap-6 text-xs sm:text-sm font-semibold text-[#5c5549] dark:text-[#c8c1b3]">
            <Link
              to="/dashboard"
              className="hover:text-black dark:hover:text-white transition-colors"
            >
              Resumes
            </Link>
            <Link
              to="/cover-letters"
              className="hover:text-black dark:hover:text-white transition-colors"
            >
              Cover Letters
            </Link>
            <Link
              to="/profile"
              className="hover:text-black dark:hover:text-white transition-colors"
            >
              Account
            </Link>
          </div>

          {/* Copyright */}
          <div className="text-xs sm:text-sm text-[#756d61] dark:text-[#a39b8e] font-medium text-center sm:text-right">
            © {new Date().getFullYear()} Careerly. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
