'use client';

import React from 'react';
import { X } from 'lucide-react';
import { CreateBreedRequest } from '../model/breed.model';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CreateBreedRequest) => void;
  formData: CreateBreedRequest;
  setFormData: (data: CreateBreedRequest) => void;
  loading?: boolean;
}

export const BreedFormModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSave,
  formData,
  setFormData,
  loading,
}) => {
  if (!isOpen) return null;

  const handleChange = (field: keyof CreateBreedRequest, value: string) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-[420px] shadow-xl">

        {/* HEADER */}
        <div className="flex justify-between items-center px-5 py-4 border-b">
          <h2 className="text-sm font-extrabold uppercase">
            Thêm giống
          </h2>

          <button onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        {/* BODY */}
        <div className="p-5 space-y-4">

          <div>
            <label className="text-xs font-bold text-slate-600">
              Tên giống
            </label>
            <input
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="mt-1 w-full px-3 py-2 border rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
              placeholder="VD: Landrace"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-600">
              Đặc điểm
            </label>
            <textarea
              value={formData.characteristics}
              onChange={(e) => handleChange('characteristics', e.target.value)}
              className="mt-1 w-full px-3 py-2 border rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
              placeholder="VD: Tăng trưởng nhanh..."
            />
          </div>

        </div>

        {/* FOOTER */}
        <div className="flex justify-end gap-2 px-5 py-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs bg-slate-100 rounded-xl"
          >
            Huỷ
          </button>

          <button
            onClick={() => onSave(formData)}
            disabled={loading || !formData.name}
            className="px-5 py-2 text-xs bg-emerald-600 text-white rounded-xl disabled:opacity-50"
          >
            {loading ? 'Đang lưu...' : 'Lưu'}
          </button>
        </div>
      </div>
    </div>
  );
};