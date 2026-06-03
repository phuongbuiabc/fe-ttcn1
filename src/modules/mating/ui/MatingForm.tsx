'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Heart, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CreateMatingRequest, UpdateMatingRequest } from '../model/mating.model';
import useSemen from '@/modules/semen/hooks/useSemen';
import { usePig } from '@/modules/pig/hooks/usePig';
import type { SowResponse } from '@/modules/pig/model/pig.model';
import { useAuth } from '@/shared/components/AuthProvider';
import { MatingStatus } from '@/shared/enums/mating.enum';
import useMating from '../hook/useMating';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  initial?: Partial<CreateMatingRequest | UpdateMatingRequest>;
  onSubmit?: (data: CreateMatingRequest | UpdateMatingRequest) => Promise<any> | any;
  onSuccess?: () => void;
  loading?: boolean;
}

export const MatingForm: React.FC<Props> = ({
  isOpen,
  onClose,
  initial = {},
  onSubmit,
  onSuccess,
  loading,
}) => {
  const { semens, fetchSemens } = useSemen();
  const { sows, fetchSows } = usePig();
  const { createMating, loading: matingLoading } = useMating();

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
    status: initial.status || MatingStatus.TRACKING,
  });
  const [sowQuery, setSowQuery] = useState('');

  useEffect(() => {
    if (!isOpen) return;

    setForm({
      sowPigId: initial.sowPigId || '',
      semenId: initial.semenId || '',
      litterLength: initial.litterLength ?? 0,
      matingRound: initial.matingRound ?? 0,
      employeeId: initial.employeeId || user?.id || '',
      matingDate: initial.matingDate || today,
      status: initial.status || MatingStatus.TRACKING,
    });

    setSowQuery('');
  }, [
    isOpen,
    initial.sowPigId,
    initial.semenId,
    initial.litterLength,
    initial.matingRound,
    initial.employeeId,
    initial.matingDate,
    initial.status,
    user?.id,
    today,
  ]);

  useEffect(() => {
    if (!isOpen) return;
    fetchSemens?.();
    fetchSows?.();
  }, [fetchSemens, fetchSows, isOpen]);

  useEffect(() => {
    const selectedSow = sows.find((s) => s.id === form.sowPigId);
    if (selectedSow && selectedSow.earTag !== sowQuery) {
      setSowQuery(selectedSow.earTag);
    }
  }, [form.sowPigId, sows, sowQuery]);

  const update = <K extends keyof Req>(key: K, value: Req[K]) => {
    setForm((previous) => ({ ...previous, [key]: value } as Req));
  };

  const sowSuggestions = sowQuery.trim()
    ? sows
        .filter((s) => s.earTag.toLowerCase().includes(sowQuery.trim().toLowerCase()))
        .slice(0, 8)
    : [];

  const handleSubmit = async (event?: React.FormEvent) => {
    event?.preventDefault();

    if (!form.sowPigId) return alert('Vui lòng chọn số tai nái');
    if (!form.semenId) return alert('Vui lòng chọn nọc');

    try {
      const result = onSubmit
        ? await onSubmit(form)
        : await createMating({
            sowPigId: form.sowPigId,
            semenId: form.semenId,
            litterLength: form.litterLength ?? 0,
            matingRound: form.matingRound ?? 0,
            employeeId: form.employeeId || user?.id || '',
            matingDate: form.matingDate || today,
            status: form.status || MatingStatus.TRACKING,
          });

      if (result?.success === false) {
        alert(result?.message || 'Tạo phối giống thất bại');
        return;
      }

      // notify parent that creation succeeded so it can refresh table
      try {
        onSuccess?.();
      } catch (err) {
        console.error('onSuccess handler error', err);
      }

      onClose();
    } catch (error) {
      console.error(error);
      alert('Lưu thất bại');
    }
  };

  const effectiveLoading = loading ?? matingLoading;
  const fieldClassName =
    'mt-1 w-full px-3 py-2 rounded-xl text-sm bg-slate-100 text-slate-800 placeholder:text-slate-500 border-0 focus:outline-none focus:ring-2 focus:ring-emerald-500';

  return (
    <AnimatePresence>
      {isOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-[1.75rem] w-full max-w-xl overflow-hidden shadow-2xl flex flex-col"
          >
            <div className="p-8 border-b border-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center">
                  <Heart size={24} />
                </div>
                <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">Phối giống mới</h3>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-xl transition-all">
                <X size={24} className="text-slate-300" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 p-4">
              <div className="flex flex-col gap-4">
                <div className="relative">
                  <label className="block text-sm font-semibold text-slate-800">Nái</label>
                  <input
                    value={sowQuery}
                    onChange={(event) => {
                      const value = event.target.value;
                      setSowQuery(value);
                      const matchedSow = sows.find((s) => s.earTag.toLowerCase() === value.trim().toLowerCase());
                      update('sowPigId', matchedSow?.id || '');
                    }}
                    className={fieldClassName}
                    placeholder="Nhập số tai nái"
                    autoComplete="off"
                  />
                  {sowSuggestions.length > 0 && (
                    <div className="absolute z-20 mt-1 w-full overflow-hidden rounded-xl bg-slate-900 shadow-lg ring-1 ring-slate-700">
                      {sowSuggestions.map((s: SowResponse) => (
                        <button
                          key={s.id}
                          type="button"
                          onMouseDown={(event) => event.preventDefault()}
                          onClick={() => {
                            setSowQuery(s.earTag);
                            update('sowPigId', s.id);
                          }}
                          className="flex w-full items-center justify-between px-3 py-2 text-left text-sm text-slate-100 hover:bg-slate-800"
                        >
                          <span>{s.earTag}</span>
                          <span className="text-xs text-slate-500">{s.breedName || '--'}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-800">Nọc</label>
                  <select
                    value={form.semenId}
                    onChange={(event) => update('semenId', event.target.value)}
                    className={fieldClassName}
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
                  <label className="block text-sm font-semibold text-slate-800">Ngày phối</label>
                  <input
                    type="date"
                    value={form.matingDate || today}
                    onChange={(event) => update('matingDate', event.target.value)}
                    className={fieldClassName}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-100 rounded-xl">
                  Huỷ
                </button>
                <button
                  type="submit"
                  disabled={effectiveLoading}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-xl disabled:opacity-50"
                >
                  {effectiveLoading ? 'Đang lưu...' : 'Lưu'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
};

export default MatingForm;
