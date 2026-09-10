import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchResumeById } from '../store/slices/resumeSlice.js';
import { resumeApi } from '../services/resumeApi.js';
import { showToast } from '../store/slices/uiSlice.js';
import ResumeRenderer from '../templates/ResumeRenderer.jsx';
import Button from '../components/ui/Button.jsx';
import ThemeToggle from '../components/ui/ThemeToggle.jsx';
import Spinner from '../components/ui/Spinner.jsx';
import { ArrowLeft, Download, Printer, ZoomIn, ZoomOut } from 'lucide-react';

export const ResumePreviewPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { activeResume, isLoadingActive } = useSelector((state) => state.resume);

  const [zoom, setZoom] = useState(100);
  const [isDownloading, setIsDownloading] = useState(false);
  const [autoFitScale, setAutoFitScale] = useState(1);

  useEffect(() => {
    if (id && (!activeResume || activeResume._id !== id)) {
      dispatch(fetchResumeById(id));
    }
  }, [id, activeResume?._id, dispatch]);

  const handleDownloadPdf = async () => {
    if (!activeResume) return;
    setIsDownloading(true);
    try {
      await resumeApi.downloadPdf(activeResume._id, `${activeResume.title || 'Resume'}.pdf`);
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

  if ((isLoadingActive && !activeResume) || !activeResume) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <Spinner size="lg" message="Rendering high-resolution preview..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex flex-col transition-colors">
      {/* Top Floating Action Bar */}
      <div className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur border-b border-slate-200 dark:border-slate-800 px-4 sm:px-8 py-3 shadow-subtle no-print">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to={`/editor/${activeResume._id}`}>
              <Button variant="outline" size="sm" leftIcon={<ArrowLeft className="h-3.5 w-3.5" />}>
                Back to Editor
              </Button>
            </Link>
            <span className="text-sm font-bold text-slate-900 dark:text-white hidden sm:inline">
              {activeResume.title}
            </span>
            <span className="hidden md:inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 rounded-full">
              Smart 1-Page Fit {autoFitScale !== 1 ? `(${Math.round(autoFitScale * 100)}%)` : '(100%)'}
            </span>
          </div>

          {/* Zoom, Theme & Export Actions */}
          <div className="flex items-center gap-2">
            <ThemeToggle size="sm" />

            <div className="hidden sm:flex items-center gap-1 mr-2 border border-slate-200 dark:border-slate-700 rounded-lg p-1 bg-slate-50 dark:bg-slate-800">
              <button
                type="button"
                onClick={() => setZoom(Math.max(50, zoom - 15))}
                className="p-1 rounded text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700"
              >
                <ZoomOut className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setZoom(Math.min(150, zoom + 15))}
                className="p-1 rounded text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700"
              >
                <ZoomIn className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setZoom(100)}
                className="text-xs font-semibold px-1 text-slate-700 dark:text-slate-200 hover:underline"
              >
                {zoom}%
              </button>
            </div>

            <Button variant="outline" size="sm" onClick={handlePrint} leftIcon={<Printer className="h-3.5 w-3.5" />}>
              Print
            </Button>

            <Button
              variant="primary"
              size="sm"
              onClick={handleDownloadPdf}
              isLoading={isDownloading}
              leftIcon={<Download className="h-3.5 w-3.5" />}
            >
              Download PDF
            </Button>
          </div>
        </div>
      </div>

      {/* Main Preview A4 Sheet */}
      <div className="flex-1 overflow-auto p-4 sm:p-12 flex items-start justify-center min-h-0">
        <div className="m-auto shrink-0 flex justify-center py-2">
          <div
            style={{
              transform: `scale(${zoom / 100})`,
              transformOrigin: 'top center',
              transition: 'transform 0.15s ease-out'
            }}
            className="shrink-0 shadow-2xl"
          >
            <ResumeRenderer resume={activeResume} onScaleChange={setAutoFitScale} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumePreviewPage;
