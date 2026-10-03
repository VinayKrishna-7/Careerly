import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Button from '../components/ui/Button.jsx';
import Badge from '../components/ui/Badge.jsx';
import {
  FileText,
  Download,
  CheckCircle2,
  ArrowRight,
  ChevronDown,
  UserPlus,
  LogIn,
  ShieldCheck,
  Layers,
  Sparkles
} from 'lucide-react';
import { TEMPLATE_METADATA } from '../utils/constants.js';

export const LandingPage = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      q: 'Is Careerly free to use?',
      a: 'Yes. You can create, edit, customize, and export high-resolution vector PDF resumes and cover letters with zero watermarks.'
    },
    {
      q: 'How does Careerly ensure ATS compatibility?',
      a: 'Our templates are built around single-column semantic structures and standard system fonts (Times New Roman, Arial, Roboto, Calibri). This ensures parsers used by Workday, Greenhouse, Lever, and Taleo can read your experience cleanly without formatting errors.'
    },
    {
      q: 'Can I add my own custom sections?',
      a: 'Yes. You can add custom sections for certifications, publications, volunteer work, speaking engagements, or any category you need, and easily reorder sections anytime.'
    },
    {
      q: 'Can I create matching cover letters?',
      a: 'Yes. Careerly includes a built-in cover letter builder that matches your chosen resume layout and styling for a consistent application package.'
    }
  ];

  return (
    <div className="space-y-20 sm:space-y-28 pb-20 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* HERO SECTION */}
      <section className="pt-16 sm:pt-24 lg:pt-28">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-extrabold text-slate-950 dark:text-white tracking-tight leading-tight max-w-4xl mx-auto">
            Create clean, job-ready resumes in minutes.
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Careerly is a simple, free resume and cover letter builder. Pick a recruiter-tested template, fill in your experience, and download a clean PDF designed to pass applicant tracking systems.
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

      {/* TEMPLATES PREVIEW SHOWCASE */}
      <section id="templates" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 dark:text-white">
            Proven templates for every field
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
            Single-column, readable layouts designed for tech, finance, engineering, and creative roles.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {TEMPLATE_METADATA.map((tmpl) => (
            <div
              key={tmpl.id}
              className="group rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Authentic Resume Template Image Preview */}
                <div className="relative w-full h-48 bg-slate-100 dark:bg-slate-950 rounded-xl mb-4 overflow-hidden border border-slate-200/80 dark:border-slate-800/80 flex items-center justify-center p-2.5">
                  <div className="h-full w-auto aspect-[380/490] bg-white rounded-xs shadow-sm overflow-hidden border border-slate-200/80">
                    <img
                      src={`/templates/${tmpl.id}.svg`}
                      alt={tmpl.name}
                      className="w-full h-full object-cover object-top select-none pointer-events-none"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = '/templates/modern.svg';
                      }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">{tmpl.name}</h3>
                  <Badge variant="default" size="xs">
                    {tmpl.badge}
                  </Badge>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {tmpl.description}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800">
                <Link to={isAuthenticated ? '/dashboard' : '/register'}>
                  <Button variant="outline" size="sm" className="w-full text-xs font-semibold">
                    Use This Template
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CORE FEATURES (SIMPLE 4-CARD GRID) */}
      <section id="features" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 dark:text-white">
            Everything you need to apply with confidence
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
            Straightforward tools designed to get your resume ready for applications.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 shadow-xs">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">ATS-Optimized</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Clean semantic structures and universal fonts that applicant tracking systems parse without errors.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 shadow-xs">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400">
              <Sparkles className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Live Real-Time Preview</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Watch your resume update as you type. Switch between all 9 layouts anytime with zero loss of content.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 shadow-xs">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400">
              <Layers className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Custom Sections &amp; Order</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Add custom sections, align your header (Left, Center, Right), and drag-and-drop to reorder sections.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 shadow-xs">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400">
              <Download className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Vector PDF Export</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Download clean, high-resolution vector PDFs with selectable text and zero watermarks.
            </p>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-12">
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 dark:text-white">
            How it works
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Three simple steps to your new resume.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-3">
            <div className="w-9 h-9 rounded-full bg-brand-600 text-white font-bold text-sm flex items-center justify-center mx-auto">
              1
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Choose a Template</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Pick from 9 clean formats including Jake's Resume, MTeck's, or Modern Accent.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-3">
            <div className="w-9 h-9 rounded-full bg-brand-600 text-white font-bold text-sm flex items-center justify-center mx-auto">
              2
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Fill in Your Details</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Enter your experience, education, and skills with real-time preview and auto-saving.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-3">
            <div className="w-9 h-9 rounded-full bg-brand-600 text-white font-bold text-sm flex items-center justify-center mx-auto">
              3
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Download PDF</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Export an ATS-friendly, high-resolution vector PDF ready to submit with applications.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-10">
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 dark:text-white">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-2xs"
            >
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full flex items-center justify-between p-4 text-left text-sm font-semibold text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`h-4 w-4 text-slate-400 transition-transform duration-200 shrink-0 ml-2 ${
                    openFaq === idx ? 'rotate-180 text-brand-600 dark:text-brand-400' : ''
                  }`}
                />
              </button>
              {openFaq === idx && (
                <div className="px-4 pb-4 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CLEAN BOTTOM CTA CARD */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 sm:p-12 text-center shadow-xs space-y-4">
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 dark:text-white">
            Ready to create your resume?
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto">
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
