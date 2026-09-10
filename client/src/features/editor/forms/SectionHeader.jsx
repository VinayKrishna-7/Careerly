import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateActiveResumeField } from '../../../store/slices/resumeSlice.js';
import { DEFAULT_SECTION_TITLES } from '../../../utils/constants.js';
import { Edit3, Check, RotateCcw } from 'lucide-react';

export const SectionHeader = ({ sectionKey, description, children }) => {
  const dispatch = useDispatch();
  const defaultTitle = DEFAULT_SECTION_TITLES[sectionKey] || sectionKey;
  const currentTitle =
    useSelector((state) => state.resume.activeResume?.sectionTitles?.[sectionKey]) ?? defaultTitle;

  const [isEditing, setIsEditing] = useState(false);
  const [tempTitle, setTempTitle] = useState(currentTitle);

  const handleStartEdit = () => {
    setTempTitle(currentTitle);
    setIsEditing(true);
  };

  const handleSave = () => {
    const finalTitle = tempTitle.trim() || defaultTitle;
    dispatch(updateActiveResumeField({ path: `sectionTitles.${sectionKey}`, value: finalTitle }));
    setIsEditing(false);
  };

  const handleReset = () => {
    dispatch(updateActiveResumeField({ path: `sectionTitles.${sectionKey}`, value: defaultTitle }));
    setTempTitle(defaultTitle);
    setIsEditing(false);
  };

  const isCustomized = currentTitle !== defaultTitle;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
      <div className="flex-1">
        {isEditing ? (
          <div className="flex items-center gap-2 max-w-sm">
            <input
              type="text"
              value={tempTitle}
              onChange={(e) => setTempTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSave();
                if (e.key === 'Escape') setIsEditing(false);
              }}
              placeholder={defaultTitle}
              autoFocus
              className="text-sm font-bold text-slate-900 dark:text-white bg-white dark:bg-slate-800 border border-brand-500 dark:border-brand-400 rounded-lg px-2.5 py-1 w-full focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            />
            <button
              type="button"
              onClick={handleSave}
              className="p-1.5 rounded-lg bg-brand-600 text-white hover:bg-brand-700 transition-colors shrink-0"
              title="Save Section Name"
            >
              <Check className="h-4 w-4" />
            </button>
            {isCustomized && (
              <button
                type="button"
                onClick={handleReset}
                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0"
                title="Reset to Default Name"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2 group">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              {currentTitle}
            </h3>
            <button
              type="button"
              onClick={handleStartEdit}
              className="p-1 rounded text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Edit section name"
            >
              <Edit3 className="h-3.5 w-3.5" />
            </button>
            {isCustomized && (
              <button
                type="button"
                onClick={handleReset}
                className="text-[10px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 underline"
                title="Reset to default title"
              >
                Reset
              </button>
            )}
          </div>
        )}
        {description && (
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {description}
          </p>
        )}
      </div>

      {children && <div className="flex items-center gap-2 shrink-0">{children}</div>}
    </div>
  );
};

export default SectionHeader;
