import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addArrayItem, removeArrayItem, updateArrayItem } from '../../../store/slices/resumeSlice.js';
import Button from '../../../components/ui/Button.jsx';
import Input from '../../../components/ui/Input.jsx';
import Textarea from '../../../components/ui/Textarea.jsx';
import SectionHeader from './SectionHeader.jsx';
import { Plus, Trash2, Trophy } from 'lucide-react';

export const AchievementsForm = () => {
  const dispatch = useDispatch();
  const achievements = useSelector((state) => state.resume.activeResume?.achievements) || [];

  const handleAdd = () => {
    dispatch(
      addArrayItem({
        section: 'achievements',
        item: {
          title: '1st Place Hackathon Winner',
          date: '2023-10',
          issuer: 'TechCrunch Disrupt',
          description: 'Built decentralized application among 450+ international teams.'
        }
      })
    );
  };

  const handleRemove = (index) => {
    dispatch(removeArrayItem({ section: 'achievements', index }));
  };

  const handleUpdate = (index, field, value) => {
    dispatch(
      updateArrayItem({
        section: 'achievements',
        index,
        item: { [field]: value }
      })
    );
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        sectionKey="achievements"
        description="Honors, scholarships, hackathons, and special recognition"
      >
        <Button size="xs" variant="outline" onClick={handleAdd} leftIcon={<Plus className="h-3.5 w-3.5" />}>
          Add Achievement
        </Button>
      </SectionHeader>

      {achievements.length === 0 ? (
        <div className="text-center py-8 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl space-y-2">
          <Trophy className="h-8 w-8 text-slate-300 dark:text-slate-600 mx-auto" />
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">No achievements added yet</p>
          <Button size="xs" onClick={handleAdd} leftIcon={<Plus className="h-3.5 w-3.5" />}>
            Add First Achievement
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {achievements.map((a, index) => (
            <div key={index} className="p-4 bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-xl space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">#{index + 1} {a.title || 'Achievement'}</span>
                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  className="p-1 text-rose-500 hover:text-rose-700"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  label="Title / Award Name"
                  placeholder="e.g. Employee of the Year"
                  value={a.title || ''}
                  onChange={(e) => handleUpdate(index, 'title', e.target.value)}
                />
                <Input
                  label="Issuing Organization"
                  placeholder="e.g. Forbes / TechCrunch"
                  value={a.issuer || ''}
                  onChange={(e) => handleUpdate(index, 'issuer', e.target.value)}
                />
                <Input
                  label="Date"
                  type="month"
                  value={a.date || ''}
                  onChange={(e) => handleUpdate(index, 'date', e.target.value)}
                />
              </div>

              <Textarea
                label="Brief Description (Optional)"
                placeholder="Details on the impact or scope..."
                rows={2}
                value={a.description || ''}
                onChange={(e) => handleUpdate(index, 'description', e.target.value)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AchievementsForm;
