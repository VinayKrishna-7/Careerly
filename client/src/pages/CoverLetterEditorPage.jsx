import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchCoverLetterById,
  saveCoverLetter,
  updateActiveLetterField,
  updateBodyParagraph,
  addBodyParagraph,
  removeBodyParagraph,
  setLetterTemplate,
  setLetterSettings,
  clearActiveLetter
} from '../store/slices/coverLetterSlice.js';
import { coverLetterApi } from '../services/coverLetterApi.js';
import { showToast } from '../store/slices/uiSlice.js';
import CoverLetterHeader from '../features/coverLetter/CoverLetterHeader.jsx';
import CoverLetterRenderer from '../templates/CoverLetterRenderer.jsx';
import Input from '../components/ui/Input.jsx';
import Textarea from '../components/ui/Textarea.jsx';
import Button from '../components/ui/Button.jsx';
import Spinner from '../components/ui/Spinner.jsx';
import { COLOR_PALETTES, FONT_OPTIONS } from '../utils/constants.js';
import {
  Building,
  FileText,
  Palette,
  Sparkles,
  Plus,
  Trash2,
  ZoomIn,
  ZoomOut,
  Printer,
  Eye,
  Edit3
} from 'lucide-react';

import { fetchResumes } from '../store/slices/resumeSlice.js';

