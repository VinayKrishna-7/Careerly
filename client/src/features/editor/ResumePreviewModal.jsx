import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { resumeApi } from '../../services/resumeApi.js';
import { showToast } from '../../store/slices/uiSlice.js';
import ResumeRenderer from '../../templates/ResumeRenderer.jsx';
import Button from '../../components/ui/Button.jsx';
import {
  X,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Printer,
  Download,
  ExternalLink,
  CheckCircle2,
  FileText
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const ResumePreviewModal = ({ isOpen, onClose, resume }) => {
  const dispatch = useDispatch();
  const [zoom, setZoom] = useState(100);
  const [isDownloading, setIsDownloading] = useState(false);
  const [autoFitScale, setAutoFitScale] = useState(1);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        onClose();
      } else if ((e.ctrlKey || e.metaKey) && (e.key === '=' || e.key === '+')) {
        e.preventDefault();
        setZoom((z) => Math.min(160, z + 15));
      } else if ((e.ctrlKey || e.metaKey) && (e.key === '-' || e.key === '_')) {
        e.preventDefault();
        setZoom((z) => Math.max(50, z - 15));
      } else if ((e.ctrlKey || e.metaKey) && e.key === '0') {
        e.preventDefault();
        setZoom(100);
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !resume) return null;

  const handleDownloadPdf = async () => {
    setIsDownloading(true);
    try {
      await resumeApi.downloadPdf(resume._id, `${resume.title || 'Resume'}.pdf`);
      dispatch(showToast({ message: 'PDF downloaded successfully!', type: 'success' }));
    } catch (err) {
      dispatch(showToast({ message: 'Error generating PDF: ' + err.message, type: 'error' }));
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div
        className="relative w-full max-w-6xl h-[92vh] max-h-[95vh] rounded-2xl bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 shadow-2xl border border-slate-200 dark:border-slate-800 z-10 flex flex-col overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Floating Control Bar */}
        <div className="flex flex-wrap items-center justify-between px-4 py-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur border-b border-slate-200 dark:border-slate-800 shrink-0 gap-2">
          {/* Resume Info */}
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="p-1.5 rounded-lg bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400">
              <FileText className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                {resume.title || 'Resume Preview'}
              </h3>
              <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                <span className="capitalize">{resume.template || 'Modern'} Template</span>
                <span>•</span>
                <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                  <CheckCircle2 className="h-3 w-3" />
                  Smart 1-Page Fit {autoFitScale !== 1 ? `(${Math.round(autoFitScale * 100)}%)` : '(100%)'}
                </span>
              </div>
            </div>
          </div>

          {/* Actions & Zoom Controls */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Zoom Controls */}
            <div className="flex items-center gap-1 border border-slate-200 dark:border-slate-700 rounded-lg p-1 bg-slate-50 dark:bg-slate-800">
              <button
                type="button"
                onClick={() => setZoom((z) => Math.max(50, z - 15))}
                title="Zoom Out (Ctrl -)"
                className="p-1 rounded text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 transition-colors"
              >
                <ZoomOut className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setZoom(100)}
                title="Reset Zoom to 100% (Ctrl 0)"
                className="px-2 py-0.5 text-xs font-semibold rounded text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-700"
              >
                {zoom}%
              </button>
              <button
                type="button"
                onClick={() => setZoom((z) => Math.min(160, z + 15))}
                title="Zoom In (Ctrl +)"
                className="p-1 rounded text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 transition-colors"
              >
                <ZoomIn className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Print Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
              leftIcon={<Printer className="h-3.5 w-3.5" />}
              className="text-xs"
            >
              Print
            </Button>

            {/* Export PDF Button */}
            <Button
              variant="primary"
              size="sm"
              onClick={handleDownloadPdf}
              isLoading={isDownloading}
              leftIcon={<Download className="h-3.5 w-3.5" />}
              className="text-xs"
            >
              Export PDF
            </Button>

            {/* Dedicated Page Link */}
            {resume._id && (
              <Link
                to={`/preview/${resume._id}`}
                target="_blank"
                rel="noreferrer"
                title="Open in Dedicated Full Page"
                className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors inline-flex items-center justify-center"
              >
                <ExternalLink className="h-3.5 w-3.5" />
              </Link>
            )}

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              title="Close Preview (Esc)"
              className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-200 transition-colors ml-1"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Scrollable A4 Document Container */}
        <div className="flex-1 overflow-auto p-4 sm:p-8 md:p-12 flex items-start justify-center min-h-0 bg-slate-200/60 dark:bg-slate-950">
          <div className="m-auto shrink-0 flex justify-center py-2">
            <div
              style={{
                transform: `scale(${zoom / 100})`,
                transformOrigin: 'top center',
                transition: 'transform 0.15s ease-out'
              }}
              className="shrink-0 shadow-2xl"
            >
              <ResumeRenderer resume={resume} onScaleChange={setAutoFitScale} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumePreviewModal;
