'use client';

import React, { useEffect, useState } from 'react';
import { CreateDiseaseHistoryRequest } from '@/modules/diseasehistory/model/diseasehistory.model';
import { PigResponse } from '@/modules/pig/model/pig.model';
import { DiseaseResponse } from '@/modules/disease/model/disease.model';
import { DiseaseHistoryStatus } from '@/shared/enums/diseasehistory.enum';

interface Props {
  open: boolean;
  onClose: () => void;
  pigs: PigResponse[];
  diseases: DiseaseResponse[];
  onSave: (data: CreateDiseaseHistoryRequest) => Promise<any>;
}

export function DiseaseHistoryCreateForm({
  open,
  onClose,
  pigs,
  diseases,
  onSave,
}: Props) {
  const [form, setForm] = useState<CreateDiseaseHistoryRequest>({
    pigId: '',
    diseaseName: '',
    sickDate: '',
    recoveryDate: '',
    severity: '',
    expectedTreatmentDays: undefined,
    status: DiseaseHistoryStatus.FOLLOWING,
    note: '',
  });

  // RESET FORM WHEN OPEN
  useEffect(() => {
    if (open) {
      setForm({
        pigId: '',
        diseaseName: '',
        sickDate: '',
        recoveryDate: '',
        severity: '',
        expectedTreatmentDays: undefined,
        status: DiseaseHistoryStatus.FOLLOWING,
        note: '',
      });
    }
  }, [open]);

  const handleChange = (key: keyof CreateDiseaseHistoryRequest, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    await onSave({
      ...form,
      status: DiseaseHistoryStatus.FOLLOWING, // FORCE DEFAULT
    });

    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-[520px] rounded-2xl p-5 space-y-3">

        <h2 className="text-lg font-bold">Ghi nhận bệnh</h2>

        {/* PIG */}
        <div>
          <label className="text-xs font-semibold">Số tai</label>
          <select
            value={form.pigId}
            onChange={(e) => handleChange('pigId', e.target.value)}
            className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-50"
          >
            <option value="">Chọn số tai</option>
            {pigs.map((p) => (
              <option key={p.id} value={p.id}>
                {p.earTag}
              </option>
            ))}
          </select>
        </div>

        {/* DISEASE */}
        <div>
          <label className="text-xs font-semibold">Bệnh</label>
          <select
            value={form.diseaseName}
            onChange={(e) => handleChange('diseaseName', e.target.value)}
            className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-50"
          >
            <option value="">Chọn bệnh</option>
            {diseases.map((d) => (
              <option key={d.id} value={d.name}>
                {d.name}
              </option>
            ))}
          </select>
        </div>

        {/* DATE */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs font-semibold">Ngày mắc</label>
            <input
              type="date"
              value={form.sickDate}
              onChange={(e) => handleChange('sickDate', e.target.value)}
              className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-50"
            />
          </div>

          <div>
            <label className="text-xs font-semibold">Ngày khỏi</label>
            <input
              type="date"
              value={form.recoveryDate}
              onChange={(e) => handleChange('recoveryDate', e.target.value)}
              className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-50"
            />
          </div>
        </div>

        {/* SEVERITY */}
        <div>
          <label className="text-xs font-semibold">Mức độ</label>
          <input
            value={form.severity || ''}
            onChange={(e) => handleChange('severity', e.target.value)}
            className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-50"
          />
        </div>

        {/* NOTE */}
        <div>
          <label className="text-xs font-semibold">Ghi chú</label>
          <textarea
            value={form.note || ''}
            onChange={(e) => handleChange('note', e.target.value)}
            className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-50"
          />
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-2 pt-2">
          <button onClick={onClose} className="px-4 py-2 text-sm">
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm"
          >
            Lưu
          </button>
        </div>

      </div>
    </div>
  );
}