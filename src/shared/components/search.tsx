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
        className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400"
      />

      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="pl-7 pr-3 py-1.5 bg-gray-50 rounded text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 w-full"
      />
    </div>
  );
}