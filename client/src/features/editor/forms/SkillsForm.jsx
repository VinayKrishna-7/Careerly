import React, { useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateActiveResumeField } from '../../../store/slices/resumeSlice.js';
import Button from '../../../components/ui/Button.jsx';
import Input from '../../../components/ui/Input.jsx';
import SectionHeader from './SectionHeader.jsx';
import { Plus, X, Sparkles, Edit2, Check, Trash2, FolderPlus, Tag } from 'lucide-react';

const SUGGESTED_SKILLS = [
  { name: 'JavaScript', category: 'Programming Languages' },
  { name: 'TypeScript', category: 'Programming Languages' },
  { name: 'Python', category: 'Programming Languages' },
  { name: 'Java', category: 'Programming Languages' },
  { name: 'C++', category: 'Programming Languages' },
  { name: 'SQL', category: 'Programming Languages' },
  { name: 'React', category: 'Frameworks & Libraries' },
  { name: 'Next.js', category: 'Frameworks & Libraries' },
  { name: 'Node.js', category: 'Frameworks & Libraries' },
  { name: 'Express.js', category: 'Frameworks & Libraries' },
  { name: 'Tailwind CSS', category: 'Frameworks & Libraries' },
  { name: 'MongoDB', category: 'Databases' },
  { name: 'PostgreSQL', category: 'Databases' },
  { name: 'Redis', category: 'Databases' },
  { name: 'Docker', category: 'Tools & Platforms' },
  { name: 'Git', category: 'Tools & Platforms' },
  { name: 'AWS', category: 'Tools & Platforms' },
  { name: 'Jest', category: 'Tools & Platforms' }
];

const PRESET_CATEGORIES = [
  'Programming Languages',
  'Frameworks & Libraries',
  'Databases',
  'Tools & Platforms',
  'Cloud & DevOps',
  'Soft Skills'
];

