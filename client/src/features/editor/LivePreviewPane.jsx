import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setPreviewZoom } from '../../store/slices/uiSlice.js';
import ResumeRenderer from '../../templates/ResumeRenderer.jsx';
import { ZoomIn, ZoomOut, Printer, FileText, CheckCircle2 } from 'lucide-react';

export const LivePreviewPane = () => {
  const dispatch = useDispatch();
  const activeResume = useSelector((state) => state.resume.activeResume);
  const previewZoom = useSelector((state) => state.ui.previewZoom);
  const [autoFitScale, setAutoFitScale] = useState(1);

  const handleZoomChange = (delta) => {
    const newZoom = Math.min(150, Math.max(50, previewZoom + delta));
    dispatch(setPreviewZoom(newZoom));
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col h-full bg-slate-100/70 dark:bg-slate-950 relative overflow-hidden transition-colors">
      {/* Top Floating Toolbar for Live Preview */}
      <div className="p-3 bg-white/80 dark:bg-slate-900/80 backdrop-blur border-b border-slate-200 dark:border-slate-800 flex items-center justify-between z-10 px-4">
        <div className="flex items-center gap-2.5">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">A4 Preview</span>
          <span className="inline-flex items-center gap-1 text-[10.5px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 rounded-full">
            <CheckCircle2 className="h-3 w-3 text-emerald-500" />
            <span>Smart 1-Page Fit {autoFitScale !== 1 ? `(${Math.round(autoFitScale * 100)}%)` : '(100%)'}</span>
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => handleZoomChange(-15)}
            title="Zoom Out"
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            <ZoomOut className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => dispatch(setPreviewZoom(100))}
            title="Reset Zoom to 100%"
            className="px-2 py-1 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
          >
            {previewZoom}%
          </button>
          <button
            type="button"
            onClick={() => handleZoomChange(15)}
            title="Zoom In"
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            <ZoomIn className="h-3.5 w-3.5" />
          </button>
          <div className="h-4 w-[1px] bg-slate-200 dark:bg-slate-700 mx-1" />
          <button
            type="button"
            onClick={handlePrint}
            title="Browser Print / Quick PDF"
            className="flex items-center gap-1 p-1.5 px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            <Printer className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Print</span>
          </button>
        </div>
      </div>

      {/* Scaled Preview Scroll Container */}
      <div className="flex-1 overflow-auto p-4 sm:p-8 flex items-start justify-center min-h-0">
        <div className="m-auto shrink-0 flex justify-center py-2">
          <div
            style={{
              transform: `scale(${previewZoom / 100})`,
              transformOrigin: 'top center',
              transition: 'transform 0.15s ease-out'
            }}
            className="shrink-0"
          >
            <ResumeRenderer resume={activeResume} onScaleChange={setAutoFitScale} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LivePreviewPane;
