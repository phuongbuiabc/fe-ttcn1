'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { cn } from '@/shared/utils/utils';
import { BaseSearch } from '@/shared/components/search';
import { MatingResponse } from '../model/mating.model';
import useMating from '@/modules/mating/hook/useMating';
import { MatingStatus } from '@/shared/enums/mating.enum';

interface MatingTableProps {
  matings?: MatingResponse[];
  loading?: boolean;
  onView?: (mating: MatingResponse) => void;
  onEdit?: (mating: MatingResponse) => void;
  onDelete?: (id: string) => void;
}

export function MatingTable({
  matings: propMatings,
  loading: propLoading,
  onView,
  onEdit,
  onDelete,
}: MatingTableProps) {
  const {
    matings: hookMatings,
    loading: hookLoading,
    fetchMatings,
    deleteMating,
    updatePregnancyStatus,
  } = useMating();

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const matings = propMatings ?? hookMatings;
  const loading = propLoading ?? hookLoading;
  const visibleMatings = useMemo(() => {
    const fromDateTime = fromDate ? new Date(fromDate).setHours(0, 0, 0, 0) : null;
    const toDateTime = toDate ? new Date(toDate).setHours(23, 59, 59, 999) : null;

    return matings.filter((mating) => {
      if (mating.status !== MatingStatus.TRACKING) return false;

      const earTagMatch = searchTerm.trim()
        ? (mating.sowPigEarTag || '').toLowerCase().includes(searchTerm.trim().toLowerCase())
        : true;

      const matingTime = mating.matingDate ? new Date(mating.matingDate).getTime() : null;
      const fromDateMatch = fromDateTime !== null && matingTime !== null ? matingTime >= fromDateTime : true;
      const toDateMatch = toDateTime !== null && matingTime !== null ? matingTime <= toDateTime : true;

      return earTagMatch && fromDateMatch && toDateMatch;
    });
  }, [matings, searchTerm, fromDate, toDate]);
  const selectedMatings = useMemo(
    () => visibleMatings.filter((mating) => selectedIds.includes(mating.id)),
    [visibleMatings, selectedIds]
  );
  const allSelected = visibleMatings.length > 0 && selectedIds.length === visibleMatings.length;

  useEffect(() => {
    if (!propMatings) fetchMatings(MatingStatus.TRACKING);
  }, [propMatings, fetchMatings]);

  useEffect(() => {
    setSelectedIds([]);
  }, [visibleMatings]);

  useEffect(() => {
    setSelectedIds((current) => current.filter((id) => visibleMatings.some((mating) => mating.id === id)));
  }, [visibleMatings]);

  const handleDelete = async (id: string) => {
    if (onDelete) return onDelete(id);
    if (!confirm('Xác nhận xóa bản ghi phối giống?')) return;
    try {
      await deleteMating(id);
    } catch (err) {
      console.error(err);
      alert('Xóa thất bại');
    }
  };

  const toggleOne = (id: string) => {
    setSelectedIds((current) =>
      current.includes(id) ? current.filter((selectedId) => selectedId !== id) : [...current, id]
    );
  };

  const toggleAll = (checked: boolean) => {
    setSelectedIds(checked ? visibleMatings.map((mating) => mating.id) : []);
  };

  const handleBulkPregnancyStatus = async (status: MatingStatus) => {
    if (selectedIds.length === 0) return;

    const statusLabel =
      status === MatingStatus.SUCCESS
        ? 'đậu thai'
        : status === MatingStatus.FAILURE
        ? 'không đậu'
        : status;

    if (!confirm(`Xác nhận duyệt ${selectedIds.length} bản ghi ${statusLabel}?`)) return;

    setUpdatingStatus(true);
    try {
      await updatePregnancyStatus(selectedIds, status);
      setSelectedIds([]);
    } catch (err) {
      console.error(err);
      alert('Cập nhật trạng thái thai thất bại');
    } finally {
      setUpdatingStatus(false);
    }
  };

  if (loading && matings.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-emerald-600" />
      </div>
    );
  }

  return (
    <div className="flex h-[72vh] min-h-[560px] flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
      <div className="border-b border-slate-100 bg-white px-4 py-3">
        <div className="flex flex-nowrap items-end gap-2 overflow-x-auto whitespace-nowrap">
          <BaseSearch
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Nhập số tai"
            className="min-w-[300px] shrink-0"
          />

          <div className="ml-auto flex shrink-0 items-center gap-2">
            <label className="flex min-w-[220px] items-center gap-2">
              <span className="shrink-0 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Từ
              </span>
              <input
                type="date"
                value={fromDate}
                onChange={(event) => setFromDate(event.target.value)}
                className="min-w-0 flex-1 rounded-lg border border-slate-200 px-2.5 py-2 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10"
              />
            </label>

            <label className="flex min-w-[220px] items-center gap-2">
              <span className="shrink-0 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Đến
              </span>
              <input
                type="date"
                value={toDate}
                onChange={(event) => setToDate(event.target.value)}
                className="min-w-0 flex-1 rounded-lg border border-slate-200 px-2.5 py-2 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10"
              />
            </label>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <table className="w-full border-collapse text-left">
          <thead className="sticky top-0 z-10 bg-slate-50/95 backdrop-blur">
            <tr>
              <th className="w-12 px-4 py-3 text-center">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={(event) => toggleAll(event.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
              </th>
              <th className="px-6 py-3 text-[9px] font-black uppercase text-slate-400">
                Heo nái
              </th>
              <th className="px-6 py-3 text-[9px] font-black uppercase text-slate-400">
                Giống nái
              </th>
              <th className="px-6 py-3 text-[9px] font-black uppercase text-slate-400">
                Giống đực
              </th>
              <th className="px-6 py-3 text-[9px] font-black uppercase text-slate-400 text-center">
                Lứa đẻ
              </th>
              <th className="px-6 py-3 text-[9px] font-black uppercase text-slate-400 text-center">
                Số con
              </th>
              <th className="px-6 py-3 text-[9px] font-black uppercase text-slate-400 text-center">
                Ngày phối
              </th>
              <th className="px-6 py-3 text-[9px] font-black uppercase text-slate-400 text-center">
                Trạng thái
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-50">
            {visibleMatings.map((mating: MatingResponse) => {
              const isSelected = selectedIds.includes(mating.id);

              return (
                <tr
                  key={mating.id}
                  className={cn(
                    'bg-white transition-all hover:bg-slate-50',
                    isSelected && 'bg-emerald-50/60'
                  )}
                  onClick={() => onView?.(mating)}
                >
                  <td className="px-4 py-3 text-center">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onClick={(event) => event.stopPropagation()}
                      onChange={() => toggleOne(mating.id)}
                      className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                    />
                  </td>

                  <td className="px-6 py-3">
                    <p className="text-[13px] font-black text-slate-900">
                      {mating.sowPigEarTag || '--'}
                    </p>
                  </td>

                  <td className="px-6 py-3">
                    <span className="text-xs text-slate-700">
                      {mating.sowBreed || '--'}
                    </span>
                  </td>

                  <td className="px-6 py-3">
                    <span className="text-xs text-slate-700">
                      {mating.boarBreed || '--'}
                    </span>
                  </td>

                  <td className="px-6 py-3 text-center">
                    <span className="text-sm font-bold text-slate-900">
                      {mating.matingRound}
                    </span>
                  </td>

                  <td className="px-6 py-3 text-center">
                    <span className="text-sm font-bold text-slate-900">
                      {mating.litterLength}
                    </span>
                  </td>

                  <td className="px-6 py-3 text-center">
                    <span className="text-xs text-slate-700">
                      {mating.matingDate
                        ? new Date(mating.matingDate).toLocaleDateString()
                        : '--'}
                    </span>
                  </td>

                  <td className="px-6 py-3 text-center">
                    <span
                      className={cn(
                        'rounded-full px-2 py-0.5 text-[9px] font-bold uppercase',
                        mating.status === MatingStatus.SUCCESS
                          ? 'bg-emerald-50 text-emerald-600'
                          : mating.status === MatingStatus.FAILURE
                          ? 'bg-red-50 text-red-600'
                          : 'bg-slate-100 text-slate-500'
                      )}
                    >
                      {mating.status || '--'}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="shrink-0 border-t border-slate-100 bg-white px-4 py-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm font-semibold text-slate-600">
            Đã chọn <span className="text-slate-900">{selectedMatings.length}</span>/{visibleMatings.length} dòng
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={selectedIds.length === 0 || updatingStatus}
              onClick={() => handleBulkPregnancyStatus(MatingStatus.SUCCESS)}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
            >
              Đậu thai
            </button>
            <button
              type="button"
              disabled={selectedIds.length === 0 || updatingStatus}
              onClick={() => handleBulkPregnancyStatus(MatingStatus.FAILURE)}
              className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
            >
              Không đậu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}