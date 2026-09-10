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
import { Plus, Trash2, ArrowUp, ArrowDown, GraduationCap } from 'lucide-react';

export const EducationForm = () => {
  const dispatch = useDispatch();
  const education = useSelector((state) => state.resume.activeResume?.education) || [];

  const handleAdd = () => {
    dispatch(
      addArrayItem({
        section: 'education',
        item: {
          institution: 'University Name',
          degree: 'Bachelor of Science',
          fieldOfStudy: 'Computer Science',
          startDate: '2018-09',
          endDate: '2022-05',
          current: false,
          gpa: '3.8 / 4.0',
          description: 'Dean’s List, Honors Graduate.'
        }
      })
    );
  };

  const handleRemove = (index) => {
    dispatch(removeArrayItem({ section: 'education', index }));
  };

  const handleUpdate = (index, field, value) => {
    dispatch(
      updateArrayItem({
        section: 'education',
        index,
        item: { [field]: value }
      })
    );
  };

  const handleMove = (fromIndex, toIndex) => {
    if (toIndex < 0 || toIndex >= education.length) return;
    dispatch(reorderArrayItem({ section: 'education', fromIndex, toIndex }));
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        sectionKey="education"
        description="Add your degrees, universities, and certifications"
      >
        <Button size="xs" variant="outline" onClick={handleAdd} leftIcon={<Plus className="h-3.5 w-3.5" />}>
          Add Degree
        </Button>
      </SectionHeader>

      {education.length === 0 ? (
        <div className="text-center py-8 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl space-y-2">
          <GraduationCap className="h-8 w-8 text-slate-300 dark:text-slate-600 mx-auto" />
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">No education entries added yet</p>
          <Button size="xs" onClick={handleAdd} leftIcon={<Plus className="h-3.5 w-3.5" />}>
            Add Education
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {education.map((edu, index) => (
            <div
              key={index}
              className="p-4 bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-xl space-y-3 relative"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  #{index + 1} {edu.degree || 'Degree'} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ''}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    disabled={index === 0}
                    onClick={() => handleMove(index, index - 1)}
                    className="p-1 rounded text-slate-400 hover:text-slate-600 disabled:opacity-30"
                  >
                    <ArrowUp className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    disabled={index === education.length - 1}
                    onClick={() => handleMove(index, index + 1)}
                    className="p-1 rounded text-slate-400 hover:text-slate-600 disabled:opacity-30"
                  >
                    <ArrowDown className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemove(index)}
                    className="p-1 rounded text-rose-500 hover:bg-rose-50 hover:text-rose-700"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  label="Institution / University"
                  placeholder="e.g. Stanford University"
                  value={edu.institution || ''}
                  onChange={(e) => handleUpdate(index, 'institution', e.target.value)}
                />
                <Input
                  label="Degree"
                  placeholder="e.g. Bachelor of Science"
                  value={edu.degree || ''}
                  onChange={(e) => handleUpdate(index, 'degree', e.target.value)}
                />
                <Input
                  label="Field of Study / Major"
                  placeholder="e.g. Computer Science"
                  value={edu.fieldOfStudy || ''}
                  onChange={(e) => handleUpdate(index, 'fieldOfStudy', e.target.value)}
                />
                <Input
                  label="GPA / Grade (Optional)"
                  placeholder="e.g. 3.9 / 4.0"
                  value={edu.gpa || ''}
                  onChange={(e) => handleUpdate(index, 'gpa', e.target.value)}
                />
                <Input
                  label="Start Date"
                  type="month"
                  value={edu.startDate || ''}
                  onChange={(e) => handleUpdate(index, 'startDate', e.target.value)}
                />
                <Input
                  label="Graduation / End Date"
                  type="month"
                  value={edu.endDate || ''}
                  onChange={(e) => handleUpdate(index, 'endDate', e.target.value)}
                />
              </div>

              <Textarea
                label="Honors / Coursework (Optional)"
                placeholder="Dean's Honor List, Relevant coursework: Data Structures, Distributed Systems..."
                rows={2}
                value={edu.description || ''}
                onChange={(e) => handleUpdate(index, 'description', e.target.value)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EducationForm;
