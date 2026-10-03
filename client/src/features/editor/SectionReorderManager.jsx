import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setSectionOrder,
  toggleSectionVisibility,
  updateActiveResumeField,
  addCustomSection,
  removeCustomSection,
  updateCustomSectionTitle,
  setActiveSection
} from '../../store/slices/resumeSlice.js';
import { setActiveEditorTab } from '../../store/slices/uiSlice.js';
import { DEFAULT_SECTION_TITLES, DEFAULT_SECTION_ORDER } from '../../utils/constants.js';
import Button from '../../components/ui/Button.jsx';
import ConfirmDialog from '../../components/ui/ConfirmDialog.jsx';
import {
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  GripVertical,
  Edit2,
  Check,
  RotateCcw,
  Plus,
  Trash2,
  Sparkles,
  ExternalLink,
  BookOpen,
  HeartHandshake,
  Award,
  Scroll,
  Users,
  Mic,
  Briefcase
} from 'lucide-react';

const PRESET_CUSTOM_SECTIONS = [
  { title: 'Publications', icon: <BookOpen className="h-3.5 w-3.5 text-blue-500" /> },
  { title: 'Volunteer Work', icon: <HeartHandshake className="h-3.5 w-3.5 text-rose-500" /> },
  { title: 'Honors & Awards', icon: <Award className="h-3.5 w-3.5 text-amber-500" /> },
  { title: 'Patents', icon: <Scroll className="h-3.5 w-3.5 text-emerald-500" /> },
  { title: 'References', icon: <Users className="h-3.5 w-3.5 text-purple-500" /> },
  { title: 'Speaking & Talks', icon: <Mic className="h-3.5 w-3.5 text-indigo-500" /> },
  { title: 'Freelance Projects', icon: <Briefcase className="h-3.5 w-3.5 text-cyan-500" /> }
];

