import React from 'react';
import { Sparkles, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="border-t border-slate-200 bg-white dark:bg-slate-900 dark:border-slate-800 py-12 text-slate-600 dark:text-slate-400 transition-colors no-print">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2.5 font-display font-extrabold text-slate-900 dark:text-white text-lg tracking-tight">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-600 via-indigo-600 to-purple-600 text-white shadow-md shadow-brand-500/20">
                <Sparkles className="h-4 w-4" />
              </div>
              <span>
                Career<span className="text-brand-600 dark:text-brand-400">ly</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
              Build modern, professional, ATS-optimized resumes and tailored cover letters in minutes. Export pixel-perfect PDFs, switch elegant templates in real-time, and impress hiring managers.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">Product</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/dashboard" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  Resume Builder
                </Link>
              </li>
              <li>
                <a href="#templates" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  Template Gallery
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  Live Preview & PDF
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">Security & Quality</h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                <span>🛡️</span> Data Privacy First
              </li>
              <li className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                <span>⚡</span> Instant A4 PDF Rendering
              </li>
              <li className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                <span>🎯</span> 100% ATS Friendly
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 dark:text-slate-500">
          <p>© {new Date().getFullYear()} Careerly SaaS. All rights reserved.</p>
          <div className="flex items-center gap-1">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>using MERN & Tailwind CSS</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
