'use client';

import React, { useState } from 'react';
import { CreateGrowthTrackingRequest } from '@/modules/pig/model/piggrowth.model';

interface Props {
  pigId: string;
  onSubmit: (data: CreateGrowthTrackingRequest) => void;
  loading?: boolean;
}

export function GrowthForm({ pigId, onSubmit, loading }: Props) {
  const [form, setForm] = useState({
    pigId,
    trackingDate: '',
    weight: 0,
    litterLength: 0,
    chestGirth: 0,
    note: '',
  });

  const handleChange = (k: string, v: string | number) => {
    setForm(prev => ({ ...prev, [k]: v }));
  };

  const handleSubmit = () => {
    onSubmit(form);
  };

  return (
    <div className="space-y-3 p-4">

      <input
        type="date"
        value={form.trackingDate}
        onChange={e => handleChange('trackingDate', e.target.value)}
        className="w-full border p-2 rounded"
      />

      <input
        type="number"
        placeholder="Cân nặng (kg)"
        onChange={e => handleChange('weight', Number(e.target.value))}
        className="w-full border p-2 rounded"
      />

      <input
        type="number"
        placeholder="Dài lưng (cm)"
        onChange={e => handleChange('litterLength', Number(e.target.value))}
        className="w-full border p-2 rounded"
      />

      <input
        type="number"
        placeholder="Vòng ngực (cm)"
        onChange={e => handleChange('chestGirth', Number(e.target.value))}
        className="w-full border p-2 rounded"
      />

      <textarea
        placeholder="Ghi chú"
        onChange={e => handleChange('note', e.target.value)}
        className="w-full border p-2 rounded"
      />

      <button
        onClick={handleSubmit}
        className="w-full bg-emerald-600 text-white py-2 rounded"
      >
        {loading ? 'Đang lưu...' : 'Lưu'}
      </button>
    </div>
  );
}