'use client';

import React, { useState } from 'react';
import { CreatePigletHerdGrowthRequest } from '../model/pigletherdgrowth.model';

interface Props {
  herdId: string;
  onSubmit: (data: CreatePigletHerdGrowthRequest) => void;
  loading?: boolean;
}

export function PigletHerdGrowthForm({ herdId, onSubmit, loading }: Props) {
  const [form, setForm] = useState<CreatePigletHerdGrowthRequest>({
    herdId,
    trackingDate: '',
    averageWeight: 0,
    note: '',
  });

  const handleChange = (key: string, value: any) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    onSubmit(form);
  };

  return (
    <div className="space-y-4 p-4">

      <div className="space-y-1">
        <label className="text-xs font-semibold text-gray-500 uppercase">
          Ngày theo dõi
        </label>
        <input
          type="date"
          value={form.trackingDate}
          onChange={e => handleChange('trackingDate', e.target.value)}
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      <div className="space-y-1">
        <label className="text-xs font-semibold text-gray-500 uppercase">
          Cân nặng trung bình (kg)
        </label>
        <input
          type="number"
          value={form.averageWeight}
          onChange={e =>
            handleChange('averageWeight', Number(e.target.value))
          }
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      <div className="space-y-1">
        <label className="text-xs font-semibold text-gray-500 uppercase">
          Ghi chú
        </label>
        <textarea
          value={form.note || ''}
          onChange={e => handleChange('note', e.target.value)}
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full bg-emerald-600 text-white py-2 rounded"
      >
        {loading ? 'Đang lưu...' : 'Lưu'}
      </button>
    </div>
  );
}