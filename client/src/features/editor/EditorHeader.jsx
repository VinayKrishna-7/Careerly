import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { saveResume, renameResume } from '../../store/slices/resumeSlice.js';
import { resumeApi } from '../../services/resumeApi.js';
import { showToast } from '../../store/slices/uiSlice.js';
import Button from '../../components/ui/Button.jsx';
import ThemeToggle from '../../components/ui/ThemeToggle.jsx';
import AtsScoreModal from '../ats/AtsScoreModal.jsx';
import ResumePreviewModal from './ResumePreviewModal.jsx';
import {
  ArrowLeft,
  Save,
  Download,
  Eye,
  CheckCircle2,
  Loader2,
  Edit2,
  FileText,
  Target
} from 'lucide-react';
import { timeAgo } from '../../utils/formatters.js';

export const EditorHeader = () => {
  const dispatch = useDispatch();
  const { activeResume, isSaving, saveStatus, isDirty, lastSaved } = useSelector(
    (state) => state.resume
  );

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleValue, setTitleValue] = useState(activeResume?.title || 'Resume');
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [isAtsModalOpen, setIsAtsModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

  const handleTitleSubmit = async (e) => {
    e.preventDefault();
    if (titleValue.trim() && activeResume) {
      await dispatch(renameResume({ id: activeResume._id, title: titleValue.trim() }));
    }
    setIsEditingTitle(false);
  };

  const handleManualSave = async () => {
    if (!activeResume) return;
    const action = await dispatch(saveResume({ id: activeResume._id, data: activeResume }));
    if (saveResume.fulfilled.match(action)) {
      dispatch(showToast({ message: 'Resume saved successfully!', type: 'success' }));
    } else {
      dispatch(showToast({ message: 'Error saving resume: ' + action.payload, type: 'error' }));
    }
  };

  const handleDownloadPdf = async () => {
    if (!activeResume) return;
    setIsDownloadingPdf(true);
    try {
      // If there are unsaved edits, save first so the PDF reflects exactly what's on screen
      if (isDirty) {
        await dispatch(saveResume({ id: activeResume._id, data: activeResume })).unwrap();
      }
      await resumeApi.downloadPdf(activeResume._id, `${activeResume.title || 'Resume'}.pdf`);
      dispatch(showToast({ message: 'PDF generated & downloaded!', type: 'success' }));
    } catch (err) {
      dispatch(showToast({ message: 'PDF Generation failed: ' + (err.message || 'Error'), type: 'error' }));
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-subtle px-4 sm:px-6 py-3 transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 max-w-full">
          {/* Left Side: Back button + Resume Title Editable */}
          <div className="flex items-center gap-3">
            <Link
              to="/dashboard"
              className="flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden md:inline">Dashboard</span>
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
                  setTitleValue(activeResume?.title || 'Resume');
                  setIsEditingTitle(true);
                }}
                className="flex items-center gap-2 group text-left rounded-lg px-2 py-1 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <FileText className="h-4 w-4 text-brand-600 dark:text-brand-400 shrink-0" />
                <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate max-w-[200px] sm:max-w-xs">
                  {activeResume?.title || 'Untitled Resume'}
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

          {/* Right Side: Theme Toggle + ATS Check + Action Buttons */}
          <div className="flex items-center gap-2">
            <Button
              variant="subtle"
              size="sm"
              onClick={() => setIsAtsModalOpen(true)}
              leftIcon={<Target className="h-3.5 w-3.5 text-brand-600 dark:text-brand-400" />}
              className="text-xs font-semibold"
            >
              ATS Score & Match
            </Button>

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
              variant="outline"
              size="sm"
              onClick={() => {
                if (isDirty && activeResume?._id) {
                  dispatch(saveResume({ id: activeResume._id, data: activeResume }));
                }
                setIsPreviewModalOpen(true);
              }}
              leftIcon={<Eye className="h-3.5 w-3.5" />}
            >
              Preview
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

      {/* ATS Score Modal */}
      {isAtsModalOpen && activeResume && (
        <AtsScoreModal
          isOpen={isAtsModalOpen}
          onClose={() => setIsAtsModalOpen(false)}
          resumeId={activeResume._id}
          resumeTitle={activeResume.title}
          resume={activeResume}
        />
      )}

      {/* Full-Screen Live Preview Modal */}
      {isPreviewModalOpen && activeResume && (
        <ResumePreviewModal
          isOpen={isPreviewModalOpen}
          onClose={() => setIsPreviewModalOpen(false)}
          resume={activeResume}
        />
      )}
    </>
  );
};

export default EditorHeader;
