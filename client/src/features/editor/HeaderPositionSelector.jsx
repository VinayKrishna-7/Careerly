import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveResumeSettings } from '../../store/slices/resumeSlice.js';
import { HEADER_ALIGNMENT_OPTIONS, getDefaultSettings } from '../../utils/constants.js';
import { AlignLeft, AlignCenter, AlignRight, LayoutTemplate } from 'lucide-react';

const ALIGN_ICONS = {
  left: AlignLeft,
  center: AlignCenter,
  right: AlignRight
};

export const HeaderPositionSelector = ({ className = '', showHeader = true, compact = false }) => {
  const dispatch = useDispatch();
  const activeResume = useSelector((state) => state.resume.activeResume) || {};
  const settings = activeResume.settings || {};
  const template = activeResume.template || 'modern';
  const templateDefaults = getDefaultSettings(template);

  const currentLayout =
    settings.headerLayout === 'middle'
      ? 'center'
      : settings.headerLayout || templateDefaults.headerLayout || 'left';

  const handleSelect = (positionId) => {
    dispatch(setActiveResumeSettings({ headerLayout: positionId }));
  };

  return (
    <div
      className={`p-3.5 bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-xl space-y-2.5 ${className}`}
    >
      {showHeader && (
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
            <LayoutTemplate className="h-3.5 w-3.5 text-brand-600 dark:text-brand-400" />
            <span>Header Position / Alignment</span>
          </label>
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-brand-100 dark:bg-brand-950/80 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800">
            {currentLayout === 'center' ? 'Middle' : currentLayout === 'right' ? 'Right' : 'Left'}
          </span>
        </div>
      )}
      {!compact && (
        <p className="text-[11px] text-slate-500 dark:text-slate-400">
          Choose where your name, job title, and contact links appear at the top of your resume (Left, Middle, or Right).
        </p>
      )}
      <div className="grid grid-cols-3 gap-2 pt-0.5">
        {HEADER_ALIGNMENT_OPTIONS.map((opt) => {
          const isSelected = currentLayout === opt.id;
          const Icon = ALIGN_ICONS[opt.id] || AlignLeft;

          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => handleSelect(opt.id)}
              className={`flex flex-col items-center justify-center gap-1.5 p-2.5 rounded-xl border text-center transition-all ${
                isSelected
                  ? 'border-brand-600 dark:border-brand-500 bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 font-bold shadow-sm ring-1 ring-brand-500/20'
                  : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Icon
                className={`h-4 w-4 ${
                  isSelected ? 'text-brand-600 dark:text-brand-400' : 'text-slate-500 dark:text-slate-400'
                }`}
              />
              <span className="text-xs">{opt.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default HeaderPositionSelector;
