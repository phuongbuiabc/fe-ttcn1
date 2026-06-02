'use client';

import React from 'react';
import { Search } from 'lucide-react';
import { cn } from '@/shared/utils/utils';

interface Props {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function BaseSearch({
  value,
  onChange,
  placeholder = 'Tìm kiếm...',
  className,
}: Props) {
  return (
    <div className={cn("relative w-full", className)}>
      <Search
        size={16}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
      />

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-11 pr-6 py-3.5 bg-[#f8fafc] border-none rounded-[1.25rem] text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-slate-900/5 transition-all placeholder:text-slate-400"
      />
    </div>
  );
}