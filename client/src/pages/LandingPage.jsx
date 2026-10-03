import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Button from '../components/ui/Button.jsx';
import {
  Download,
  ArrowRight,
  UserPlus,
  LogIn,
  ShieldCheck,
  Layers,
  Sparkles
} from 'lucide-react';

export const LandingPage = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <div className="space-y-20 sm:space-y-28 pb-20 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* HERO SECTION */}
      <section className="pt-16 sm:pt-24 lg:pt-28">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-extrabold text-slate-950 dark:text-white tracking-tight leading-tight max-w-4xl mx-auto">
            Create clean, job-ready resumes in minutes.
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Careerly is a simple, free resume and cover letter builder. Fill in your experience, choose your layout, and download a clean PDF designed to pass applicant tracking systems.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
            {isAuthenticated ? (
              <Link to="/dashboard">
                <Button size="lg" className="px-8 py-3 font-bold text-base gap-2">
                  <span>Go to My Resumes</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/register">
                  <Button size="lg" className="px-8 py-3 font-bold text-base gap-2">
                    <UserPlus className="h-4 w-4" />
                    <span>Build Your Resume — Free</span>
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="outline" size="lg" className="px-7 py-3 font-semibold text-base gap-2">
                    <LogIn className="h-4 w-4" />
                    <span>Sign In</span>
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* CORE FEATURES (SIMPLE 4-CARD GRID) */}
      <section id="features" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-black dark:text-[#faf5eb]">
            Everything you need to apply with confidence
          </h2>
          <p className="text-sm sm:text-base text-[#5c5549] dark:text-[#a39b8e]">
            Straightforward tools designed to get your resume ready for applications.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-[#0c0c0e] border border-black/15 dark:border-[#222225] space-y-3 shadow-xs">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black text-[#faf5eb] dark:bg-[#faf5eb] dark:text-black shadow-xs">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-black dark:text-[#faf5eb]">ATS-Optimized</h3>
            <p className="text-xs text-[#5c5549] dark:text-[#a39b8e] leading-relaxed">
              Clean semantic structures and universal fonts that applicant tracking systems parse without errors.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-[#0c0c0e] border border-black/15 dark:border-[#222225] space-y-3 shadow-xs">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black text-[#faf5eb] dark:bg-[#faf5eb] dark:text-black shadow-xs">
              <Sparkles className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-black dark:text-[#faf5eb]">Live Real-Time Preview</h3>
            <p className="text-xs text-[#5c5549] dark:text-[#a39b8e] leading-relaxed">
              Watch your resume update as you type. Switch between all 9 layouts anytime with zero loss of content.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-[#0c0c0e] border border-black/15 dark:border-[#222225] space-y-3 shadow-xs">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black text-[#faf5eb] dark:bg-[#faf5eb] dark:text-black shadow-xs">
              <Layers className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-black dark:text-[#faf5eb]">Custom Sections &amp; Order</h3>
            <p className="text-xs text-[#5c5549] dark:text-[#a39b8e] leading-relaxed">
              Add custom sections, align your header (Left, Center, Right), and drag-and-drop to reorder sections.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-[#0c0c0e] border border-black/15 dark:border-[#222225] space-y-3 shadow-xs">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black text-[#faf5eb] dark:bg-[#faf5eb] dark:text-black shadow-xs">
              <Download className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-black dark:text-[#faf5eb]">Vector PDF Export</h3>
            <p className="text-xs text-[#5c5549] dark:text-[#a39b8e] leading-relaxed">
              Download clean, high-resolution vector PDFs with selectable text and zero watermarks.
            </p>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-12">
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-black dark:text-[#faf5eb]">
            How it works
          </h2>
          <p className="text-sm text-[#5c5549] dark:text-[#a39b8e]">
            Three simple steps to your new resume.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-[#0c0c0e] border border-black/15 dark:border-[#222225] text-center space-y-3 shadow-xs">
            <div className="w-9 h-9 rounded-full bg-black text-[#faf5eb] dark:bg-[#faf5eb] dark:text-black font-bold text-sm flex items-center justify-center mx-auto shadow-xs">
              1
            </div>
            <h3 className="text-base font-bold text-black dark:text-[#faf5eb]">Choose a Template</h3>
            <p className="text-xs text-[#5c5549] dark:text-[#a39b8e] leading-relaxed">
              Pick from 9 clean formats including Jake's Resume, MTeck's, or Modern Accent.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-[#0c0c0e] border border-black/15 dark:border-[#222225] text-center space-y-3 shadow-xs">
            <div className="w-9 h-9 rounded-full bg-black text-[#faf5eb] dark:bg-[#faf5eb] dark:text-black font-bold text-sm flex items-center justify-center mx-auto shadow-xs">
              2
            </div>
            <h3 className="text-base font-bold text-black dark:text-[#faf5eb]">Fill in Your Details</h3>
            <p className="text-xs text-[#5c5549] dark:text-[#a39b8e] leading-relaxed">
              Enter your experience, education, and skills with real-time preview and auto-saving.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-[#0c0c0e] border border-black/15 dark:border-[#222225] text-center space-y-3 shadow-xs">
            <div className="w-9 h-9 rounded-full bg-black text-[#faf5eb] dark:bg-[#faf5eb] dark:text-black font-bold text-sm flex items-center justify-center mx-auto shadow-xs">
              3
            </div>
            <h3 className="text-base font-bold text-black dark:text-[#faf5eb]">Download PDF</h3>
            <p className="text-xs text-[#5c5549] dark:text-[#a39b8e] leading-relaxed">
              Export an ATS-friendly, high-resolution vector PDF ready to submit with applications.
            </p>
          </div>
        </div>
      </section>

      {/* CLEAN BOTTOM CTA CARD */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-black/15 dark:border-[#222225] bg-white dark:bg-[#0c0c0e] p-8 sm:p-12 text-center shadow-xs space-y-4">
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-black dark:text-[#faf5eb]">
            Ready to create your resume?
          </h2>
          <p className="text-sm text-[#5c5549] dark:text-[#a39b8e] max-w-md mx-auto">
            Get started in seconds. No credit card required, free forever.
          </p>
          <div className="pt-2">
            <Link to={isAuthenticated ? '/dashboard' : '/register'}>
              <Button size="lg" className="px-8 py-3 font-bold text-sm">
                {isAuthenticated ? 'Open Dashboard' : 'Get Started Free'}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
