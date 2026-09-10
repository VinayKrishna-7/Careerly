import React from 'react';
import { cn } from '../../utils/cn.js';
import { ChevronDown } from 'lucide-react';

export const Select = React.forwardRef(
  (
    {
      label,
      error,
      helperText,
      options = [],
      className = '',
      wrapperClassName = '',
      id,
      required = false,
      children,
      ...props
    },
    ref
  ) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className={cn('w-full space-y-1.5', wrapperClassName)}>
        {label && (
          <label
            htmlFor={selectId}
            className="block text-xs font-semibold text-slate-700 dark:text-slate-300 tracking-wide"
          >
            {label}
            {required && <span className="text-rose-500 ml-0.5">*</span>}
          </label>
        )}
        <div className="relative rounded-lg shadow-subtle">
          <select
            ref={ref}
            id={selectId}
            className={cn(
              'w-full appearance-none rounded-lg border bg-white px-3.5 py-2 pr-10 text-sm text-slate-900',
              'dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700',
              'transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-0',
              error
                ? 'border-rose-300 dark:border-rose-700 focus:border-rose-500 focus:ring-rose-200 text-rose-900 dark:text-rose-200'
                : 'border-slate-300 hover:border-slate-400 dark:hover:border-slate-600 focus:border-brand-600 focus:ring-brand-100 dark:focus:ring-brand-900/40',
              className
            )}
            {...props}
          >
            {options.map((opt) => (
              <option key={opt.value ?? opt.id ?? opt} value={opt.value ?? opt.id ?? opt} className="dark:bg-slate-800">
                {opt.label ?? opt.name ?? opt}
              </option>
            ))}
            {children}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400 dark:text-slate-500">
            <ChevronDown className="h-4 w-4" />
          </div>
        </div>
        {error && <p className="text-xs text-rose-600 dark:text-rose-400 font-medium">{error}</p>}
        {helperText && !error && <p className="text-xs text-slate-500 dark:text-slate-400">{helperText}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';
export default Select;
