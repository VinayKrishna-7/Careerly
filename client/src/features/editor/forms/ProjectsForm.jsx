import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  addArrayItem,
  removeArrayItem,
  updateArrayItem,
  reorderArrayItem,
  setActiveResumeSettings
} from '../../../store/slices/resumeSlice.js';
import Button from '../../../components/ui/Button.jsx';
import Input from '../../../components/ui/Input.jsx';
import Textarea from '../../../components/ui/Textarea.jsx';
import SectionHeader from './SectionHeader.jsx';
import { Plus, Trash2, ArrowUp, ArrowDown, FolderGit2, Link2, ExternalLink } from 'lucide-react';

export const ProjectsForm = () => {
  const dispatch = useDispatch();
  const activeResume = useSelector((state) => state.resume.activeResume) || {};
  const projects = activeResume.projects || [];
  const settings = activeResume.settings || {};
  const projectLinkStyle = settings.projectLinkStyle || 'name'; // 'name' | 'url'

  const handleAdd = () => {
    dispatch(
      addArrayItem({
        section: 'projects',
        item: {
          title: 'New Project',
          role: 'Lead Developer',
          liveUrl: 'https://example.com',
          githubUrl: 'https://github.com/username/project',
          startDate: '2023-01',
          endDate: '2023-04',
          description: '• Developed full-stack web application.\n• Built responsive UI and secure REST APIs.\n• Optimized database performance.',
          technologies: ['React', 'Node.js', 'PostgreSQL']
        }
      })
    );
  };

  const handleRemove = (index) => {
    dispatch(removeArrayItem({ section: 'projects', index }));
  };

  const handleUpdate = (index, field, value) => {
    dispatch(
      updateArrayItem({
        section: 'projects',
        index,
        item: { [field]: value }
      })
    );
  };

  const handleTechChange = (index, commaSeparated) => {
    const list = commaSeparated
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);
    handleUpdate(index, 'technologies', list);
  };

  const handleMove = (fromIndex, toIndex) => {
    if (toIndex < 0 || toIndex >= projects.length) return;
    dispatch(reorderArrayItem({ section: 'projects', fromIndex, toIndex }));
  };

  const handleLinkStyleChange = (style) => {
    dispatch(setActiveResumeSettings({ projectLinkStyle: style }));
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        sectionKey="projects"
        description="Showcase your key projects. Descriptions are automatically formatted into clean bullet points."
      >
        <Button size="xs" variant="outline" onClick={handleAdd} leftIcon={<Plus className="h-3.5 w-3.5" />}>
          Add Project
        </Button>
      </SectionHeader>

      {/* Global Project URL Display Mode Switcher */}
      <div className="p-3.5 bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-xl space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
            <Link2 className="h-3.5 w-3.5 text-brand-600 dark:text-brand-400" />
            <span>Project Links Display Format in Resume</span>
          </label>
        </div>
        <p className="text-[11px] text-slate-500 dark:text-slate-400">
          Choose whether project URLs in the resume display by link name or clean web address. Links are completely optional.
        </p>
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            type="button"
            onClick={() => handleLinkStyleChange('name')}
            className={`p-2 rounded-lg border text-left text-xs transition-all flex items-center justify-between ${
              projectLinkStyle === 'name'
                ? 'border-brand-600 dark:border-brand-500 bg-brand-50/70 dark:bg-brand-950/40 text-brand-900 dark:text-brand-200 font-bold'
                : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
            }`}
          >
            <span>By Link Name (e.g. Live Demo ↗, GitHub ↗)</span>
            <ExternalLink className="h-3 w-3 opacity-60" />
          </button>
          <button
            type="button"
            onClick={() => handleLinkStyleChange('url')}
            className={`p-2 rounded-lg border text-left text-xs transition-all flex items-center justify-between ${
              projectLinkStyle === 'url'
                ? 'border-brand-600 dark:border-brand-500 bg-brand-50/70 dark:bg-brand-950/40 text-brand-900 dark:text-brand-200 font-bold'
                : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
            }`}
          >
            <span>By URL (e.g. github.com/user/repo ↗)</span>
            <ExternalLink className="h-3 w-3 opacity-60" />
          </button>
        </div>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-8 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl space-y-2">
          <FolderGit2 className="h-8 w-8 text-slate-300 dark:text-slate-600 mx-auto" />
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">No projects added yet</p>
          <Button size="xs" onClick={handleAdd} leftIcon={<Plus className="h-3.5 w-3.5" />}>
            Add Project
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {projects.map((proj, index) => (
            <div
              key={index}
              className="p-4 bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-xl space-y-3 relative"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  #{index + 1} {proj.title || 'Untitled Project'}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    disabled={index === 0}
                    onClick={() => handleMove(index, index - 1)}
                    className="p-1 rounded text-slate-400 hover:text-slate-600 disabled:opacity-30"
                    title="Move up"
                  >
                    <ArrowUp className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    disabled={index === projects.length - 1}
                    onClick={() => handleMove(index, index + 1)}
                    className="p-1 rounded text-slate-400 hover:text-slate-600 disabled:opacity-30"
                    title="Move down"
                  >
                    <ArrowDown className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemove(index)}
                    className="p-1 rounded text-rose-500 hover:bg-rose-50 hover:text-rose-700"
                    title="Delete project"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  label="Project Title"
                  placeholder="e.g. Real-Time Chat App"
                  value={proj.title || ''}
                  onChange={(e) => handleUpdate(index, 'title', e.target.value)}
                />
                <Input
                  label="Your Role / Subtitle"
                  placeholder="e.g. Lead Architect, Creator"
                  value={proj.role || ''}
                  onChange={(e) => handleUpdate(index, 'role', e.target.value)}
                />
                <Input
                  label="Live Demo URL (Optional)"
                  placeholder="e.g. https://myproject.com"
                  value={proj.liveUrl || ''}
                  onChange={(e) => handleUpdate(index, 'liveUrl', e.target.value)}
                />
                <Input
                  label="GitHub / Source Code URL (Optional)"
                  placeholder="e.g. https://github.com/username/project"
                  value={proj.githubUrl || ''}
                  onChange={(e) => handleUpdate(index, 'githubUrl', e.target.value)}
                />
                <Input
                  label="Technologies Used (Comma separated)"
                  placeholder="React, Node.js, Tailwind CSS"
                  value={proj.technologies?.join(', ') || ''}
                  onChange={(e) => handleTechChange(index, e.target.value)}
                />
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    label="Start Date"
                    type="month"
                    value={proj.startDate || ''}
                    onChange={(e) => handleUpdate(index, 'startDate', e.target.value)}
                  />
                  <Input
                    label="End Date"
                    type="month"
                    value={proj.endDate || ''}
                    onChange={(e) => handleUpdate(index, 'endDate', e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Textarea
                  label="Description & Highlights (Bulleted in Resume)"
                  placeholder="• Built scalable backend API handling 10k requests/min&#10;• Integrated Stripe payment gateway&#10;• Reduced latency by 35% with Redis cache"
                  rows={3}
                  value={proj.description || ''}
                  onChange={(e) => handleUpdate(index, 'description', e.target.value)}
                />
                <p className="text-[10.5px] text-slate-400 dark:text-slate-500 mt-1">
                  💡 Tip: Each line will automatically be formatted as a neat bullet point in your resume.
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectsForm;
