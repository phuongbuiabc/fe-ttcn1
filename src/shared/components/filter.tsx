'use client';

import React from 'react';

export interface SelectOption {
  label: string;
  value: string;
}

interface Props {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  className?: string;
}

export function BaseSelect({
  value,
  onChange,
  options,
  placeholder,
  className,
}: Props) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700 outline-none ring-1 ring-transparent transition focus:border-emerald-500 focus:ring-emerald-500/20 ${className || ''}`}
    >
      {placeholder && (
        <option value="">
          {placeholder}
        </option>
      )}

      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}