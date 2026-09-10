import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../utils/cn.js';

export const Spinner = ({ size = 'md', className = '', message = '' }) => {
  const sizeMap = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-10 h-10'
  };

  return (
    <div className={cn('flex flex-col items-center justify-center p-4 gap-3', className)}>
      <Loader2 className={cn('animate-spin text-brand-600', sizeMap[size] || sizeMap.md)} />
      {message && <p className="text-xs text-slate-500 font-medium">{message}</p>}
    </div>
  );
};

export default Spinner;
