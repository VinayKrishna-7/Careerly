import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addArrayItem, removeArrayItem, updateArrayItem } from '../../../store/slices/resumeSlice.js';
import Button from '../../../components/ui/Button.jsx';
import Input from '../../../components/ui/Input.jsx';
import SectionHeader from './SectionHeader.jsx';
import { Plus, Trash2, Award } from 'lucide-react';

export const CertificationsForm = () => {
  const dispatch = useDispatch();
  const certifications = useSelector((state) => state.resume.activeResume?.certifications) || [];

  const handleAdd = () => {
    dispatch(
      addArrayItem({
        section: 'certifications',
        item: {
          name: 'AWS Certified Solutions Architect',
          issuer: 'Amazon Web Services',
          issueDate: '2023-05',
          expiryDate: '',
          credentialId: '',
          credentialUrl: ''
        }
      })
    );
  };

  const handleRemove = (index) => {
    dispatch(removeArrayItem({ section: 'certifications', index }));
  };

  const handleUpdate = (index, field, value) => {
    dispatch(
      updateArrayItem({
        section: 'certifications',
        index,
        item: { [field]: value }
      })
    );
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        sectionKey="certifications"
        description="Add credentials, professional badges, and certifications"
      >
        <Button size="xs" variant="outline" onClick={handleAdd} leftIcon={<Plus className="h-3.5 w-3.5" />}>
          Add Certificate
        </Button>
      </SectionHeader>

      {certifications.length === 0 ? (
        <div className="text-center py-8 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl space-y-2">
          <Award className="h-8 w-8 text-slate-300 dark:text-slate-600 mx-auto" />
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">No certifications added yet</p>
          <Button size="xs" onClick={handleAdd} leftIcon={<Plus className="h-3.5 w-3.5" />}>
            Add First Certificate
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {certifications.map((c, index) => (
            <div key={index} className="p-4 bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-xl space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">#{index + 1} {c.name || 'Certificate'}</span>
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
                  label="Certificate Name"
                  placeholder="e.g. AWS Solutions Architect"
                  value={c.name || ''}
                  onChange={(e) => handleUpdate(index, 'name', e.target.value)}
                />
                <Input
                  label="Issuing Organization"
                  placeholder="e.g. Amazon Web Services"
                  value={c.issuer || ''}
                  onChange={(e) => handleUpdate(index, 'issuer', e.target.value)}
                />
                <Input
                  label="Issue Date"
                  type="month"
                  value={c.issueDate || ''}
                  onChange={(e) => handleUpdate(index, 'issueDate', e.target.value)}
                />
                <Input
                  label="Credential ID / URL (Optional)"
                  placeholder="e.g. AWS-12345"
                  value={c.credentialId || ''}
                  onChange={(e) => handleUpdate(index, 'credentialId', e.target.value)}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CertificationsForm;