export const SectionReorderManager = () => {
  const dispatch = useDispatch();
  const resume = useSelector((state) => state.resume.activeResume);

  const sectionOrder = resume?.sectionOrder || DEFAULT_SECTION_ORDER;
  const visibility = resume?.sectionVisibility || {};
  const sectionTitles = resume?.sectionTitles || {};
  const customSections = resume?.customSections || [];

  const [editingKey, setEditingKey] = useState(null);
  const [editingValue, setEditingValue] = useState('');

  // Add Custom Section Form State
  const [isAddingSection, setIsAddingSection] = useState(false);
  const [customSectionInput, setCustomSectionInput] = useState('');

  // Delete Section Confirmation State
  const [sectionToDelete, setSectionToDelete] = useState(null);

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
    const isCustom = customSections.some((s) => s.id === secKey);
    const defaultTitle = isCustom
      ? customSections.find((s) => s.id === secKey)?.title || 'Custom Section'
      : DEFAULT_SECTION_TITLES[secKey] || secKey;

    const finalValue = editingValue.trim() || defaultTitle;

    if (isCustom) {
      dispatch(updateCustomSectionTitle({ sectionId: secKey, title: finalValue }));
    } else {
      dispatch(updateActiveResumeField({ path: `sectionTitles.${secKey}`, value: finalValue }));
    }
    setEditingKey(null);
  };

  const handleResetTitle = (secKey) => {
    const defaultTitle = DEFAULT_SECTION_TITLES[secKey] || secKey;
    dispatch(updateActiveResumeField({ path: `sectionTitles.${secKey}`, value: defaultTitle }));
    if (editingKey === secKey) {
      setEditingKey(null);
    }
  };

  const handleCreateCustomSection = (titleToUse) => {
    const title = (titleToUse || customSectionInput).trim();
    if (!title) return;

    const newId = `custom_${Date.now()}`;
    dispatch(addCustomSection({ id: newId, title, items: [] }));
    setCustomSectionInput('');
    setIsAddingSection(false);
  };

  const handleNavigateToSection = (secKey) => {
    dispatch(setActiveEditorTab('content'));
    dispatch(setActiveSection(secKey));
  };

  const handleConfirmDelete = () => {
    if (sectionToDelete) {
      dispatch(removeCustomSection(sectionToDelete.id));
      setSectionToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Section Names, Order & Visibility
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Rename headings, drag or move up/down to reorder, hide sections, or add your own custom sections.
          </p>
        </div>

        {!isAddingSection && (
          <Button
            size="xs"
            variant="primary"
            onClick={() => setIsAddingSection(true)}
            leftIcon={<Plus className="h-3.5 w-3.5" />}
            className="shrink-0"
          >
            Add Custom Section
          </Button>
        )}
      </div>

      {/* Add Custom Section Panel */}
      {isAddingSection && (
        <div className="p-4 rounded-xl border-2 border-brand-200 dark:border-brand-800/80 bg-brand-50/40 dark:bg-brand-950/20 space-y-3.5 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-brand-600 text-white flex items-center justify-center shadow-xs">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                  Add Your Own Section
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Choose a preset or enter any title for your custom section
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setIsAddingSection(false);
                setCustomSectionInput('');
              }}
              className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            >
              Cancel
            </button>
          </div>

          {/* Quick Presets */}
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
              Popular Presets
            </span>
            <div className="flex flex-wrap gap-1.5">
              {PRESET_CUSTOM_SECTIONS.map((preset) => (
                <button
                  key={preset.title}
                  type="button"
                  onClick={() => handleCreateCustomSection(preset.title)}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-brand-500 hover:text-brand-600 dark:hover:border-brand-500 transition-all shadow-xs"
                >
                  {preset.icon}
                  <span>{preset.title}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Section Title Input */}
          <div className="flex items-center gap-2 pt-1">
            <input
              type="text"
              placeholder="Or type a custom section name (e.g. Volunteer Experience)"
              value={customSectionInput}
              onChange={(e) => setCustomSectionInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleCreateCustomSection();
                if (e.key === 'Escape') setIsAddingSection(false);
              }}
              autoFocus
              className="flex-1 text-xs font-semibold px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            <Button
              size="sm"
              variant="primary"
              disabled={!customSectionInput.trim()}
              onClick={() => handleCreateCustomSection()}
            >
              Add Section
            </Button>
          </div>
        </div>
      )}

      {/* Sections List */}
      <div className="space-y-2.5">
        {sectionOrder.map((secKey, index) => {
          const isVisible = visibility[secKey] !== false;
          const isCustom = customSections.some((s) => s.id === secKey);
          const customSection = customSections.find((s) => s.id === secKey);

          const defaultTitle = isCustom
            ? customSection?.title || 'Custom Section'
            : DEFAULT_SECTION_TITLES[secKey] || secKey;

          const currentTitle = sectionTitles[secKey] || defaultTitle;
          const isCustomized = !isCustom && sectionTitles[secKey] && sectionTitles[secKey] !== defaultTitle;
          const isCurrentlyEditing = editingKey === secKey;

          return (
            <div
              key={secKey}
              className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                isVisible
                  ? isCustom
                    ? 'border-brand-200 dark:border-brand-900/60 bg-white dark:bg-slate-800 shadow-subtle'
                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-subtle'
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
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                        {currentTitle}
                      </h4>

                      {isCustom && (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-brand-100 text-brand-700 dark:bg-brand-950 dark:text-brand-300">
                          Custom
                        </span>
                      )}

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

                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] text-slate-400 dark:text-slate-500">
                      Position #{index + 1}
                    </span>

                    {/* Quick navigation link */}
                    <button
                      type="button"
                      onClick={() => handleNavigateToSection(secKey)}
                      className="text-[10px] text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-0.5"
                    >
                      <span>Edit Content</span>
                      <ExternalLink className="h-2.5 w-2.5" />
                    </button>
                  </div>
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

                {/* Delete button (for Custom Sections) */}
                {isCustom && (
                  <button
                    type="button"
                    onClick={() => setSectionToDelete({ id: secKey, title: currentTitle })}
                    title="Delete Custom Section"
                    className="p-1.5 rounded-lg border border-rose-200 dark:border-rose-900/60 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:text-rose-700 transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={!!sectionToDelete}
        onClose={() => setSectionToDelete(null)}
        onConfirm={handleConfirmDelete}
        title={`Delete "${sectionToDelete?.title || 'Section'}"?`}
        message="Are you sure you want to remove this custom section? All entries inside it will be permanently deleted from this resume."
        confirmText="Delete Section"
        confirmVariant="danger"
      />
    </div>
  );
};

export default SectionReorderManager;
