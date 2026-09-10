import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addArrayItem, removeArrayItem } from '../../../store/slices/resumeSlice.js';
import Button from '../../../components/ui/Button.jsx';
import Input from '../../../components/ui/Input.jsx';
import SectionHeader from './SectionHeader.jsx';
import { Plus, X, Heart } from 'lucide-react';

export const InterestsForm = () => {
  const dispatch = useDispatch();
  const interests = useSelector((state) => state.resume.activeResume?.interests) || [];

  const [name, setName] = useState('');
  const [keywords, setKeywords] = useState('');

  const handleAdd = () => {
    if (!name.trim()) return;
    const kwList = keywords
      .split(',')
      .map((k) => k.trim())
      .filter(Boolean);

    dispatch(
      addArrayItem({
        section: 'interests',
        item: { name: name.trim(), keywords: kwList }
      })
    );
    setName('');
    setKeywords('');
  };

  const handleRemove = (index) => {
    dispatch(removeArrayItem({ section: 'interests', index }));
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        sectionKey="interests"
        description="Hobbies, extracurricular activities, and community involvement"
      />

      <div className="p-4 bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-xl space-y-3">
        <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Add Interest</span>
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
          <div className="sm:col-span-5">
            <Input
              placeholder="e.g. Open Source, Cycling"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAdd())}
            />
          </div>
          <div className="sm:col-span-5">
            <Input
              placeholder="Keywords (e.g. GitHub Contributor, Trail Riding)"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAdd())}
            />
          </div>
          <div className="sm:col-span-2">
            <Button onClick={handleAdd} size="md" className="w-full" leftIcon={<Plus className="h-4 w-4" />}>
              Add
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Interests ({interests.length})</span>
        {interests.length === 0 ? (
          <div className="text-center py-6 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-400">
            No interests added yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {interests.map((it, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-3 text-xs shadow-subtle"
              >
                <div>
                  <span className="font-bold text-slate-900 dark:text-white">{it.name}</span>
                  {it.keywords?.length > 0 && (
                    <span className="text-slate-500 dark:text-slate-400 ml-1">({it.keywords.join(', ')})</span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  className="text-rose-400 hover:text-rose-600 p-1"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default InterestsForm;
