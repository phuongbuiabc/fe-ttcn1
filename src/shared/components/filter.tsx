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
      className={`px-3 py-1.5 border rounded text-sm bg-white ${className || ''}`}
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