'use client';

import React from 'react';
import { PigResponse } from '@/modules/pig/model/pig.model';
import { Eye, Edit, Trash2 } from 'lucide-react';
import { cn } from '@/shared/utils/utils';

interface PigTableProps {
  pigs: PigResponse[];
  loading: boolean;
  onEdit: (pig: PigResponse) => void;
  onDelete: (id: string) => void;
  onView: (pig: PigResponse) => void;
}

export function PigTable({ pigs, loading, onEdit, onDelete, onView }: PigTableProps) {
  if (loading && pigs.length === 0) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="responsive-table">
      <table className="w-full text-left border-collapse">
        <thead className="bg-slate-50/50">
          <tr>
            <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase">Mã / Tai</th>
            <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase">Loại</th>
            <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase">Giống</th>
            <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase">Nguồn</th>
            <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase text-center">Cân nặng</th>
            <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase text-center">Ngày sinh</th>
            <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase text-center">Trạng thái</th>
            <th className="px-6 py-3 text-[9px] font-black text-slate-900 uppercase text-right">Thao tác</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-50">
          {pigs.map((pig) => (
            <tr
              key={pig.id}
              className="bg-white hover:bg-slate-50 transition-all cursor-pointer"
              onClick={() => onView(pig)}
            >
              {/* CODE + EARTAG */}
              <td className="px-6 py-3">
                <p className="font-black text-slate-900 text-[13px]">
                  {pig.pigCode}
                </p>
                <p className="text-[10px] text-slate-400">
                  Tai: {pig.earTag || '--'}
                </p>
              </td>

              {/* TYPE */}
              <td className="px-6 py-3">
                <span className="font-bold text-xs text-slate-700">
                  {pig.type}
                </span>
              </td>

              {/* SPECIES */}
              <td className="px-6 py-3">
                <span className="text-xs text-slate-700">
                  {pig.species || '--'}
                </span>
              </td>

              {/* ORIGIN */}
              <td className="px-6 py-3">
                <span className="text-xs text-slate-600">
                  {pig.origin || '--'}
                </span>
              </td>

              {/* WEIGHT */}
              <td className="px-6 py-3 text-center">
                <span className="font-bold text-sm">
                  {pig.birthWeight ?? '--'}
                </span>
                <span className="ml-1 text-[10px] text-slate-400">kg</span>
              </td>

              {/* BIRTH DATE */}
              <td className="px-6 py-3 text-center text-xs text-slate-600">
                {pig.birthDate
                  ? new Date(pig.birthDate).toLocaleDateString('vi-VN')
                  : '--'}
              </td>

              {/* STATUS */}
              <td className="px-6 py-3 text-center">
                <span
                  className={cn(
                    "px-2 py-0.5 rounded-full text-[9px] font-bold uppercase",
                    pig.status === 'ACTIVE'
                      ? "bg-emerald-50 text-emerald-600"
                      : "bg-slate-100 text-slate-500"
                  )}
                >
                  {pig.status || '--'}
                </span>
              </td>

              {/* ACTION */}
              <td className="px-6 py-3 text-right">
                <div className="flex justify-end gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onView(pig);
                    }}
                    className="text-slate-400 hover:text-emerald-600"
                  >
                    <Eye size={16} />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(pig);
                    }}
                    className="text-slate-400 hover:text-blue-600"
                  >
                    <Edit size={16} />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(pig.id);
                    }}
                    className="text-slate-400 hover:text-rose-600"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}