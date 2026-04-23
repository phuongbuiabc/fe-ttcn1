'use client';

import React from 'react';
import { CreateDiseaseRequest } from '@/modules/disease/model/disease.model';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CreateDiseaseRequest) => void;
  formData: CreateDiseaseRequest;
  setFormData: (data: CreateDiseaseRequest) => void;
  loading?: boolean;
}

export const DiseaseFormCreate: React.FC<Props> = ({
  isOpen,
  onClose,
  onSave,
  formData,
  setFormData,
  loading,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white p-5 rounded-xl w-[420px] space-y-3">
        <h2 className="font-bold uppercase text-sm">Thêm bệnh</h2>

        <input
          placeholder="Tên bệnh"
          className="w-full border p-2 rounded"
          value={formData.name}
          onChange={(e) =>
            setFormData({ ...formData, name: e.target.value })
          }
        />

        <input
          placeholder="Loại bệnh"
          className="w-full border p-2 rounded"
          value={formData.diseaseType}
          onChange={(e) =>
            setFormData({ ...formData, diseaseType: e.target.value })
          }
        />

        <textarea
          placeholder="Triệu chứng"
          className="w-full border p-2 rounded"
          value={formData.symptoms}
          onChange={(e) =>
            setFormData({ ...formData, symptoms: e.target.value })
          }
        />

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-3 py-1 text-sm">
            Hủy
          </button>

          <button
            disabled={loading}
            onClick={() => onSave(formData)}
            className="px-3 py-1 bg-emerald-600 text-white rounded text-sm"
          >
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
};