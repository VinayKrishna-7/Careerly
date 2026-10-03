import React from 'react';
import { cn } from '../../utils/cn.js';
import { Loader2 } from 'lucide-react';

const variants = {
  primary:
    'bg-black text-[#faf5eb] hover:bg-neutral-800 active:bg-neutral-900 shadow-sm focus-visible:ring-black dark:bg-[#faf5eb] dark:text-black dark:hover:bg-white dark:active:bg-[#ede6d8] dark:focus-visible:ring-[#faf5eb] font-bold transition-all',
  secondary:
    'bg-[#f3ecde] text-black hover:bg-[#e8dfce] active:bg-[#ded3be] shadow-sm dark:bg-[#1c1c1f] dark:text-[#faf5eb] dark:hover:bg-[#28282d] font-semibold transition-all',
  outline:
    'border border-black bg-transparent text-black hover:bg-black hover:text-[#faf5eb] active:bg-neutral-900 dark:border-[#faf5eb] dark:bg-transparent dark:text-[#faf5eb] dark:hover:bg-[#faf5eb] dark:hover:text-black font-semibold transition-all',
  ghost:
    'text-black hover:bg-black/10 active:bg-black/20 dark:text-[#faf5eb] dark:hover:bg-white/10 dark:active:bg-white/20 font-semibold transition-all',
  danger:
    'bg-rose-600 text-white hover:bg-rose-700 active:bg-rose-800 shadow-sm focus-visible:ring-rose-500',
  dangerOutline:
    'border border-rose-300 text-rose-600 bg-rose-50 hover:bg-rose-100 dark:border-rose-900/40 dark:bg-rose-950/30 dark:text-rose-400 dark:hover:bg-rose-950/60 focus-visible:ring-rose-400',
  subtle:
    'bg-black/10 text-black hover:bg-black/15 dark:bg-white/10 dark:text-[#faf5eb] dark:hover:bg-white/20 font-semibold transition-all'
};

const sizes = {
  xs: 'px-2 py-1 text-xs rounded',
  sm: 'px-3 py-1.5 text-xs font-medium rounded-md gap-1.5',
  md: 'px-4 py-2 text-sm font-medium rounded-lg gap-2',
  lg: 'px-5 py-2.5 text-base font-medium rounded-lg gap-2.5',
  icon: 'p-2 rounded-lg'
};

export const Button = React.forwardRef(
  (
    {
      children,
      className = '',
      variant = 'primary',
      size = 'md',
      isLoading = false,
      disabled = false,
      leftIcon,
      rightIcon,
      type = 'button',
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        className={cn(
          'inline-flex items-center justify-center font-medium transition-all duration-150',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none select-none',
          variants[variant] || variants.primary,
          sizes[size] || sizes.md,
          className
        )}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin text-current shrink-0" />
        ) : (
          leftIcon && <span className="shrink-0">{leftIcon}</span>
        )}
        {children}
        {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
export default Button;
