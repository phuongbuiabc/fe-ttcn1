'use client';

import React, { useEffect, useState } from 'react';
import {
  CreatePigletHerdRequest,
  UpdatePigletHerdRequest,
} from '../model/pigletherd.model';

interface Props {
  initialData?: any;
  onSubmit: (data: CreatePigletHerdRequest | UpdatePigletHerdRequest) => void;
  loading?: boolean;
}

export function PigletHerdForm({ initialData, onSubmit, loading }: Props) {
  const [form, setForm] = useState<CreatePigletHerdRequest>({
    litterNumber: 0,
    motherId: '',
    fatherId: '',
    quantity: 0,
    genderNote: '',
    averageBirthWeight: 0,
    birthDate: '',
  });

  useEffect(() => {
    if (initialData) {
      setForm(initialData);
    }
  }, [initialData]);

  const handleChange = (key: string, value: any) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    onSubmit(form);
  };

  const Field = ({
    label,
    children,
  }: {
    label: string;
    children: React.ReactNode;
  }) => (
    <div className="space-y-1">
      <label className="text-xs font-semibold text-gray-500 uppercase">
        {label}
      </label>
      {children}
    </div>
  );

  return (
    <div className="space-y-4 p-4">

      <Field label="Số lứa">
        <input
          type="number"
          value={form.litterNumber}
          onChange={e => handleChange('litterNumber', Number(e.target.value))}
          className="w-full border px-3 py-2 rounded"
        />
      </Field>

      <Field label="Số lượng con">
        <input
          type="number"
          value={form.quantity}
          onChange={e => handleChange('quantity', Number(e.target.value))}
          className="w-full border px-3 py-2 rounded"
        />
      </Field>

      <Field label="Mã lợn mẹ">
        <input
          value={form.motherId || ''}
          onChange={e => handleChange('motherId', e.target.value)}
          className="w-full border px-3 py-2 rounded"
        />
      </Field>

      <Field label="Mã lợn bố">
        <input
          value={form.fatherId || ''}
          onChange={e => handleChange('fatherId', e.target.value)}
          className="w-full border px-3 py-2 rounded"
        />
      </Field>

      <Field label="Ghi chú giới tính">
        <input
          value={form.genderNote || ''}
          onChange={e => handleChange('genderNote', e.target.value)}
          className="w-full border px-3 py-2 rounded"
        />
      </Field>

      <Field label="Cân nặng trung bình (kg)">
        <input
          type="number"
          value={form.averageBirthWeight}
          onChange={e =>
            handleChange('averageBirthWeight', Number(e.target.value))
          }
          className="w-full border px-3 py-2 rounded"
        />
      </Field>

      <Field label="Ngày sinh">
        <input
          type="date"
          value={form.birthDate || ''}
          onChange={e => handleChange('birthDate', e.target.value)}
          className="w-full border px-3 py-2 rounded"
        />
      </Field>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full bg-emerald-600 text-white py-2 rounded font-semibold"
      >
        {loading ? 'Đang lưu...' : 'Lưu'}
      </button>
    </div>
  );
}