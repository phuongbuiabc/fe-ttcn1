'use client';

import React, { useState, useEffect } from 'react';
import { CreateAreaRequest } from '@/modules/area/model/area.model';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateAreaRequest) => void;
  initialData?: CreateAreaRequest;
}

export function AreaCreateForm({ isOpen, onClose, onSubmit, initialData }: Props) {
  const [form, setForm] = useState<CreateAreaRequest>({
    name: '',
    description: '',
  });

  useEffect(() => {
    if (initialData) setForm(initialData);
  }, [initialData]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-[400px] space-y-4">

        <h2 className="text-lg font-bold">
          {initialData ? 'Cập nhật khu vực' : 'Thêm khu vực'}
        </h2>

        <input
          placeholder="Tên khu vực"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full border px-3 py-2 rounded"
        />

        <textarea
          placeholder="Mô tả"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full border px-3 py-2 rounded"
        />

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 text-sm">
            Huỷ
          </button>

          <button
            onClick={() => onSubmit(form)}
            className="px-4 py-2 bg-emerald-600 text-white rounded"
          >
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
}