export const CoverLetterEditorPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { activeLetter, isLoadingActive, isDirty } = useSelector(
    (state) => state.coverLetter
  );

  const [activeTab, setActiveTab] = useState('job'); // 'job' | 'content' | 'styling'
  const [mobileTab, setMobileTab] = useState('editor'); // 'editor' | 'preview'
  const [zoom, setZoom] = useState(100);
  const [isGenerating, setIsGenerating] = useState(false);
  const [tone, setTone] = useState('professional'); // 'professional' | 'confident' | 'enthusiastic'

  const { resumesList } = useSelector((state) => state.resume);

  const debounceTimerRef = useRef(null);

  useEffect(() => {
    if (id) {
      dispatch(fetchCoverLetterById(id));
    }
    dispatch(fetchResumes());
    return () => {
      dispatch(clearActiveLetter());
    };
  }, [id, dispatch]);

  // Autosave engine
  useEffect(() => {
    if (!activeLetter || !isDirty) return;

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      dispatch(saveCoverLetter({ id: activeLetter._id, data: activeLetter }));
    }, 1500);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [activeLetter, isDirty, dispatch]);

  const handleFieldChange = (path, value) => {
    dispatch(updateActiveLetterField({ path, value }));
  };

  const handleGenerateWithJD = async () => {
    if (!activeLetter) return;
    setIsGenerating(true);
    try {
      const response = await coverLetterApi.generateText({
        candidateName: activeLetter.senderInfo?.fullName || 'Candidate',
        jobTitle: activeLetter.jobTitle,
        companyName: activeLetter.companyName,
        recipientName: activeLetter.recipientName,
        recipientTitle: activeLetter.recipientTitle,
        jobDescription: activeLetter.jobDescription,
        resumeId: activeLetter.resumeId,
        tone
      });

      const gen = response.data;
      dispatch(updateActiveLetterField({ path: 'salutation', value: gen.salutation }));
      dispatch(updateActiveLetterField({ path: 'openingParagraph', value: gen.openingParagraph }));
      dispatch(updateActiveLetterField({ path: 'bodyParagraphs', value: gen.bodyParagraphs }));
      dispatch(updateActiveLetterField({ path: 'closingParagraph', value: gen.closingParagraph }));
      dispatch(updateActiveLetterField({ path: 'signoff', value: gen.signoff }));

      const isJd = activeLetter.jobDescription && activeLetter.jobDescription.trim().length > 25;
      dispatch(
        showToast({
          message: isJd
            ? 'Cover letter accurately tailored from Job Description requirements!'
            : 'Cover letter tailored based on target role skillset and company requirements!',
          type: 'success'
        })
      );
    } catch (err) {
      dispatch(showToast({ message: 'Generation error: ' + err.message, type: 'error' }));
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSyncFromResume = (selectedResumeId) => {
    if (!selectedResumeId) {
      handleFieldChange('resumeId', null);
      return;
    }
    const targetResume = resumesList.find((r) => r._id === selectedResumeId);
    if (!targetResume) return;

    if (targetResume.personalInfo) {
      if (targetResume.personalInfo.fullName) {
        handleFieldChange('senderInfo.fullName', targetResume.personalInfo.fullName);
      }
      if (targetResume.personalInfo.email) {
        handleFieldChange('senderInfo.email', targetResume.personalInfo.email);
      }
      if (targetResume.personalInfo.phone) {
        handleFieldChange('senderInfo.phone', targetResume.personalInfo.phone);
      }
      if (targetResume.personalInfo.location) {
        handleFieldChange('senderInfo.location', targetResume.personalInfo.location);
      }
      if (targetResume.personalInfo.linkedin) {
        handleFieldChange('senderInfo.linkedin', targetResume.personalInfo.linkedin);
      }
      if (targetResume.personalInfo.website) {
        handleFieldChange('senderInfo.website', targetResume.personalInfo.website);
      }
    }
    handleFieldChange('resumeId', selectedResumeId);
    dispatch(showToast({ message: `Synced contact information from "${targetResume.title}"!`, type: 'info' }));
  };

  if (isLoadingActive || !activeLetter) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <Spinner size="lg" message="Loading cover letter editor..." />
      </div>
    );
  }

  const senderInfo = activeLetter.senderInfo || {};
  const settings = activeLetter.settings || {};

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-slate-50 dark:bg-slate-950 overflow-hidden transition-colors">
      <CoverLetterHeader />

      {/* Mobile Bar */}
      <div className="flex md:hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <button
          type="button"
          onClick={() => setMobileTab('editor')}
          className={`flex-1 py-2.5 text-xs font-bold flex items-center justify-center gap-1.5 ${
            mobileTab === 'editor'
              ? 'text-brand-600 dark:text-brand-400 border-b-2 border-brand-600 bg-brand-50/30'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          <Edit3 className="h-3.5 w-3.5" /> Editor
        </button>
        <button
          type="button"
          onClick={() => setMobileTab('preview')}
          className={`flex-1 py-2.5 text-xs font-bold flex items-center justify-center gap-1.5 ${
            mobileTab === 'preview'
              ? 'text-brand-600 dark:text-brand-400 border-b-2 border-brand-600 bg-brand-50/30'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          <Eye className="h-3.5 w-3.5" /> Live Preview
        </button>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Side: Editor Tabs & Forms */}
        <div
          className={`w-full md:w-1/2 lg:w-5/12 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col h-full ${
            mobileTab === 'preview' ? 'hidden md:flex' : 'flex'
          }`}
        >
          {/* Top Tabs */}
          <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/50 p-2 gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab('job')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'job'
                  ? 'bg-white dark:bg-slate-800 text-brand-700 dark:text-brand-300 shadow-subtle border border-slate-200/80 dark:border-slate-700'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Building className="h-3.5 w-3.5" />
              <span>Target Job & AI</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('content')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'content'
                  ? 'bg-white dark:bg-slate-800 text-brand-700 dark:text-brand-300 shadow-subtle border border-slate-200/80 dark:border-slate-700'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <FileText className="h-3.5 w-3.5" />
              <span>Letter Content</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('styling')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'styling'
                  ? 'bg-white dark:bg-slate-800 text-brand-700 dark:text-brand-300 shadow-subtle border border-slate-200/80 dark:border-slate-700'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Palette className="h-3.5 w-3.5" />
              <span>Design & Style</span>
            </button>
          </div>

          {/* Form Scroll Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 text-slate-900 dark:text-slate-100">
            {/* TAB 1: TARGET JOB & AI GENERATOR */}
            {activeTab === 'job' && (
              <div className="space-y-6">
                <div className="pb-2 border-b border-slate-200 dark:border-slate-800">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Job & Company Information</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Provide the job details and target job description to tailor your letter.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input
                    label="Company Name"
                    placeholder="e.g. Google, Stripe"
                    value={activeLetter.companyName || ''}
                    onChange={(e) => handleFieldChange('companyName', e.target.value)}
                  />
                  <Input
                    label="Target Job Position"
                    placeholder="e.g. Lead Frontend Engineer"
                    value={activeLetter.jobTitle || ''}
                    onChange={(e) => handleFieldChange('jobTitle', e.target.value)}
                  />
                  <Input
                    label="Recipient / Hiring Manager"
                    placeholder="e.g. Jane Doe (or Hiring Team)"
                    value={activeLetter.recipientName || ''}
                    onChange={(e) => handleFieldChange('recipientName', e.target.value)}
                  />
                  <Input
                    label="Recipient Title"
                    placeholder="e.g. VP of Engineering"
                    value={activeLetter.recipientTitle || ''}
                    onChange={(e) => handleFieldChange('recipientTitle', e.target.value)}
                  />
                  <div className="sm:col-span-2">
                    <Input
                      label="Company Address / Location (Optional)"
                      placeholder="e.g. 1600 Amphitheatre Pkwy, Mountain View, CA"
                      value={activeLetter.companyAddress || ''}
                      onChange={(e) => handleFieldChange('companyAddress', e.target.value)}
                    />
                  </div>
                </div>

                {/* Resume Linkage */}
                {resumesList.length > 0 && (
                  <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/40 space-y-2">
                    <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                      Link Existing Resume (For Skills & Profile Context)
                    </label>
                    <div className="flex gap-2">
                      <select
                        value={activeLetter.resumeId || ''}
                        onChange={(e) => handleSyncFromResume(e.target.value)}
                        className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
                      >
                        <option value="">None (Custom text only)</option>
                        {resumesList.map((r) => (
                          <option key={r._id} value={r._id}>
                            {r.title} ({r.personalInfo?.fullName || 'Candidate'})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                {/* Tone Selector */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                    Letter Tone & Style
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'professional', label: 'Professional', desc: 'Direct & Authoritative' },
                      { id: 'confident', label: 'Confident', desc: 'Results & Impact Driven' },
                      { id: 'enthusiastic', label: 'Enthusiastic', desc: 'Mission & Culture Oriented' }
                    ].map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setTone(t.id)}
                        className={`p-2.5 rounded-xl border text-center transition-all ${
                          tone === t.id
                            ? 'border-brand-600 dark:border-brand-500 bg-brand-50 dark:bg-brand-950/40 text-brand-900 dark:text-brand-200 font-bold shadow-subtle'
                            : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <div className="text-xs">{t.label}</div>
                        <div className="text-[10px] text-slate-400">{t.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Job Description & AI Action */}
                <div className="p-4 rounded-xl bg-brand-50/50 dark:bg-brand-950/30 border border-brand-200 dark:border-brand-800/60 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-brand-900 dark:text-brand-200 flex items-center gap-1.5">
                      <Sparkles className="h-4 w-4 text-brand-600 dark:text-brand-400" />
                      <span>Target Job Description Matcher</span>
                    </label>
                    <span className="text-[10px] text-brand-700 dark:text-brand-400 font-semibold uppercase">
                      {activeLetter.jobDescription && activeLetter.jobDescription.trim().length > 25
                        ? 'JD Mode'
                        : 'Role Skillset Mode'}
                    </span>
                  </div>

                  <Textarea
                    placeholder="Paste the job description or required qualifications here (optional: if left empty, letter will be crafted precisely based on role skillset and company requirements)..."
                    rows={5}
                    value={activeLetter.jobDescription || ''}
                    onChange={(e) => handleFieldChange('jobDescription', e.target.value)}
                  />

                  <Button
                    onClick={handleGenerateWithJD}
                    isLoading={isGenerating}
                    size="sm"
                    className="w-full"
                    leftIcon={<Sparkles className="h-3.5 w-3.5" />}
                  >
                    {activeLetter.jobDescription && activeLetter.jobDescription.trim().length > 25
                      ? 'Auto-Tailor Letter to Job Description'
                      : 'Auto-Generate Letter from Role Skillset'}
                  </Button>
                </div>
              </div>
            )}

            {/* TAB 2: LETTER CONTENT */}
            {activeTab === 'content' && (
              <div className="space-y-6">
                {/* Sender Info */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                    Sender Information
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Input
                      label="Full Name"
                      value={senderInfo.fullName || ''}
                      onChange={(e) => handleFieldChange('senderInfo.fullName', e.target.value)}
                    />
                    <Input
                      label="Email"
                      value={senderInfo.email || ''}
                      onChange={(e) => handleFieldChange('senderInfo.email', e.target.value)}
                    />
                    <Input
                      label="Phone"
                      value={senderInfo.phone || ''}
                      onChange={(e) => handleFieldChange('senderInfo.phone', e.target.value)}
                    />
                    <Input
                      label="Location"
                      value={senderInfo.location || ''}
                      onChange={(e) => handleFieldChange('senderInfo.location', e.target.value)}
                    />
                    <Input
                      label="LinkedIn (Optional)"
                      value={senderInfo.linkedin || ''}
                      onChange={(e) => handleFieldChange('senderInfo.linkedin', e.target.value)}
                    />
                    <Input
                      label="Website (Optional)"
                      value={senderInfo.website || ''}
                      onChange={(e) => handleFieldChange('senderInfo.website', e.target.value)}
                    />
                  </div>
                </div>

                {/* Letter Salutation & Opening */}
                <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                    Salutation & Opening
                  </h4>
                  <Input
                    label="Salutation"
                    value={activeLetter.salutation || ''}
                    onChange={(e) => handleFieldChange('salutation', e.target.value)}
                  />
                  <Textarea
                    label="Opening Paragraph (Hook & Position Interest)"
                    rows={3}
                    value={activeLetter.openingParagraph || ''}
                    onChange={(e) => handleFieldChange('openingParagraph', e.target.value)}
                  />
                </div>

                {/* Dynamic Body Paragraphs */}
                <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                      Body Paragraphs ({activeLetter.bodyParagraphs?.length || 0})
                    </h4>
                    <Button
                      size="xs"
                      variant="outline"
                      onClick={() => dispatch(addBodyParagraph())}
                      leftIcon={<Plus className="h-3 w-3" />}
                    >
                      Add Paragraph
                    </Button>
                  </div>

                  {(activeLetter.bodyParagraphs || []).map((para, index) => (
                    <div key={index} className="space-y-1 relative group">
                      <div className="flex justify-between items-center text-xs text-slate-500">
                        <span className="font-semibold text-slate-700 dark:text-slate-300">Paragraph #{index + 1}</span>
                        <button
                          type="button"
                          onClick={() => dispatch(removeBodyParagraph(index))}
                          className="text-rose-500 hover:text-rose-700 p-1"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                      <Textarea
                        rows={4}
                        value={para}
                        onChange={(e) =>
                          dispatch(updateBodyParagraph({ index, text: e.target.value }))
                        }
                      />
                    </div>
                  ))}
                </div>

                {/* Closing & Signoff */}
                <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                    Closing & Sign-Off
                  </h4>
                  <Textarea
                    label="Closing Paragraph (Call to action)"
                    rows={3}
                    value={activeLetter.closingParagraph || ''}
                    onChange={(e) => handleFieldChange('closingParagraph', e.target.value)}
                  />
                  <Input
                    label="Sign-Off Greeting"
                    value={activeLetter.signoff || ''}
                    onChange={(e) => handleFieldChange('signoff', e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* TAB 3: STYLING */}
            {activeTab === 'styling' && (
              <div className="space-y-6">
                <div className="pb-2 border-b border-slate-200 dark:border-slate-800">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Letter Design & Typography</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Match the visual branding of your resume.</p>
                </div>

                {/* Templates */}
                <div className="space-y-2.5">
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200">Letterhead Layout</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'modern', label: 'Modern Accent', desc: 'Left accent bar' },
                      { id: 'professional', label: 'Executive', desc: 'Classic divider' },
                      { id: 'minimal', label: 'Minimalist', desc: 'Clean header' }
                    ].map((tmpl) => (
                      <button
                        key={tmpl.id}
                        type="button"
                        onClick={() => dispatch(setLetterTemplate(tmpl.id))}
                        className={`p-3 rounded-xl border text-center transition-all ${
                          (activeLetter.template || 'modern') === tmpl.id
                            ? 'border-brand-600 dark:border-brand-500 bg-brand-50 dark:bg-brand-950/40 text-brand-900 dark:text-brand-200 font-bold shadow-subtle'
                            : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <div className="text-xs">{tmpl.label}</div>
                        <div className="text-[10px] text-slate-400">{tmpl.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Colors */}
                <div className="space-y-2.5 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200">Accent Color</label>
                  <div className="grid grid-cols-3 gap-2">
                    {COLOR_PALETTES.map((palette) => (
                      <button
                        key={palette.name}
                        type="button"
                        onClick={() =>
                          dispatch(
                            setLetterSettings({
                              primaryColor: palette.primary,
                              secondaryColor: palette.secondary
                            })
                          )
                        }
                        className={`flex items-center gap-2 p-2 rounded-xl border text-left text-xs ${
                          settings.primaryColor === palette.primary
                            ? 'border-slate-900 dark:border-brand-500 bg-slate-100 dark:bg-brand-950/40 font-bold'
                            : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <span
                          className="h-4 w-4 rounded-full inline-block shrink-0"
                          style={{ backgroundColor: palette.primary }}
                        />
                        <span className="truncate">{palette.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Fonts */}
                <div className="space-y-2.5 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200">Font Family</label>
                  <div className="grid grid-cols-2 gap-2">
                    {FONT_OPTIONS.map((f) => (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => dispatch(setLetterSettings({ fontFamily: f.id }))}
                        className={`p-2.5 rounded-xl border text-left text-xs ${
                          (settings.fontFamily || 'Inter') === f.id
                            ? 'border-brand-600 dark:border-brand-500 bg-brand-50 dark:bg-brand-950/40 font-bold text-brand-900 dark:text-brand-300'
                            : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300'
                        }`}
                        style={{ fontFamily: f.family }}
                      >
                        {f.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Live A4 Preview */}
        <div
          className={`w-full md:w-1/2 lg:w-7/12 h-full flex flex-col bg-slate-100/70 dark:bg-slate-950 relative overflow-hidden ${
            mobileTab === 'editor' ? 'hidden md:flex' : 'flex'
          }`}
        >
          {/* Top Live Toolbar */}
          <div className="p-3 bg-white/80 dark:bg-slate-900/80 backdrop-blur border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 z-10">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Live A4 Cover Letter ({zoom}%)
            </span>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setZoom(Math.max(50, zoom - 15))}
                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
              >
                <ZoomOut className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setZoom(100)}
                className="px-2 py-1 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300"
              >
                100%
              </button>
              <button
                type="button"
                onClick={() => setZoom(Math.min(150, zoom + 15))}
                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
              >
                <ZoomIn className="h-3.5 w-3.5" />
              </button>
              <div className="h-4 w-[1px] bg-slate-200 dark:bg-slate-700 mx-1" />
              <button
                type="button"
                onClick={() => window.print()}
                className="flex items-center gap-1 p-1.5 px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200"
              >
                <Printer className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Print</span>
              </button>
            </div>
          </div>

          {/* Scaled Preview */}
          <div className="flex-1 overflow-auto p-4 sm:p-8 flex justify-center items-start">
            <div
              style={{
                transform: `scale(${zoom / 100})`,
                transformOrigin: 'top center',
                transition: 'transform 0.15s ease-out'
              }}
              className="shrink-0"
            >
              <CoverLetterRenderer letter={activeLetter} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoverLetterEditorPage;
