import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  addArrayItem,
  removeArrayItem,
  updateArrayItem,
  reorderArrayItem
} from '../../../store/slices/resumeSlice.js';
import Button from '../../../components/ui/Button.jsx';
import Input from '../../../components/ui/Input.jsx';
import Textarea from '../../../components/ui/Textarea.jsx';
import SectionHeader from './SectionHeader.jsx';
import { Plus, Trash2, ArrowUp, ArrowDown, Briefcase } from 'lucide-react';

export const ExperienceForm = () => {
  const dispatch = useDispatch();
  const experience = useSelector((state) => state.resume.activeResume?.experience) || [];

  const handleAdd = () => {
    dispatch(
      addArrayItem({
        section: 'experience',
        item: {
          company: 'New Company Inc.',
          position: 'Software Engineer',
          location: 'San Francisco, CA',
          startDate: '2022-01',
          endDate: '',
          current: true,
          description: '• Developed responsive web applications.\n• Collaborated with cross-functional teams.'
        }
      })
    );
  };

  const handleRemove = (index) => {
    dispatch(removeArrayItem({ section: 'experience', index }));
  };

  const handleUpdate = (index, field, value) => {
    dispatch(
      updateArrayItem({
        section: 'experience',
        index,
        item: { [field]: value }
      })
    );
  };

  const handleMove = (fromIndex, toIndex) => {
    if (toIndex < 0 || toIndex >= experience.length) return;
    dispatch(reorderArrayItem({ section: 'experience', fromIndex, toIndex }));
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        sectionKey="experience"
        description="Add your past jobs, internships, and work history"
      >
        <Button size="xs" variant="outline" onClick={handleAdd} leftIcon={<Plus className="h-3.5 w-3.5" />}>
          Add Position
        </Button>
      </SectionHeader>

      {experience.length === 0 ? (
        <div className="text-center py-8 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl space-y-2">
          <Briefcase className="h-8 w-8 text-slate-300 dark:text-slate-600 mx-auto" />
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">No experience entries added yet</p>
          <Button size="xs" onClick={handleAdd} leftIcon={<Plus className="h-3.5 w-3.5" />}>
            Add First Job
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {experience.map((exp, index) => (
            <div
              key={index}
              className="p-4 bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-xl space-y-3 relative group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  #{index + 1} {exp.position || 'Untitled Position'}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    disabled={index === 0}
                    onClick={() => handleMove(index, index - 1)}
                    className="p-1 rounded text-slate-400 hover:text-slate-600 disabled:opacity-30"
                    title="Move Up"
                  >
                    <ArrowUp className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    disabled={index === experience.length - 1}
                    onClick={() => handleMove(index, index + 1)}
                    className="p-1 rounded text-slate-400 hover:text-slate-600 disabled:opacity-30"
                    title="Move Down"
                  >
                    <ArrowDown className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemove(index)}
                    className="p-1 rounded text-rose-500 hover:bg-rose-50 hover:text-rose-700"
                    title="Remove Position"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  label="Job Title / Position"
                  placeholder="e.g. Senior Frontend Engineer"
                  value={exp.position || ''}
                  onChange={(e) => handleUpdate(index, 'position', e.target.value)}
                />
                <Input
                  label="Company Name"
                  placeholder="e.g. Google"
                  value={exp.company || ''}
                  onChange={(e) => handleUpdate(index, 'company', e.target.value)}
                />
                <Input
                  label="Location"
                  placeholder="e.g. New York, NY (or Remote)"
                  value={exp.location || ''}
                  onChange={(e) => handleUpdate(index, 'location', e.target.value)}
                />
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    label="Start Date"
                    type="month"
                    value={exp.startDate || ''}
                    onChange={(e) => handleUpdate(index, 'startDate', e.target.value)}
                  />
                  <div>
                    <Input
                      label="End Date"
                      type="month"
                      disabled={exp.current}
                      value={exp.endDate || ''}
                      onChange={(e) => handleUpdate(index, 'endDate', e.target.value)}
                    />
                    <label className="flex items-center gap-1.5 mt-1 text-[11px] text-slate-600 dark:text-slate-400 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={Boolean(exp.current)}
                        onChange={(e) => handleUpdate(index, 'current', e.target.checked)}
                        className="rounded text-brand-600 focus:ring-brand-500"
                      />
                      <span>I currently work here</span>
                    </label>
                  </div>
                </div>
              </div>

              <Textarea
                label="Responsibilities & Impact (Bullet points recommended)"
                placeholder="• Architected microservices...\n• Increased conversion rates by 25%..."
                rows={4}
                value={exp.description || ''}
                onChange={(e) => handleUpdate(index, 'description', e.target.value)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExperienceForm;
