'use client';

import React, { useEffect } from 'react';
import { cn } from '@/shared/utils/utils';
import { MatingResponse } from '../model/mating.model';
import useMating from '@/modules/mating/hook/useMating';

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
  const { matings: hookMatings, loading: hookLoading, fetchMatings, deleteMating } = useMating();

  const matings = propMatings ?? hookMatings;
  const loading = propLoading ?? hookLoading;

  useEffect(() => {
    if (!propMatings) fetchMatings();
  }, [propMatings, fetchMatings]);

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

  const hasActions = Boolean(onView || onEdit || onDelete || deleteMating);

  if (loading && matings.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-emerald-600" />
      </div>
    );
  }

  return (
    <div className="responsive-table">
      <table className="w-full border-collapse text-left">
        <thead className="bg-slate-50/50">
          <tr>
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
          {matings.map((mating) => (
            <tr
              key={mating.id}
              className="cursor-pointer bg-white transition-all hover:bg-slate-50"
              onClick={() => onView?.(mating)}
            >
              {/* HEO NÁI */}
              <td className="px-6 py-3">
                <p className="text-[13px] font-black text-slate-900">
                  {mating.sowPigEarTag || '--'}
                </p>
              </td>

              {/* GIỐNG NÁI */}
              <td className="px-6 py-3">
                <span className="text-xs text-slate-700">
                  {mating.sowBreed || '--'}
                </span>
              </td>

              {/* GIỐNG ĐỰC */}
              <td className="px-6 py-3">
                <span className="text-xs text-slate-700">
                  {mating.boarBreed || '--'}
                </span>
              </td>

              {/* LỨA ĐẺ */}
              <td className="px-6 py-3 text-center">
                <span className="text-sm font-bold text-slate-900">
                  {mating.matingRound}
                </span>
              </td>

              {/* SỐ CON */}
              <td className="px-6 py-3 text-center">
                <span className="text-sm font-bold text-slate-900">
                  {mating.litterLength}
                </span>
              </td>

              {/* NGÀY PHỐI */}
              <td className="px-6 py-3 text-center">
                <span className="text-xs text-slate-700">
                  {mating.matingDate
                    ? new Date(mating.matingDate).toLocaleDateString()
                    : '--'}
                </span>
              </td>

              {/* TRẠNG THÁI */}
              <td className="px-6 py-3 text-center">
                <span
                  className={cn(
                    'rounded-full px-2 py-0.5 text-[9px] font-bold uppercase',
                    mating.status === 'SUCCESS'
                      ? 'bg-emerald-50 text-emerald-600'
                      : mating.status === 'FAILED'
                      ? 'bg-red-50 text-red-600'
                      : 'bg-slate-100 text-slate-500'
                  )}
                >
                  {mating.status || '--'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}