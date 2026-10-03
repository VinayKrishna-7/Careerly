import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  addCustomSectionItem,
  updateCustomSectionItem,
  removeCustomSectionItem,
  reorderCustomSectionItems,
  removeCustomSection,
  updateCustomSectionTitle
} from '../../../store/slices/resumeSlice.js';
import Button from '../../../components/ui/Button.jsx';
import Input from '../../../components/ui/Input.jsx';
import Textarea from '../../../components/ui/Textarea.jsx';
import SectionHeader from './SectionHeader.jsx';
import ConfirmDialog from '../../../components/ui/ConfirmDialog.jsx';
import {
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Link2,
  Calendar,
  MapPin,
  Building,
  Sparkles,
  FileText
} from 'lucide-react';

export const CustomSectionForm = ({ sectionId }) => {
  const dispatch = useDispatch();
  const activeResume = useSelector((state) => state.resume.activeResume) || {};
  const customSections = activeResume.customSections || [];
  const currentSection = customSections.find((s) => s.id === sectionId) || {
    id: sectionId,
    title: activeResume.sectionTitles?.[sectionId] || 'Custom Section',
    items: []
  };

  const [isDeleteSectionDialogOpen, setIsDeleteSectionDialogOpen] = useState(false);

  const items = currentSection.items || [];

  const handleAddItem = () => {
    dispatch(
      addCustomSectionItem({
        sectionId,
        item: {
          title: '',
          subtitle: '',
          date: '',
          location: '',
          description: '',
          link: ''
        }
      })
    );
  };

  const handleUpdateItem = (index, field, value) => {
    dispatch(
      updateCustomSectionItem({
        sectionId,
        index,
        item: { [field]: value }
      })
    );
  };

  const handleRemoveItem = (index) => {
    dispatch(
      removeCustomSectionItem({
        sectionId,
        index
      })
    );
  };

  const handleMove = (fromIndex, toIndex) => {
    if (toIndex < 0 || toIndex >= items.length) return;
    dispatch(
      reorderCustomSectionItems({
        sectionId,
        fromIndex,
        toIndex
      })
    );
  };

  const handleConfirmDeleteSection = () => {
    dispatch(removeCustomSection(sectionId));
    setIsDeleteSectionDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        sectionKey={sectionId}
        description="Add entries to your custom section. Descriptions are automatically formatted into clean bullet points in your resume."
      >
        <div className="flex items-center gap-2">
          <Button
            size="xs"
            variant="outline"
            onClick={handleAddItem}
            leftIcon={<Plus className="h-3.5 w-3.5" />}
          >
            Add Entry
          </Button>

          <Button
            size="xs"
            variant="ghost"
            onClick={() => setIsDeleteSectionDialogOpen(true)}
            className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40"
            title="Delete this entire custom section"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </SectionHeader>

      {items.length === 0 ? (
        <div className="text-center py-10 px-4 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900/60 space-y-3">
          <div className="w-12 h-12 rounded-full bg-brand-50 dark:bg-brand-950/60 flex items-center justify-center mx-auto text-brand-600 dark:text-brand-400">
            <Sparkles className="h-6 w-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
              No entries in {currentSection.title} yet
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
              Add your first entry with a title, organization, timeframe, and descriptive bullet points.
            </p>
          </div>
          <Button size="sm" onClick={handleAddItem} leftIcon={<Plus className="h-4 w-4" />}>
            Add First Entry
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item, index) => (
            <div
              key={index}
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 shadow-subtle space-y-4 transition-all"
            >
              {/* Item Card Header */}
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-700/60">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-400 dark:text-slate-500">
                    #{index + 1}
                  </span>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate max-w-[200px] sm:max-w-xs">
                    {item.title || 'Untitled Entry'}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    disabled={index === 0}
                    onClick={() => handleMove(index, index - 1)}
                    className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 disabled:opacity-30 disabled:pointer-events-none"
                    title="Move entry up"
                  >
                    <ArrowUp className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    disabled={index === items.length - 1}
                    onClick={() => handleMove(index, index + 1)}
                    className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 disabled:opacity-30 disabled:pointer-events-none"
                    title="Move entry down"
                  >
                    <ArrowDown className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(index)}
                    className="p-1 rounded text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                    title="Remove entry"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  label="Title / Role / Honor"
                  placeholder="e.g. Lead Author, Volunteer Mentor, Keynote Speaker"
                  value={item.title || ''}
                  onChange={(e) => handleUpdateItem(index, 'title', e.target.value)}
                />

                <Input
                  label="Organization / Publisher / Institution"
                  placeholder="e.g. IEEE, Red Cross, University"
                  leftIcon={<Building className="h-4 w-4" />}
                  value={item.subtitle || ''}
                  onChange={(e) => handleUpdateItem(index, 'subtitle', e.target.value)}
                />

                <Input
                  label="Date / Period"
                  placeholder="e.g. 2023 - Present, May 2024"
                  leftIcon={<Calendar className="h-4 w-4" />}
                  value={item.date || ''}
                  onChange={(e) => handleUpdateItem(index, 'date', e.target.value)}
                />

                <Input
                  label="Location"
                  placeholder="e.g. San Francisco, CA or Remote"
                  leftIcon={<MapPin className="h-4 w-4" />}
                  value={item.location || ''}
                  onChange={(e) => handleUpdateItem(index, 'location', e.target.value)}
                />
              </div>

              <Input
                label="URL / Link (Optional)"
                placeholder="https://example.com/publication"
                leftIcon={<Link2 className="h-4 w-4" />}
                value={item.link || ''}
                onChange={(e) => handleUpdateItem(index, 'link', e.target.value)}
              />

              <Textarea
                label="Description & Highlights"
                placeholder="• Summarize the core impact, responsibilities, or recognition&#10;• Quantify outcomes and key achievements"
                rows={3}
                value={item.description || ''}
                onChange={(e) => handleUpdateItem(index, 'description', e.target.value)}
                helperText="Use bullet points (•) or new lines. Each line becomes a crisp bullet item in your resume."
              />
            </div>
          ))}

          <Button
            size="sm"
            variant="outline"
            onClick={handleAddItem}
            className="w-full border-dashed"
            leftIcon={<Plus className="h-4 w-4" />}
          >
            Add Another Entry
          </Button>
        </div>
      )}

      {/* Delete Section Confirm Dialog */}
      <ConfirmDialog
        isOpen={isDeleteSectionDialogOpen}
        onClose={() => setIsDeleteSectionDialogOpen(false)}
        onConfirm={handleConfirmDeleteSection}
        title={`Delete "${currentSection.title}"?`}
        message="Are you sure you want to remove this custom section? All entries inside it will be deleted from this resume."
        confirmText="Delete Section"
        confirmVariant="danger"
      />
    </div>
  );
};

export default CustomSectionForm;
