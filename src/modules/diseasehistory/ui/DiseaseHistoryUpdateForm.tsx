'use client';

import React, { useEffect, useState } from 'react';
import { UpdateDiseaseHistoryRequest, DiseaseHistoryResponse } from '../model/diseasehistory.model';
import { DiseaseResponse } from '@/modules/disease/model/disease.model';
import { PigResponse } from '@/modules/pig/model/pig.model';

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (id: string, data: UpdateDiseaseHistoryRequest) => void;
  diseases: DiseaseResponse[];
  pigs: PigResponse[];
  history: DiseaseHistoryResponse | null;
}

export function DiseaseHistoryUpdateForm({
  open,
  onClose,
  onSave,
  diseases = [],
  pigs = [],
  history,
}: Props) {
  const [form, setForm] = useState<UpdateDiseaseHistoryRequest>({});

  useEffect(() => {
    if (history) {
      setForm({
        pigId: history.pigId,
        diseaseName: history.diseaseName,
        sickDate: history.sickDate,
        recoveryDate: history.recoveryDate,
        severity: history.severity,
        expectedTreatmentDays: history.expectedTreatmentDays,
        status: history.status,
        note: history.note,
      });
    }
  }, [history]);

  const handleChange = (key: keyof UpdateDiseaseHistoryRequest, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  if (!open || !history) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-[540px] p-5 rounded-2xl space-y-3">

        <h2 className="font-bold text-lg">Cập nhật lịch sử bệnh</h2>

        {/* PIG SELECT */}
        <label className="text-xs font-bold text-slate-600">Số tai heo</label>
        <select
          className="w-full px-3 py-2 bg-slate-50 rounded-xl text-sm"
          value={form.pigId || ''}
          onChange={(e) => handleChange('pigId', e.target.value)}
        >
          {pigs.map((p) => (
            <option key={p.id} value={p.id}>
              {p.earTag}
            </option>
          ))}
        </select>

        {/* DISEASE SELECT */}
        <label className="text-xs font-bold text-slate-600">Bệnh</label>
        <select
          className="w-full px-3 py-2 bg-slate-50 rounded-xl text-sm"
          value={form.diseaseName}
          onChange={(e) => handleChange('diseaseName', e.target.value)}
        >
          {diseases.map((d) => (
            <option key={d.id} value={d.name}>
              {d.name}
            </option>
          ))}
        </select>

        <input
          type="date"
          className="w-full px-3 py-2 bg-slate-50 rounded-xl"
          value={form.sickDate || ''}
          onChange={(e) => handleChange('sickDate', e.target.value)}
        />

        <input
          type="date"
          className="w-full px-3 py-2 bg-slate-50 rounded-xl"
          value={form.recoveryDate || ''}
          onChange={(e) => handleChange('recoveryDate', e.target.value)}
        />

        <input
          className="w-full px-3 py-2 bg-slate-50 rounded-xl"
          value={form.severity || ''}
          onChange={(e) => handleChange('severity', e.target.value)}
        />

        <textarea
          className="w-full px-3 py-2 bg-slate-50 rounded-xl"
          value={form.note || ''}
          onChange={(e) => handleChange('note', e.target.value)}
        />

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-3 py-2">
            Hủy
          </button>
          <button
            onClick={() => onSave(history.id, form)}
            className="px-4 py-2 bg-blue-600 text-white rounded-xl"
          >
            Cập nhật
          </button>
        </div>
      </div>
    </div>
  );
}

export default DiseaseHistoryUpdateForm;