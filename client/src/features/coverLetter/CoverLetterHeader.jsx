import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { saveCoverLetter, updateActiveLetterField } from '../../store/slices/coverLetterSlice.js';
import { coverLetterApi } from '../../services/coverLetterApi.js';
import { showToast } from '../../store/slices/uiSlice.js';
import Button from '../../components/ui/Button.jsx';
import ThemeToggle from '../../components/ui/ThemeToggle.jsx';
import {
  ArrowLeft,
  Save,
  Download,
  CheckCircle2,
  Loader2,
  Edit2,
  FileText
} from 'lucide-react';
import { timeAgo } from '../../utils/formatters.js';

export const CoverLetterHeader = () => {
  const dispatch = useDispatch();
  const { activeLetter, isSaving, saveStatus, isDirty, lastSaved } = useSelector(
    (state) => state.coverLetter
  );

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleValue, setTitleValue] = useState(activeLetter?.title || 'Cover Letter');
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);

  const handleTitleSubmit = async (e) => {
    e.preventDefault();
    if (titleValue.trim() && activeLetter) {
      dispatch(updateActiveLetterField({ path: 'title', value: titleValue.trim() }));
      await dispatch(
        saveCoverLetter({
          id: activeLetter._id,
          data: { ...activeLetter, title: titleValue.trim() }
        })
      );
    }
    setIsEditingTitle(false);
  };

  const handleManualSave = async () => {
    if (!activeLetter) return;
    const action = await dispatch(
      saveCoverLetter({ id: activeLetter._id, data: activeLetter })
    );
    if (saveCoverLetter.fulfilled.match(action)) {
      dispatch(showToast({ message: 'Cover letter saved successfully!', type: 'success' }));
    } else {
      dispatch(showToast({ message: 'Error saving cover letter: ' + action.payload, type: 'error' }));
    }
  };

  const handleDownloadPdf = async () => {
    if (!activeLetter) return;
    setIsDownloadingPdf(true);
    try {
      if (isDirty) {
        await dispatch(saveCoverLetter({ id: activeLetter._id, data: activeLetter })).unwrap();
      }
      await coverLetterApi.downloadPdf(activeLetter._id, `${activeLetter.title || 'CoverLetter'}.pdf`);
      dispatch(showToast({ message: 'PDF generated & downloaded!', type: 'success' }));
    } catch (err) {
      dispatch(showToast({ message: 'PDF Generation failed: ' + (err.message || 'Error'), type: 'error' }));
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-subtle px-4 sm:px-6 py-3 transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 max-w-full">
        {/* Left Side: Back button + Title */}
        <div className="flex items-center gap-3">
          <Link
            to="/cover-letters"
            className="flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden md:inline">Cover Letters</span>
          </Link>

          <div className="h-5 w-[1px] bg-slate-200 dark:bg-slate-700 hidden sm:block" />

          {isEditingTitle ? (
            <form onSubmit={handleTitleSubmit} className="flex items-center gap-2">
              <input
                type="text"
                autoFocus
                value={titleValue}
                onChange={(e) => setTitleValue(e.target.value)}
                onBlur={handleTitleSubmit}
                className="rounded-lg border border-brand-500 bg-white dark:bg-slate-800 px-2.5 py-1 text-xs sm:text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-200"
              />
            </form>
          ) : (
            <button
              onClick={() => {
                setTitleValue(activeLetter?.title || 'Cover Letter');
                setIsEditingTitle(true);
              }}
              className="flex items-center gap-2 group text-left rounded-lg px-2 py-1 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <FileText className="h-4 w-4 text-brand-600 dark:text-brand-400 shrink-0" />
              <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate max-w-[200px] sm:max-w-xs">
                {activeLetter?.title || 'Untitled Cover Letter'}
              </span>
              <Edit2 className="h-3 w-3 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          )}

          {/* Autosave Status Indicator */}
          <div className="hidden lg:flex items-center gap-1.5 text-[11px] font-medium text-slate-500 dark:text-slate-400 ml-2">
            {saveStatus === 'saving' || isSaving ? (
              <span className="flex items-center gap-1 text-brand-600 dark:text-brand-400 animate-pulse">
                <Loader2 className="h-3 w-3 animate-spin" /> Saving...
              </span>
            ) : isDirty ? (
              <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500" /> Unsaved changes
              </span>
            ) : (
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 dark:text-emerald-400" /> Saved {lastSaved ? timeAgo(lastSaved) : ''}
              </span>
            )}
          </div>
        </div>

        {/* Right Side: Theme Toggle + Actions */}
        <div className="flex items-center gap-2">
          <ThemeToggle size="sm" />

          <Button
            variant="outline"
            size="sm"
            onClick={handleManualSave}
            isLoading={isSaving}
            leftIcon={<Save className="h-3.5 w-3.5" />}
          >
            Save
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={handleDownloadPdf}
            isLoading={isDownloadingPdf}
            leftIcon={<Download className="h-3.5 w-3.5" />}
          >
            Export PDF
          </Button>
        </div>
      </div>
    </header>
  );
};

export default CoverLetterHeader;
