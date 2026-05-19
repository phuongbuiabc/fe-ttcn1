'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { CreateMatingRequest, UpdateMatingRequest } from '../model/mating.model';
import useSemen from '@/modules/semen/hooks/useSemen';
import { usePig } from '@/modules/pig/hooks/usePig';
import type { SowResponse } from '@/modules/pig/model/pig.model';
import { useAuth } from '@/shared/components/AuthProvider';
import { MatingStatus} from '@/shared/enums/mating.enum';

interface Props {
  initial?: Partial<CreateMatingRequest | UpdateMatingRequest>;
  onSubmit: (data: CreateMatingRequest | UpdateMatingRequest) => Promise<any> | any;
  onCancel?: () => void;
  loading?: boolean;
}

export const MatingForm: React.FC<Props> = ({ initial = {}, onSubmit, onCancel, loading }) => {
  const { semens, fetchSemens } = useSemen();
  const { sows, fetchSows } = usePig();

  type Req = CreateMatingRequest | UpdateMatingRequest;

  const { user } = useAuth();
  const today = useMemo(() => new Date().toISOString().split('T')[0], []);

  const [form, setForm] = useState<Req>({
    sowPigId: initial.sowPigId || '',
    semenId: initial.semenId || '',
    litterLength: initial.litterLength ?? 0,
    matingRound: initial.matingRound ?? 0,
    employeeId: initial.employeeId || user?.id || '',
    matingDate: initial.matingDate || today,
    status: initial.status || MatingStatus.PENDING,
  });
  const [sowQuery, setSowQuery] = useState('');

  useEffect(() => {
    // if initial changes, update form
    setForm((f) => ({ ...f, ...initial } as Req));
  }, [initial]);

  useEffect(() => {
    // load semen list so user can select
    fetchSemens?.();
  }, [fetchSemens]);

  useEffect(() => {
    // load sows so user can select by ear tag
    fetchSows?.();
  }, [fetchSows]);

  useEffect(() => {
    const selectedSow = sows.find((s) => s.id === form.sowPigId);
    if (selectedSow && selectedSow.earTag !== sowQuery) {
      setSowQuery(selectedSow.earTag);
    }
    if (!selectedSow && !form.sowPigId && sowQuery) {
      setSowQuery('');
    }
  }, [form.sowPigId, sows, sowQuery]);

  useEffect(() => {
    // if no explicit employeeId provided, set from current user
    if (!initial?.employeeId && user?.id) {
      setForm((f) => ({ ...f, employeeId: user.id } as Req));
    }
  }, [user, initial?.employeeId]);

  const update = <K extends keyof Req>(key: K, value: Req[K]) => {
    setForm((prev) => ({ ...prev, [key]: value } as Req));
  };

  const selectedSemen = semens.find((s) => s.id === form.semenId);
  const boarBreed = selectedSemen?.boarBreed || '';
  const semenLabel = selectedSemen
    ? `${selectedSemen.boarPigEarTag}${selectedSemen.boarBreed ? ` - ${selectedSemen.boarBreed}` : ''}`
    : '';
  const sowSuggestions = sowQuery.trim()
    ? sows.filter((s) => s.earTag.toLowerCase().includes(sowQuery.trim().toLowerCase())).slice(0, 8)
    : [];

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    // basic validation
    if (!form.sowPigId) return alert('Vui lòng chọn số tai nái');
    if (!form.semenId) return alert('Vui lòng chọn nọc');
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
        <div className="relative">
          <label className="text-xs font-bold text-slate-600">Nái</label>
          <input
            value={sowQuery}
            onChange={(e) => {
              const value = e.target.value;
              setSowQuery(value);
              const matchedSow = sows.find((s) => s.earTag.toLowerCase() === value.trim().toLowerCase());
              update('sowPigId', matchedSow?.id || '');
            }}
            className="mt-1 w-full px-3 py-2 border rounded-xl text-sm"
            placeholder="Nhập số tai nái"
            autoComplete="off"
          />
          {sowSuggestions.length > 0 && (
            <div className="absolute z-20 mt-1 w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
              {sowSuggestions.map((s: SowResponse) => (
                <button
                  key={s.id}
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    setSowQuery(s.earTag);
                    update('sowPigId', s.id);
                  }}
                  className="flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-slate-50"
                >
                  <span>{s.earTag}</span>
                  <span className="text-xs text-slate-500">{s.breedName || '--'}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <label className="text-xs font-bold text-slate-600">Nọc</label>
          <select
            value={form.semenId}
            onChange={(e) => update('semenId', e.target.value)}
            className="mt-1 w-full px-3 py-2 border rounded-xl text-sm"
          >
            <option value="">-- Chọn nọc --</option>
            {semens.map((semen) => (
              <option key={semen.id} value={semen.id}>
                {semen.boarPigEarTag}
                {semen.boarBreed ? ` - ${semen.boarBreed}` : ''}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-600">Giống đực</label>
          <input
            value={boarBreed}
            readOnly
            className="mt-1 w-full px-3 py-2 border rounded-xl text-sm bg-slate-50 text-slate-700"
            placeholder="Tự động lấy từ nọc"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-slate-600">Ngày phối</label>
          <input
            type="date"
            value={form.matingDate || today}
            onChange={(e) => update('matingDate', e.target.value)}
            className="mt-1 w-full px-3 py-2 border rounded-xl text-sm"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-slate-600">Lần phối</label>
          <input
            type="number"
            min={0}
            value={form.matingRound}
            onChange={(e) => update('matingRound', Number(e.target.value))}
            className="mt-1 w-full px-3 py-2 border rounded-xl text-sm"
          />
        </div>

        {/* <div>
          <label className="text-xs font-bold text-slate-600">Số con dự kiến</label>
          <input type="number" min={0} value={form.litterLength} onChange={(e) => update('litterLength', Number(e.target.value))} className="mt-1 w-full px-3 py-2 border rounded-xl text-sm" />
        </div> */}

        {/* <div>
          <label className="text-xs font-bold text-slate-600">Người thực hiện</label>
          <input value={form.employeeId} onChange={(e) => update('employeeId', e.target.value)} className="mt-1 w-full px-3 py-2 border rounded-xl text-sm" placeholder="Mã nhân viên" />
        </div> */}
      </div>

      <div className="flex justify-end gap-2">
        <button type="button" onClick={onCancel} className="px-4 py-2 bg-slate-100 rounded-xl">Huỷ</button>
        <button type="submit" disabled={loading} className="px-4 py-2 bg-emerald-600 text-white rounded-xl disabled:opacity-50">{loading ? 'Đang lưu...' : 'Lưu'}</button>
      </div>
    </form>
  );
};

export default MatingForm;
