import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateActiveResumeField } from '../../../store/slices/resumeSlice.js';
import Textarea from '../../../components/ui/Textarea.jsx';
import SectionHeader from './SectionHeader.jsx';
import { Sparkles } from 'lucide-react';

const SUGGESTIONS = [
  'Results-driven Senior Engineer with 6+ years of experience architecting high-scale web platforms and leading engineering teams to deliver resilient cloud solutions.',
  'Versatile Full Stack Developer specialized in React, Node.js, and modern TypeScript ecosystems with a proven history of optimizing application performance.',
  'Dedicated Product-Minded Software Engineer experienced in building intuitive user experiences, scalable REST APIs, and automated CI/CD deployment pipelines.'
];

export const SummaryForm = () => {
  const dispatch = useDispatch();
  const summary = useSelector((state) => state.resume.activeResume?.summary) || '';

  const handleChange = (value) => {
    dispatch(updateActiveResumeField({ path: 'summary', value }));
  };

  return (
    <div className="space-y-4">
      <SectionHeader
        sectionKey="summary"
        description="A concise 2–4 sentence overview highlighting your top achievements, skills, and value."
      />

      <Textarea
        placeholder="Write a brief overview of your background and professional highlights..."
        rows={6}
        value={summary}
        onChange={(e) => handleChange(e.target.value)}
      />

      {/* Suggestion Starters */}
      <div className="space-y-2 pt-2">
        <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5 text-brand-500" />
          <span>Quick Inspiration Starters (Click to apply)</span>
        </p>
        <div className="space-y-1.5">
          {SUGGESTIONS.map((text, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleChange(text)}
              className="w-full text-left p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-[11px] text-slate-600 dark:text-slate-300 hover:bg-brand-50 dark:hover:bg-brand-950/40 hover:border-brand-300 dark:hover:border-brand-600 hover:text-brand-900 dark:hover:text-brand-300 transition-colors leading-relaxed"
            >
              "{text}"
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SummaryForm;
