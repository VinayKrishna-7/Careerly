import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveResumeTemplate } from '../../store/slices/resumeSlice.js';
import { TEMPLATE_METADATA } from '../../utils/constants.js';
import Badge from '../../components/ui/Badge.jsx';
import { Check } from 'lucide-react';

export const TemplateSelector = () => {
  const dispatch = useDispatch();
  const activeTemplate = useSelector((state) => state.resume.activeResume?.template) || 'modern';

  const handleSelect = (templateId) => {
    dispatch(setActiveResumeTemplate(templateId));
  };

  return (
    <div className="space-y-6">
      <div className="pb-2 border-b border-slate-200 dark:border-slate-800">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">Choose Resume Layout</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Switching templates updates the live preview instantly with zero loss of your content.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {TEMPLATE_METADATA.map((tmpl) => {
          const isSelected = activeTemplate === tmpl.id;

          return (
            <div
              key={tmpl.id}
              onClick={() => handleSelect(tmpl.id)}
              className={`cursor-pointer rounded-2xl border p-4 transition-all duration-150 flex flex-col justify-between ${
                isSelected
                  ? 'border-brand-600 dark:border-brand-500 bg-brand-50/40 dark:bg-brand-950/40 ring-2 ring-brand-500/20 shadow-card'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-subtle'
              }`}
            >
              <div>
                {/* Normal Resume Template Image Preview */}
                <div className="relative w-full h-36 bg-slate-100 dark:bg-slate-950 rounded-xl mb-3 overflow-hidden border border-slate-200/80 dark:border-slate-800 flex items-center justify-center p-2">
                  <div className="h-full w-auto aspect-[380/490] bg-white rounded-xs shadow-sm overflow-hidden border border-slate-200/80">
                    <img
                      src={`/templates/${tmpl.id}.svg`}
                      alt={tmpl.name}
                      className="w-full h-full object-cover object-top select-none pointer-events-none"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = '/templates/modern.svg';
                      }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className="h-3.5 w-3.5 rounded-full inline-block"
                      style={{ backgroundColor: tmpl.previewColor }}
                    />
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">{tmpl.name}</h4>
                  </div>
                  <Badge variant={isSelected ? 'brand' : 'default'} size="xs">
                    {tmpl.badge}
                  </Badge>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">{tmpl.description}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className={`font-semibold ${isSelected ? 'text-brand-600 dark:text-brand-400' : 'text-slate-400 dark:text-slate-500'}`}>
                  {isSelected ? '✓ Selected Layout' : 'Click to Apply'}
                </span>
                {isSelected && (
                  <div className="h-5 w-5 rounded-full bg-brand-600 text-white flex items-center justify-center">
                    <Check className="h-3 w-3" />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TemplateSelector;
