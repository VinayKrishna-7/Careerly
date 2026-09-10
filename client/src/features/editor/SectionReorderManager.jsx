import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setSectionOrder,
  toggleSectionVisibility,
  updateActiveResumeField
} from '../../store/slices/resumeSlice.js';
import { DEFAULT_SECTION_TITLES, DEFAULT_SECTION_ORDER } from '../../utils/constants.js';
import { ArrowUp, ArrowDown, Eye, EyeOff, GripVertical, Edit2, Check, RotateCcw } from 'lucide-react';

export const SectionReorderManager = () => {
  const dispatch = useDispatch();
  const resume = useSelector((state) => state.resume.activeResume);

  const sectionOrder = resume?.sectionOrder || DEFAULT_SECTION_ORDER;
  const visibility = resume?.sectionVisibility || {};
  const sectionTitles = resume?.sectionTitles || {};

  const [editingKey, setEditingKey] = useState(null);
  const [editingValue, setEditingValue] = useState('');

  const handleMove = (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= sectionOrder.length) return;

    const newOrder = [...sectionOrder];
    const [moved] = newOrder.splice(index, 1);
    newOrder.splice(targetIndex, 0, moved);

    dispatch(setSectionOrder(newOrder));
  };

  const handleToggle = (secKey) => {
    dispatch(toggleSectionVisibility(secKey));
  };

  const handleStartEdit = (secKey, currentTitle) => {
    setEditingKey(secKey);
    setEditingValue(currentTitle);
  };

  const handleSaveTitle = (secKey) => {
    const defaultTitle = DEFAULT_SECTION_TITLES[secKey] || secKey;
    const finalValue = editingValue.trim() || defaultTitle;
    dispatch(updateActiveResumeField({ path: `sectionTitles.${secKey}`, value: finalValue }));
    setEditingKey(null);
  };

  const handleResetTitle = (secKey) => {
    const defaultTitle = DEFAULT_SECTION_TITLES[secKey] || secKey;
    dispatch(updateActiveResumeField({ path: `sectionTitles.${secKey}`, value: defaultTitle }));
    if (editingKey === secKey) {
      setEditingKey(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="pb-2 border-b border-slate-200 dark:border-slate-800">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">Section Names, Order & Visibility</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Rename section headings to match your preference, reorder sections, or hide optional sections.
        </p>
      </div>

      <div className="space-y-2.5">
        {sectionOrder.map((secKey, index) => {
          const isVisible = visibility[secKey] !== false;
          const defaultTitle = DEFAULT_SECTION_TITLES[secKey] || secKey;
          const currentTitle = sectionTitles[secKey] || defaultTitle;
          const isCustomized = sectionTitles[secKey] && sectionTitles[secKey] !== defaultTitle;
          const isCurrentlyEditing = editingKey === secKey;

          return (
            <div
              key={secKey}
              className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                isVisible
                  ? 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-subtle'
                  : 'border-slate-200/60 dark:border-slate-800/60 bg-slate-50 dark:bg-slate-900/40 opacity-60'
              }`}
            >
              <div className="flex items-center gap-3 flex-1 min-w-0 mr-2">
                <GripVertical className="h-4 w-4 text-slate-300 dark:text-slate-600 shrink-0" />
                <div className="flex-1 min-w-0">
                  {isCurrentlyEditing ? (
                    <div className="flex items-center gap-1.5 py-0.5">
                      <input
                        type="text"
                        value={editingValue}
                        onChange={(e) => setEditingValue(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSaveTitle(secKey);
                          if (e.key === 'Escape') setEditingKey(null);
                        }}
                        autoFocus
                        className="text-xs font-bold text-slate-900 dark:text-white bg-white dark:bg-slate-900 border border-brand-500 rounded px-2 py-1 w-full max-w-[200px] outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => handleSaveTitle(secKey)}
                        className="p-1 rounded bg-brand-600 text-white hover:bg-brand-700"
                        title="Save name"
                      >
                        <Check className="h-3 w-3" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                        {currentTitle}
                      </h4>
                      <button
                        type="button"
                        onClick={() => handleStartEdit(secKey, currentTitle)}
                        className="p-1 text-slate-400 hover:text-brand-600 dark:hover:text-brand-400"
                        title="Edit section name"
                      >
                        <Edit2 className="h-3 w-3" />
                      </button>
                      {isCustomized && (
                        <button
                          type="button"
                          onClick={() => handleResetTitle(secKey)}
                          className="text-[10px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 underline shrink-0"
                          title={`Reset to default name ("${defaultTitle}")`}
                        >
                          Reset
                        </button>
                      )}
                    </div>
                  )}
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 block">
                    Position #{index + 1}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                {/* Visibility Toggle */}
                <button
                  type="button"
                  onClick={() => handleToggle(secKey)}
                  title={isVisible ? 'Hide Section' : 'Show Section'}
                  className={`p-1.5 rounded-lg border transition-colors ${
                    isVisible
                      ? 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                      : 'border-slate-300 dark:border-slate-700 text-slate-400 bg-slate-100 dark:bg-slate-900'
                  }`}
                >
                  {isVisible ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                </button>

                {/* Move Up */}
                <button
                  type="button"
                  disabled={index === 0}
                  onClick={() => handleMove(index, -1)}
                  title="Move Up"
                  className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-30 disabled:pointer-events-none"
                >
                  <ArrowUp className="h-3.5 w-3.5" />
                </button>

                {/* Move Down */}
                <button
                  type="button"
                  disabled={index === sectionOrder.length - 1}
                  onClick={() => handleMove(index, 1)}
                  title="Move Down"
                  className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-30 disabled:pointer-events-none"
                >
                  <ArrowDown className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SectionReorderManager;

