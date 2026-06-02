'use client';

import React from 'react';
import { CustomSelect } from './ui/CustomSelect';

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
  // Prepend placeholder option if it exists, mapping to empty string value
  const combinedOptions = placeholder 
    ? [{ value: "", label: placeholder }, ...options]
    : options;

  return (
    <CustomSelect
      value={value}
      onChange={onChange}
      options={combinedOptions}
      placeholder={placeholder}
      className={className}
    />
  );
}