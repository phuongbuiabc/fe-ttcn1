'use client';

import React, { useState, useEffect } from 'react';
import { CreateMatingRequest, UpdateMatingRequest } from '../model/mating.model';
import useSemen from '@/modules/semen/hooks/useSemen';
import { useAuth } from '@/shared/components/AuthProvider';

interface Props {
  initial?: Partial<CreateMatingRequest | UpdateMatingRequest>;
  onSubmit: (data: CreateMatingRequest | UpdateMatingRequest) => Promise<any> | any;
  onCancel?: () => void;
  loading?: boolean;
}

export const MatingForm: React.FC<Props> = ({ initial = {}, onSubmit, onCancel, loading }) => {
  const { options: semenOptions, semens } = useSemen();

  type Req = CreateMatingRequest | UpdateMatingRequest;

  const { user } = useAuth();

  const [form, setForm] = useState<Req>({
    sowPigId: initial.sowPigId || '',
    semenId: initial.semenId || '',
    boarBreed: initial.boarBreed || '',
    litterLength: initial.litterLength ?? 0,
    matingRound: initial.matingRound ?? 1,
    employeeId: initial.employeeId || user?.id || '',
    matingDate: initial.matingDate || new Date().toISOString().split('T')[0],
    status: initial.status || 'PENDING',
  });

  useEffect(() => {
    // if initial changes, update form
    setForm((f) => ({ ...f, ...initial } as Req));
  }, [initial]);

  useEffect(() => {
    // if no explicit employeeId provided, set from current user
    if (!initial?.employeeId && user?.id) {
      setForm((f) => ({ ...f, employeeId: user.id } as Req));
    }
  }, [user, initial?.employeeId]);

  const update = <K extends keyof Req>(key: K, value: Req[K]) => {
    setForm((prev) => ({ ...prev, [key]: value } as Req));
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    // basic validation
    if (!form.sowPigId) return alert('Vui lòng nhập mã nái');
    if (!form.semenId) return alert('Vui lòng chọn mã nọc');
    try {
      await onSubmit(form);
    } catch (err) {
      console.error(err);
      alert('Lưu thất bại');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-bold text-slate-600">Mã lợn nái</label>
          <input value={form.sowPigId} onChange={(e) => update('sowPigId', e.target.value)} className="mt-1 w-full px-3 py-2 border rounded-xl text-sm" placeholder="VD: NAI-001" />
        </div>

        <div>
          <label className="text-xs font-bold text-slate-600">Mã nọc / Lợn đực</label>
          <select value={form.semenId} onChange={(e) => update('semenId', e.target.value)} className="mt-1 w-full px-3 py-2 border rounded-xl text-sm">
            <option value="">-- Chọn nọc --</option>
            {semenOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-600">Giống đực</label>
          <input value={form.boarBreed} onChange={(e) => update('boarBreed', e.target.value)} className="mt-1 w-full px-3 py-2 border rounded-xl text-sm" placeholder="Giống đực" />
        </div>

        <div>
          <label className="text-xs font-bold text-slate-600">Ngày phối</label>
          <input type="date" value={form.matingDate || new Date().toISOString().split('T')[0]} onChange={(e) => update('matingDate', e.target.value)} className="mt-1 w-full px-3 py-2 border rounded-xl text-sm" />
        </div>

        <div>
          <label className="text-xs font-bold text-slate-600">Lần phối (Lứa)</label>
          <input type="number" min={1} value={form.matingRound} onChange={(e) => update('matingRound', Number(e.target.value))} className="mt-1 w-full px-3 py-2 border rounded-xl text-sm" />
        </div>

        <div>
          <label className="text-xs font-bold text-slate-600">Số con dự kiến</label>
          <input type="number" min={0} value={form.litterLength} onChange={(e) => update('litterLength', Number(e.target.value))} className="mt-1 w-full px-3 py-2 border rounded-xl text-sm" />
        </div>

        <div>
          <label className="text-xs font-bold text-slate-600">Người thực hiện</label>
          <input value={form.employeeId} onChange={(e) => update('employeeId', e.target.value)} className="mt-1 w-full px-3 py-2 border rounded-xl text-sm" placeholder="Mã nhân viên" />
        </div>

        <div>
          <label className="text-xs font-bold text-slate-600">Trạng thái</label>
          <select value={form.status} onChange={(e) => update('status', e.target.value as any)} className="mt-1 w-full px-3 py-2 border rounded-xl text-sm">
            <option value="PENDING">PENDING</option>
            <option value="SUCCESS">SUCCESS</option>
            <option value="FAILED">FAILED</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <button type="button" onClick={onCancel} className="px-4 py-2 bg-slate-100 rounded-xl">Huỷ</button>
        <button type="submit" disabled={loading} className="px-4 py-2 bg-emerald-600 text-white rounded-xl disabled:opacity-50">{loading ? 'Đang lưu...' : 'Lưu'}</button>
      </div>
    </form>
  );
};

export default MatingForm;
