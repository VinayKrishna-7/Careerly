import React from 'react';
import { cn } from '../../utils/cn.js';

const variants = {
  default: 'bg-[#faf5eb] text-black border-black/15 dark:bg-[#1a1a1d] dark:text-[#faf5eb] dark:border-[#2e2e33]',
  brand: 'bg-black text-[#faf5eb] border-black dark:bg-[#faf5eb] dark:text-black dark:border-[#faf5eb]',
  success: 'bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800/60',
  warning: 'bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800/60',
  danger: 'bg-rose-50 text-rose-800 border-rose-300 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800/60',
  purple: 'bg-[#faf5eb] text-black border-black/15 dark:bg-[#1a1a1d] dark:text-[#faf5eb] dark:border-[#2e2e33]'
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