export const SkillsForm = () => {
  const dispatch = useDispatch();
  const skills = useSelector((state) => state.resume.activeResume?.skills) || [];

  // Local state for adding a brand new category
  const [newCategoryName, setNewCategoryName] = useState('');
  const [showAddCategoryInput, setShowAddCategoryInput] = useState(false);

  // Local state for editing category names: { [oldCategoryName]: editingNewName }
  const [editingCategory, setEditingCategory] = useState(null);
  const [editedCategoryName, setEditedCategoryName] = useState('');

  // Local state for per-category quick skill input: { [categoryName]: skillInputString }
  const [categoryInputs, setCategoryInputs] = useState({});

  // List of extra empty categories created by user during this session
  const [customEmptyCategories, setCustomEmptyCategories] = useState([]);

  // Group skills by category
  const categorizedSkills = useMemo(() => {
    const groups = {};

    // First ensure custom empty categories exist
    customEmptyCategories.forEach((cat) => {
      if (!groups[cat]) groups[cat] = [];
    });

    // Group actual skills
    skills.forEach((skill) => {
      const cat = (typeof skill === 'object' && skill?.category ? skill.category.trim() : '') || 'Technical Skills';
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(skill);
    });

    return groups;
  }, [skills, customEmptyCategories]);

  // Handle adding skill(s) to a specific category
  const handleAddSkillsToCategory = (categoryName, inputString) => {
    const text = (inputString || categoryInputs[categoryName] || '').trim();
    if (!text) return;

    // Support comma-separated inputs (e.g. "React, Node.js, Next.js")
    const skillNames = text
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    if (skillNames.length === 0) return;

    const existingNames = new Set(skills.map((s) => (s.name || '').toLowerCase()));
    const newItems = [];

    skillNames.forEach((name) => {
      if (!existingNames.has(name.toLowerCase())) {
        newItems.push({
          name,
          category: categoryName
        });
        existingNames.add(name.toLowerCase());
      }
    });

    if (newItems.length > 0) {
      dispatch(
        updateActiveResumeField({
          path: 'skills',
          value: [...skills, ...newItems]
        })
      );
    }

    // Clear input
    setCategoryInputs((prev) => ({ ...prev, [categoryName]: '' }));
  };

  // Remove a single skill
  const handleRemoveSkill = (skillNameToRemove) => {
    const updated = skills.filter(
      (s) => (typeof s === 'string' ? s : s?.name) !== skillNameToRemove
    );
    dispatch(
      updateActiveResumeField({
        path: 'skills',
        value: updated
      })
    );
  };

  // Create a new category
  const handleCreateCategory = (nameToCreate) => {
    const catName = (nameToCreate || newCategoryName).trim();
    if (!catName) return;

    if (!categorizedSkills[catName]) {
      setCustomEmptyCategories((prev) => [...prev, catName]);
    }
    setNewCategoryName('');
    setShowAddCategoryInput(false);
  };

  // Rename a category
  const handleStartRenameCategory = (currentCatName) => {
    setEditingCategory(currentCatName);
    setEditedCategoryName(currentCatName);
  };

  const handleSaveRenameCategory = (oldCatName) => {
    const newName = editedCategoryName.trim();
    if (!newName || newName === oldCatName) {
      setEditingCategory(null);
      return;
    }

    // Update all skills in activeResume with the new category name
    const updated = skills.map((s) => {
      const currentCat = (typeof s === 'object' && s?.category ? s.category.trim() : '') || 'Technical Skills';
      if (currentCat.toLowerCase() === oldCatName.toLowerCase()) {
        return { ...s, category: newName };
      }
      return s;
    });

    dispatch(
      updateActiveResumeField({
        path: 'skills',
        value: updated
      })
    );

    // Also update custom empty categories list
    setCustomEmptyCategories((prev) =>
      prev.map((c) => (c.toLowerCase() === oldCatName.toLowerCase() ? newName : c))
    );

    setEditingCategory(null);
    setEditedCategoryName('');
  };

  // Delete an entire category
  const handleDeleteCategory = (catToDelete) => {
    // Filter out all skills belonging to this category
    const updated = skills.filter((s) => {
      const currentCat = (typeof s === 'object' && s?.category ? s.category.trim() : '') || 'Technical Skills';
      return currentCat.toLowerCase() !== catToDelete.toLowerCase();
    });

    dispatch(
      updateActiveResumeField({
        path: 'skills',
        value: updated
      })
    );

    // Remove from custom empty categories
    setCustomEmptyCategories((prev) =>
      prev.filter((c) => c.toLowerCase() !== catToDelete.toLowerCase())
    );
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        sectionKey="skills"
        description="Organize your skills into custom categories (e.g. Programming, Tools, Databases). You can rename, add, or remove categories and skills freely."
      />

      {/* Top Action Bar: Add Category & Presets */}
      <div className="p-4 bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-xl space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
            <FolderPlus className="h-4 w-4 text-brand-500" />
            Skills Categories Manager
          </span>
          {!showAddCategoryInput && (
            <Button
              onClick={() => setShowAddCategoryInput(true)}
              size="sm"
              variant="outline"
              leftIcon={<Plus className="h-3.5 w-3.5" />}
            >
              Add New Category
            </Button>
          )}
        </div>

        {/* Add New Category Input Form */}
        {showAddCategoryInput && (
          <div className="flex items-center gap-2 pt-1">
            <input
              type="text"
              autoFocus
              placeholder="e.g. Cloud & DevOps, Testing, Machine Learning"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleCreateCategory();
                } else if (e.key === 'Escape') {
                  setShowAddCategoryInput(false);
                }
              }}
              className="flex-1 rounded-lg border border-brand-300 dark:border-brand-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            <Button size="sm" onClick={() => handleCreateCategory()}>
              Create
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setShowAddCategoryInput(false);
                setNewCategoryName('');
              }}
            >
              Cancel
            </Button>
          </div>
        )}

        {/* Preset Category Quick-Add Pills */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mr-1">Quick categories:</span>
          {PRESET_CATEGORIES.map((preset) => {
            const exists = Boolean(categorizedSkills[preset]);
            return (
              <button
                key={preset}
                type="button"
                disabled={exists}
                onClick={() => handleCreateCategory(preset)}
                className={`text-[11px] px-2 py-0.5 rounded-md border transition-all ${
                  exists
                    ? 'border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-default'
                    : 'border-brand-200 dark:border-brand-800/60 bg-white dark:bg-slate-800/80 text-brand-700 dark:text-brand-300 hover:bg-brand-50 dark:hover:bg-brand-950/40'
                }`}
              >
                {exists ? `✓ ${preset}` : `+ ${preset}`}
              </button>
            );
          })}
        </div>
      </div>

      {/* Categories List Cards */}
      <div className="space-y-4">
        {Object.keys(categorizedSkills).length === 0 ? (
          <div className="text-center py-8 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-400 dark:text-slate-500">
            No skill categories added yet. Click &quot;Add New Category&quot; or select a preset above.
          </div>
        ) : (
          Object.entries(categorizedSkills).map(([categoryName, items]) => {
            const isEditing = editingCategory === categoryName;
            const currentInputVal = categoryInputs[categoryName] || '';

            return (
              <div
                key={categoryName}
                className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-3 shadow-subtle transition-all"
              >
                {/* Category Card Header */}
                <div className="flex items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-2.5">
                  {isEditing ? (
                    <div className="flex items-center gap-1.5 flex-1">
                      <input
                        type="text"
                        autoFocus
                        value={editedCategoryName}
                        onChange={(e) => setEditedCategoryName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleSaveRenameCategory(categoryName);
                          } else if (e.key === 'Escape') {
                            setEditingCategory(null);
                          }
                        }}
                        className="rounded-lg border border-brand-400 dark:border-brand-600 bg-white dark:bg-slate-800 px-2.5 py-1 text-xs font-bold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500 flex-1 max-w-sm"
                      />
                      <button
                        type="button"
                        onClick={() => handleSaveRenameCategory(categoryName)}
                        className="p-1 rounded-md bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 hover:bg-brand-100 dark:hover:bg-brand-900 transition-colors"
                        title="Save name"
                      >
                        <Check className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingCategory(null)}
                        className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                        title="Cancel"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wide">
                        {categoryName}
                      </h4>
                      <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-1.5 py-0.5 rounded-full font-medium">
                        {items.length} {items.length === 1 ? 'skill' : 'skills'}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleStartRenameCategory(categoryName)}
                        className="p-1 text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors rounded"
                        title="Rename Category Title"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  )}

                  {/* Delete Entire Category */}
                  <button
                    type="button"
                    onClick={() => handleDeleteCategory(categoryName)}
                    className="p-1 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors rounded"
                    title={`Delete category "${categoryName}"`}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* Skills Chips in this Category */}
                <div className="min-h-[32px] flex flex-wrap gap-1.5 items-center">
                  {items.length === 0 ? (
                    <span className="text-[11px] text-slate-400 italic">No skills in this category yet.</span>
                  ) : (
                    items.map((skill, idx) => {
                      const skillName = typeof skill === 'string' ? skill : skill.name;
                      return (
                        <span
                          key={skill.id || idx}
                          className="inline-flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/90 text-slate-800 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700/80 px-2.5 py-1 rounded-lg text-xs font-medium group transition-all"
                        >
                          <Tag className="h-2.5 w-2.5 text-brand-500" />
                          <span>{skillName}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveSkill(skillName)}
                            className="text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors ml-0.5"
                            title={`Remove ${skillName}`}
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      );
                    })
                  )}
                </div>

                {/* Add Skill to this Category Input */}
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="text"
                    placeholder={`Add skill(s) to ${categoryName} (e.g. React, Node.js)`}
                    value={currentInputVal}
                    onChange={(e) =>
                      setCategoryInputs((prev) => ({
                        ...prev,
                        [categoryName]: e.target.value
                      }))
                    }
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddSkillsToCategory(categoryName);
                      }
                    }}
                    className="flex-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 px-3 py-1.5 text-xs text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleAddSkillsToCategory(categoryName)}
                    leftIcon={<Plus className="h-3.5 w-3.5" />}
                  >
                    Add
                  </Button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Suggested Skills to Quick-Add */}
      <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
        <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5 text-brand-500" />
          <span>Quick Add Popular Skills</span>
        </p>
        <div className="flex flex-wrap gap-1.5">
          {SUGGESTED_SKILLS.map((item) => {
            const isAdded = skills.some(
              (s) => (typeof s === 'string' ? s : s?.name).toLowerCase() === item.name.toLowerCase()
            );
            return (
              <button
                key={item.name}
                type="button"
                disabled={isAdded}
                onClick={() => handleAddSkillsToCategory(item.category, item.name)}
                className={`text-[11px] font-medium px-2.5 py-1 rounded-lg border transition-all ${
                  isAdded
                    ? 'border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 opacity-60 cursor-default'
                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:border-brand-300 dark:hover:border-brand-600 hover:bg-brand-50 dark:hover:bg-brand-950/50 hover:text-brand-700 dark:hover:text-brand-300'
                }`}
              >
                {isAdded ? `✓ ${item.name}` : `+ ${item.name} (${item.category.split(' ')[0]})`}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SkillsForm;
