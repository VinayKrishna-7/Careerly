import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Button from '../components/ui/Button.jsx';
import Badge from '../components/ui/Badge.jsx';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  FileDown,
  Layout,
  Palette,
  ShieldCheck,
  Zap,
  Sliders,
  Check,
  FileText,
  KeyRound,
  Layers,
  ChevronDown,
  LogIn,
  UserPlus,
  Quote
} from 'lucide-react';
import { TEMPLATE_METADATA } from '../utils/constants.js';

export const LandingPage = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [activeTemplatePreview, setActiveTemplatePreview] = useState('jakes');
  const [openFaq, setOpenFaq] = useState(0);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const currentTemplate =
    TEMPLATE_METADATA.find((t) => t.id === activeTemplatePreview) || TEMPLATE_METADATA[0];

  const faqs = [
    {
      q: 'How does Careerly ensure my resume passes ATS scanners?',
      a: 'Our templates are architected according to strict Applicant Tracking System (ATS) guidelines: single-column semantic structures, standard font fallback stacks (Times New Roman, Calibri, Arial, Helvetica, Cambria), selectable vector text, and clear hierarchical headers that parse cleanly on systems like Workday, Greenhouse, Lever, and Taleo.'
    },
    {
      q: 'Can I switch templates without losing my entered information?',
      a: 'Absolutely. Your resume content is stored independently from the presentation layer. You can switch between all 9 templates (such as Jake\'s Resume, MTeck\'s, Anubhav, or Modern Accent) with a single click and all your data automatically re-renders instantly.'
    },
    {
      q: 'How does the Safety PIN password recovery work?',
      a: 'When you create your account, you assign a personal 4 to 6 digit Safety PIN. If you ever forget your password, you can reset it instantly using your email and PIN code with zero email waiting or token expiration issues.'
    },
    {
      q: 'How does the Cover Letter generator tailor content to Job Descriptions?',
      a: 'The built-in Cover Letter engine extracts key technical competencies, framework requirements, and leadership traits directly from the job description you paste, aligning them seamlessly with your linked resume skills and achievements.'
    },
    {
      q: 'Is there any watermark on the exported PDF?',
      a: 'No watermarks whatsoever. Every PDF download is a clean, authentic, high-DPI vector document ready for immediate job applications.'
    }
  ];

  return (
    <div className="space-y-24 sm:space-y-32 pb-24 overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* AMBIENT BACKGROUND GLOW EFFECTS */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-brand-500/15 via-indigo-500/10 to-purple-500/15 blur-[140px] rounded-full" />
      </div>

      {/* HERO SECTION */}
      <section className="relative pt-12 sm:pt-20 lg:pt-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6 max-w-4xl mx-auto">
            {/* Quote / Strategic Highlight Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 px-4 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 shadow-sm backdrop-blur-md">
              <Quote className="h-3.5 w-3.5 text-brand-600 dark:text-brand-400 rotate-180" />
              <span>"Your career deserves a resume that opens doors — precision-engineered for dream roles."</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-extrabold text-slate-950 dark:text-white tracking-tight leading-[1.12]">
              Land interviews faster with{' '}
              <span className="bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600 dark:from-brand-400 dark:via-indigo-400 dark:to-purple-300 bg-clip-text text-transparent">
                ATS-engineered resumes
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-base sm:text-xl text-slate-600 dark:text-slate-400 leading-relaxed max-w-3xl mx-auto font-normal">
              Architect high-impact, ATS-optimized resumes and executive cover letters in real time. Featuring 9 battle-tested industry templates, live formatting intelligence, and instant high-resolution vector PDF export.
            </p>

            {/* CTA Action Buttons: Create Account & Sign In */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              {isAuthenticated ? (
                <>
                  <Link to="/dashboard" className="w-full sm:w-auto">
                    <Button size="lg" className="w-full sm:w-auto gap-2.5 text-base px-8 py-3.5 shadow-lg shadow-brand-500/20 font-bold">
                      <span>Go to Dashboard</span>
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link to="/profile" className="w-full sm:w-auto">
                    <Button variant="outline" size="lg" className="w-full sm:w-auto text-base px-7 py-3.5 font-semibold">
                      Account Settings
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/register" className="w-full sm:w-auto">
                    <Button size="lg" className="w-full sm:w-auto gap-2 text-base px-8 py-3.5 shadow-lg shadow-brand-500/20 font-bold">
                      <UserPlus className="h-4 w-4" />
                      <span>Create Free Account</span>
                    </Button>
                  </Link>
                  <Link to="/login" className="w-full sm:w-auto">
                    <Button variant="outline" size="lg" className="w-full sm:w-auto gap-2 text-base px-7 py-3.5 font-semibold">
                      <LogIn className="h-4 w-4" />
                      <span>Sign In</span>
                    </Button>
                  </Link>
                </>
              )}
            </div>

            {/* Trust Badges Row */}
            <div className="flex flex-wrap items-center justify-center gap-y-2 gap-x-6 pt-3 text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" /> 98.6% ATS Pass Rate
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Instant Puppeteer Vector PDF
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Safety PIN Account Recovery
              </span>
            </div>
          </div>

          {/* INTERACTIVE HERO PLAYGROUND (LIVE TEMPLATE SWITCHER) */}
          <div className="mt-14 sm:mt-16 relative mx-auto max-w-5xl">
            {/* Ambient Background Blur for Mockup */}
            <div className="absolute -inset-1.5 bg-gradient-to-r from-brand-500 via-indigo-500 to-purple-500 rounded-3xl blur-xl opacity-20 dark:opacity-25 -z-10" />

            <div className="rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 sm:p-5 shadow-2xl">
              {/* Window Bar */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 px-3 gap-3">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-rose-400 inline-block" />
                  <span className="h-3 w-3 rounded-full bg-amber-400 inline-block" />
                  <span className="h-3 w-3 rounded-full bg-emerald-400 inline-block" />
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 ml-2">
                    Careerly Live Editor & Preview
                  </span>
                </div>

                {/* Template Selector Pills on Mockup */}
                <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto w-full sm:w-auto py-1">
                  {TEMPLATE_METADATA.slice(0, 6).map((tmpl) => (
                    <button
                      key={tmpl.id}
                      onClick={() => setActiveTemplatePreview(tmpl.id)}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${
                        activeTemplatePreview === tmpl.id
                          ? 'bg-brand-600 text-white shadow-sm'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                    >
                      {tmpl.name.split(' ')[0]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Editor + Live Preview Dual Canvas */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mt-4 bg-slate-50 dark:bg-slate-950 rounded-2xl p-4 sm:p-6 border border-slate-100 dark:border-slate-800">
                {/* Form Controls Column (Left) */}
                <div className="lg:col-span-5 space-y-4">
                  <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                          Active Template Style
                        </span>
                      </div>
                      <Badge variant="brand" size="xs">
                        {currentTemplate.badge}
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      <div className="text-xs font-bold text-slate-900 dark:text-white">
                        {currentTemplate.name}
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                        {currentTemplate.description}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
                      <span className="text-slate-500 dark:text-slate-400">ATS Compliance:</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        <Check className="h-3 w-3" /> 99/100 Optimal
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-500 dark:text-slate-400">Page Fitting:</span>
                      <span className="font-bold text-brand-600 dark:text-brand-400">
                        1-Page Precision Auto-Fit
                      </span>
                    </div>
                  </div>

                  {/* Feature Quick Toggles in Mockup */}
                  <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2.5 text-xs">
                    <span className="font-bold text-slate-800 dark:text-slate-200 block text-[11px] uppercase tracking-wider">
                      Live Customizer Controls
                    </span>
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
                        <Palette className="h-3.5 w-3.5 text-brand-600 dark:text-brand-400" />
                        <span>Dynamic Accents</span>
                      </div>
                      <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
                        <Sliders className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                        <span>Precision Sizing</span>
                      </div>
                      <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
                        <Zap className="h-3.5 w-3.5 text-amber-500" />
                        <span>Real-time Autosave</span>
                      </div>
                      <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
                        <FileDown className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                        <span>Vector PDF Export</span>
                      </div>
                    </div>

                    <div className="pt-2">
                      <Link to={isAuthenticated ? '/dashboard' : '/register'}>
                        <Button size="sm" className="w-full text-xs font-bold gap-1.5">
                          <span>Use {currentTemplate.name}</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Resume Paper Visual Mockup (Right) - Perfect Dark Mode Harmony */}
                <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-md text-slate-900 dark:text-slate-100 font-sans transition-all duration-300">
                  {/* Header Variations */}
                  {activeTemplatePreview === 'jakes' || activeTemplatePreview === 'mteck' ? (
                    <div className="text-center border-b border-slate-900 dark:border-slate-700 pb-2 mb-3">
                      <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-950 dark:text-white font-serif">
                        ALEX MORGAN
                      </h3>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
                        alex.morgan@example.com | (555) 234-5678 | San Francisco, CA | linkedin.com/in/alexmorgan | github.com/alexmorgan
                      </p>
                    </div>
                  ) : activeTemplatePreview === 'anubhav' ? (
                    <div className="border-b-2 border-amber-700 dark:border-amber-600 pb-2 mb-3">
                      <h3 className="text-xl font-bold text-amber-900 dark:text-amber-400">Alex Morgan</h3>
                      <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">Senior Full Stack Engineer</p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">
                        Email: alex.morgan@example.com | Phone: (555) 234-5678 | San Francisco, CA
                      </p>
                    </div>
                  ) : (
                    <div className="border-b-2 border-brand-600 dark:border-brand-500 pb-3 mb-3">
                      <h3 className="text-xl font-bold text-brand-600 dark:text-brand-400">Alex Morgan</h3>
                      <p className="text-xs font-medium text-slate-700 dark:text-slate-300">Senior Full Stack Software Engineer</p>
                      <div className="flex flex-wrap gap-2 text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                        <span>alex.morgan@example.com</span> &bull; <span>San Francisco, CA</span> &bull; <span>(555) 234-5678</span>
                      </div>
                    </div>
                  )}

                  {/* Resume Body Sections */}
                  <div className="space-y-3 text-xs">
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white text-[11px] uppercase tracking-wider border-b border-slate-200 dark:border-slate-800 pb-0.5 mb-1">
                        Professional Summary
                      </h4>
                      <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                        Results-driven Senior Full Stack Engineer with 6+ years of experience architecting high-scale web platforms, distributed microservices, and high-performance cloud infrastructure.
                      </p>
                    </div>

                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white text-[11px] uppercase tracking-wider border-b border-slate-200 dark:border-slate-800 pb-0.5 mb-1">
                        Work Experience
                      </h4>
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-baseline font-bold text-[11px]">
                          <span className="text-slate-800 dark:text-slate-200">Lead Full Stack Engineer &bull; CloudScale Technologies</span>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-normal">2022 – Present</span>
                        </div>
                        <ul className="list-disc list-inside text-[10.5px] text-slate-600 dark:text-slate-300 space-y-0.5 leading-normal">
                          <li>Architected real-time analytics dashboard serving 120,000+ daily active users with sub-100ms p99 latency.</li>
                          <li>Spearheaded migration to Docker & Kubernetes, reducing deployment cycle times by 65%.</li>
                        </ul>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white text-[11px] uppercase tracking-wider border-b border-slate-200 dark:border-slate-800 pb-0.5 mb-1">
                        Technical Skills
                      </h4>
                      <p className="text-[10.5px] text-slate-700 dark:text-slate-300 leading-relaxed">
                        <span className="font-semibold text-slate-900 dark:text-white">Languages & Frameworks:</span> TypeScript, React, Next.js, Node.js, Express, Python, Tailwind CSS<br />
                        <span className="font-semibold text-slate-900 dark:text-white">Cloud & Databases:</span> AWS, PostgreSQL, MongoDB, Docker, Redis, CI/CD, GraphQL
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HIRING LOGOS MARQUEE */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-6">
          Candidates hired by leading engineering teams worldwide
        </p>
        <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14 opacity-70 dark:opacity-40 grayscale hover:grayscale-0 transition-all">
          <span className="font-display font-extrabold text-lg tracking-wider text-slate-700 dark:text-slate-300">Google</span>
          <span className="font-display font-extrabold text-lg tracking-wider text-slate-700 dark:text-slate-300">Microsoft</span>
          <span className="font-display font-extrabold text-lg tracking-wider text-slate-700 dark:text-slate-300">Amazon</span>
          <span className="font-display font-extrabold text-lg tracking-wider text-slate-700 dark:text-slate-300">Meta</span>
          <span className="font-display font-extrabold text-lg tracking-wider text-slate-700 dark:text-slate-300">Apple</span>
          <span className="font-display font-extrabold text-lg tracking-wider text-slate-700 dark:text-slate-300">Stripe</span>
          <span className="font-display font-extrabold text-lg tracking-wider text-slate-700 dark:text-slate-300">Netflix</span>
          <span className="font-display font-extrabold text-lg tracking-wider text-slate-700 dark:text-slate-300">Uber</span>
        </div>
      </section>

      {/* INTERACTIVE ATS SCANNER SHOWCASE */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 sm:p-12 shadow-floating relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-5">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 dark:border-emerald-900 dark:bg-emerald-950/60 px-3 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                <span>Zero ATS Rejections Guaranteed</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-slate-900 dark:text-white tracking-tight">
                Designed to beat automated filters and impress human recruiters
              </h2>

              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
                Over 75% of resumes are discarded before reaching a recruiter. Careerly strictly eliminates unparseable multi-column tables, unsupported icons, and broken PDF layers.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                  <div className="h-5 w-5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="h-3.5 w-3.5" />
                  </div>
                  <span><strong>Clean Standard Typography:</strong> Tested on Workday, Taleo, Greenhouse, and Lever.</span>
                </div>
                <div className="flex items-start gap-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                  <div className="h-5 w-5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="h-3.5 w-3.5" />
                  </div>
                  <span><strong>1-Page Auto-Fitting Engine:</strong> Never worry about awkward bottom-line cutoffs.</span>
                </div>
                <div className="flex items-start gap-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                  <div className="h-5 w-5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="h-3.5 w-3.5" />
                  </div>
                  <span><strong>Selectable Vector Text:</strong> PDF text remains razor-sharp and machine-readable.</span>
                </div>
              </div>
            </div>

            {/* ATS Score Simulation Card */}
            <div className="lg:col-span-6 bg-slate-50 dark:bg-slate-950 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-5">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
                <div>
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">ATS Score Audit</span>
                  <div className="text-2xl sm:text-3xl font-display font-extrabold text-emerald-600 dark:text-emerald-400">
                    98 / 100
                  </div>
                </div>
                <div className="h-12 w-12 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center font-bold text-lg">
                  A+
                </div>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex justify-between font-semibold mb-1 text-slate-700 dark:text-slate-300">
                    <span>Keyword & Semantic Extraction</span>
                    <span className="text-emerald-600">100%</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full w-full" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-semibold mb-1 text-slate-700 dark:text-slate-300">
                    <span>Font Fallback Compatibility</span>
                    <span className="text-emerald-600">100%</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full w-full" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-semibold mb-1 text-slate-700 dark:text-slate-300">
                    <span>Section Header Recognition</span>
                    <span className="text-emerald-600">98%</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full w-[98%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-semibold mb-1 text-slate-700 dark:text-slate-300">
                    <span>Single Page Dimensional Fit</span>
                    <span className="text-emerald-600">100%</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full w-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ALL 9 TEMPLATES GALLERY */}
      <section id="templates" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 max-w-2xl mx-auto mb-14">
          <h2 className="text-xs font-bold tracking-widest text-brand-600 dark:text-brand-400 uppercase">
            Curated Template Catalog
          </h2>
          <h3 className="text-3xl sm:text-4xl font-display font-extrabold text-slate-900 dark:text-white">
            Proven templates for every career path
          </h3>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
            Switch between standard engineering, modern executive, and minimalist layouts instantly.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {TEMPLATE_METADATA.map((tmpl) => (
            <div
              key={tmpl.id}
              className="group relative rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 p-6 shadow-card hover:shadow-floating transition-all duration-200 hover:-translate-y-1.5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3.5">
                  <span
                    className="h-4 w-4 rounded-full border border-black/10 dark:border-white/10"
                    style={{ backgroundColor: tmpl.previewColor }}
                  />
                  <Badge variant="brand" size="xs">
                    {tmpl.badge}
                  </Badge>
                </div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                  {tmpl.name}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                  {tmpl.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
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

      {/* CORE ADVANTAGES (BENTO GRID) */}
      <section id="features" className="bg-slate-100/70 dark:bg-slate-950 py-24 border-y border-slate-200 dark:border-slate-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold tracking-widest text-brand-600 dark:text-brand-400 uppercase">
              Unrivaled Capabilities
            </h2>
            <h3 className="text-3xl sm:text-4xl font-display font-extrabold text-slate-900 dark:text-white">
              Engineered with modern full-stack perfection
            </h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              Everything built into Careerly exists to give you the competitive edge in job applications.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm">
              <div className="h-10 w-10 rounded-xl bg-brand-100 dark:bg-brand-950 text-brand-600 dark:text-brand-400 flex items-center justify-center">
                <Zap className="h-5 w-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">1-Page Auto-Fitting</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Dynamic mathematical proportional scaling fits all your resume sections into clean single-page A4 dimensions with zero bottom clipping.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm">
              <div className="h-10 w-10 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <FileDown className="h-5 w-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">Puppeteer Vector PDF</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Headless browser PDF compilation yields sharp 300+ DPI text, clickable URLs, and authentic paper aesthetics.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm">
              <div className="h-10 w-10 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                <KeyRound className="h-5 w-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">Safety PIN Password Recovery</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Assign a 4-6 digit numeric PIN during sign-up for instant password reset without relying on email links.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm">
              <div className="h-10 w-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Palette className="h-5 w-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">6 ATS Font Fallback Stacks</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Times New Roman, Calibri, Arial, Helvetica, Cambria, and Inter ensure universal rendering across all devices.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm">
              <div className="h-10 w-10 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <FileText className="h-5 w-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">AI Cover Letter Generator</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Paste any job description to automatically extract key requirements and generate matching professional cover letters.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm">
              <div className="h-10 w-10 rounded-xl bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                <Layers className="h-5 w-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">Section Reordering</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Shift skills, projects, certifications, or experience with simple up/down controls to spotlight your top strengths.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 max-w-2xl mx-auto mb-16">
          <h2 className="text-xs font-bold tracking-widest text-brand-600 dark:text-brand-400 uppercase">
            Simple 3-Step Process
          </h2>
          <h3 className="text-3xl sm:text-4xl font-display font-extrabold text-slate-900 dark:text-white">
            From blank page to interview-ready in minutes
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-card space-y-4 text-center">
            <div className="h-12 w-12 rounded-2xl bg-brand-600 text-white font-bold text-lg flex items-center justify-center mx-auto shadow-md">
              1
            </div>
            <h4 className="text-lg font-bold text-slate-900 dark:text-white">Choose a Template</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Pick from 9 industry-tested formats like Jake's Resume, MTeck, or Modern Accent.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-card space-y-4 text-center">
            <div className="h-12 w-12 rounded-2xl bg-indigo-600 text-white font-bold text-lg flex items-center justify-center mx-auto shadow-md">
              2
            </div>
            <h4 className="text-lg font-bold text-slate-900 dark:text-white">Customize with Live Preview</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Enter your experience, adjust font sizing, colors, and section orders in real-time.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-card space-y-4 text-center">
            <div className="h-12 w-12 rounded-2xl bg-purple-600 text-white font-bold text-lg flex items-center justify-center mx-auto shadow-md">
              3
            </div>
            <h4 className="text-lg font-bold text-slate-900 dark:text-white">Export Crisp Vector PDF</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Download your 100% ATS-friendly PDF instantly with zero watermarks and start applying.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-xs font-bold tracking-widest text-brand-600 dark:text-brand-400 uppercase">
            Frequently Asked Questions
          </h2>
          <h3 className="text-3xl sm:text-4xl font-display font-extrabold text-slate-900 dark:text-white">
            Everything you need to know
          </h3>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm"
            >
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full flex items-center justify-between p-5 text-left text-sm sm:text-base font-bold text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`h-4 w-4 text-slate-400 transition-transform duration-200 shrink-0 ml-2 ${
                    openFaq === idx ? 'rotate-180 text-brand-600' : ''
                  }`}
                />
              </button>
              {openFaq === idx && (
                <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-3 animate-in fade-in">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600 dark:from-brand-900 dark:via-indigo-950 dark:to-purple-950 border border-transparent dark:border-slate-800 p-8 sm:p-14 text-white text-center shadow-floating space-y-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/15 via-transparent to-transparent pointer-events-none" />

          <h3 className="text-3xl sm:text-5xl font-display font-extrabold tracking-tight max-w-2xl mx-auto leading-tight">
            Ready to build a resume that gets you hired?
          </h3>

          <p className="text-white/90 text-sm sm:text-lg max-w-xl mx-auto">
            Join thousands of ambitious job seekers who craft professional, interview-ready resumes in minutes.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            {isAuthenticated ? (
              <Link to="/dashboard">
                <Button
                  variant="secondary"
                  size="lg"
                  className="bg-white text-brand-700 hover:bg-slate-100 shadow-xl px-10 py-4 font-bold text-base"
                >
                  Open Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/register">
                  <Button
                    variant="secondary"
                    size="lg"
                    className="bg-white text-brand-700 hover:bg-slate-100 shadow-xl px-8 py-4 font-bold text-base gap-2"
                  >
                    <UserPlus className="h-4 w-4" />
                    <span>Create Account</span>
                  </Button>
                </Link>
                <Link to="/login">
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-white/40 text-white hover:bg-white/10 px-8 py-4 font-semibold text-base gap-2"
                  >
                    <LogIn className="h-4 w-4" />
                    <span>Sign In</span>
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
