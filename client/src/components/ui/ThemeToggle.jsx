import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from '../../store/slices/uiSlice.js';
import { Sun, Moon } from 'lucide-react';
import { cn } from '../../utils/cn.js';

export const ThemeToggle = ({ className = '', size = 'md' }) => {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.ui.theme);
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={() => dispatch(toggleTheme())}
      aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      className={cn(
        'relative inline-flex items-center justify-center rounded-xl p-2 transition-all duration-200',
        'border border-black/20 bg-white text-black hover:bg-black/10',
        'dark:border-[#faf5eb]/25 dark:bg-[#0c0c0e] dark:text-[#faf5eb] dark:hover:bg-white/10',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-[#faf5eb]',
        size === 'sm' ? 'h-8 w-8 p-1.5' : 'h-9 w-9 p-2',
        className
      )}
    >
      {isDark ? (
        <Sun className="h-4 w-4 text-[#faf5eb] animate-in spin-in-90 duration-200" />
      ) : (
        <Moon className="h-4 w-4 text-black animate-in spin-in-90 duration-200" />
      )}
    </button>
  );
};

export default ThemeToggle;
