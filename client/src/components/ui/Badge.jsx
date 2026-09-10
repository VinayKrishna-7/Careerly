import React from 'react';
import { cn } from '../../utils/cn.js';

const variants = {
  default: 'bg-slate-100 text-slate-800 border-slate-200',
  brand: 'bg-brand-50 text-brand-700 border-brand-200',
  success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  warning: 'bg-amber-50 text-amber-700 border-amber-200',
  danger: 'bg-rose-50 text-rose-700 border-rose-200',
  purple: 'bg-purple-50 text-purple-700 border-purple-200'
};

export const Badge = ({ children, variant = 'default', size = 'sm', className = '', ...props }) => {
  const sizeClasses = size === 'xs' ? 'px-1.5 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={cn(
        'inline-flex items-center font-semibold rounded-full border',
        variants[variant] || variants.default,
        sizeClasses,
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;
