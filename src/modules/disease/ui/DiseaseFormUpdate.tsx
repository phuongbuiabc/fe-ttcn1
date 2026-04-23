'use client';

import React from 'react';
import { UpdateDiseaseRequest, DiseaseResponse } from '@/modules/disease/model/disease.model';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, data: UpdateDiseaseRequest) => void;
  disease: DiseaseResponse | null;
  formData: UpdateDiseaseRequest;
  setFormData: (data: UpdateDiseaseRequest) => void;
}

export const DiseaseFormUpdate: React.FC<Props> = ({
  isOpen,
  onClose,
  onSave,
  disease,
  formData,
  setFormData,
}) => {
  if (!isOpen || !disease) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white p-5 rounded-xl w-[420px] space-y-3">
        <h2 className="font-bold uppercase text-sm">Cập nhật bệnh</h2>

        <input
          value={formData.name || ''}
          onChange={(e) =>
            setFormData({ ...formData, name: e.target.value })
          }
          className="w-full border p-2 rounded"
        />

        <input
          value={formData.diseaseType || ''}
          onChange={(e) =>
            setFormData({ ...formData, diseaseType: e.target.value })
          }
          className="w-full border p-2 rounded"
        />

        <textarea
          value={formData.symptoms || ''}
          onChange={(e) =>
            setFormData({ ...formData, symptoms: e.target.value })
          }
          className="w-full border p-2 rounded"
        />

        <div className="flex justify-end gap-2">
          <button onClick={onClose}>Hủy</button>

          <button
            onClick={() => onSave(disease.id, formData)}
            className="bg-blue-600 text-white px-3 py-1 rounded"
          >
            Cập nhật
          </button>
        </div>
      </div>
    </div>
  );
};