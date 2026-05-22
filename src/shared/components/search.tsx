'use client';

import React from 'react';
import { Search } from 'lucide-react';

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
    <div className={`relative ${className || ''}`}>
      <Search
        size={14}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
      />

      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl bg-slate-50 py-2 pl-9 pr-4 text-xs font-bold text-slate-700 outline-none ring-1 ring-transparent transition focus:ring-emerald-500/20"
      />
    </div>
  );
}