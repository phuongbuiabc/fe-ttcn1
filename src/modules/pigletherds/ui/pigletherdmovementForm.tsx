'use client';

import React, { useState } from 'react';
import {
  CreatePigletHerdMovementRequest,
} from '../model/pigletherdmovement.model';
import {
  PigletHerdMovementType,
} from '@/shared/enums/pigletherd.enum';
import { MOVEMENT_TYPE_OPTIONS } from '../utils/pigletherdmovement.mapper';

interface Props {
  herdId: string;
  onSubmit: (data: CreatePigletHerdMovementRequest) => void;
  loading?: boolean;
}

export function PigletHerdMovementForm({ herdId, onSubmit, loading }: Props) {
  const [form, setForm] = useState<CreatePigletHerdMovementRequest>({
    herdId,
    movementType: '',
    sourceHerdId: '',
    targetHerdId: '',
    movementDate: '',
    quantity: 0,
    reason: '',
  });

  const handleChange = (key: string, value: any) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    let payload = { ...form };

    // 👉 business logic mapping
    if (form.movementType === PigletHerdMovementType.INCREASE) {
      payload.sourceHerdId = undefined;
      payload.targetHerdId = form.herdId;
    }

    if (form.movementType === PigletHerdMovementType.DECREASE) {
      payload.sourceHerdId = form.herdId;
      payload.targetHerdId = undefined;
    }

    onSubmit(payload);
  };

  return (
    <div className="space-y-4 p-4">

      {/* Movement Type */}
      <div className="space-y-1">
        <label className="text-xs font-semibold text-gray-600">
          Loại điều chuyển
        </label>
        <select
          value={form.movementType || ''}
          onChange={(e) => handleChange('movementType', e.target.value)}
          className="w-full border px-3 py-2 rounded"
        >
          <option value="">-- Chọn loại --</option>

          {Object.entries(MOVEMENT_TYPE_OPTIONS).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {/* Movement Date */}
      <div className="space-y-1">
        <label className="text-xs font-semibold text-gray-600">
          Ngày điều chuyển
        </label>
        <input
          type="date"
          value={form.movementDate}
          onChange={(e) => handleChange('movementDate', e.target.value)}
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      {/* Quantity */}
      <div className="space-y-1">
        <label className="text-xs font-semibold text-gray-600">
          Số lượng
        </label>
        <input
          type="number"
          value={form.quantity}
          onChange={(e) => handleChange('quantity', Number(e.target.value))}
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      {/* Source Herd */}
      <div className="space-y-1">
        <label className="text-xs font-semibold text-gray-600">
          Herd nguồn
        </label>
        <input
          value={form.sourceHerdId || ''}
          onChange={(e) => handleChange('sourceHerdId', e.target.value)}
          className="w-full border px-3 py-2 rounded"
          placeholder="Nhập herd nguồn (nếu có)"
        />
      </div>

      {/* Target Herd */}
      <div className="space-y-1">
        <label className="text-xs font-semibold text-gray-600">
          Herd đích
        </label>
        <input
          value={form.targetHerdId || ''}
          onChange={(e) => handleChange('targetHerdId', e.target.value)}
          className="w-full border px-3 py-2 rounded"
          placeholder="Nhập herd đích (nếu có)"
        />
      </div>

      {/* Reason */}
      <div className="space-y-1">
        <label className="text-xs font-semibold text-gray-600">
          Lý do
        </label>
        <textarea
          value={form.reason || ''}
          onChange={(e) => handleChange('reason', e.target.value)}
          className="w-full border px-3 py-2 rounded"
          placeholder="Nhập lý do điều chuyển"
        />
      </div>

      {/* Submit */}
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