'use client';

import React from 'react';
import { PigCurrentResponse } from '@/modules/pig/model/pig.model';
import { cn } from '@/shared/utils/utils';

interface PigCurrentTableProps {
  pigs: PigCurrentResponse[];
  loading: boolean;
}

export function PigCurrentTable({ pigs, loading }: PigCurrentTableProps) {
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
            <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase">Số tai</th>
            <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase">Loại</th>
            <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase">Giống</th>
            <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase text-center">Cân nặng</th>
            <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase text-center">Dài lưng</th>
            <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase text-center">Vòng ngực</th>
            <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase text-center">Ngày đo</th>
            <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase text-center">Tăng trưởng</th>
            <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase text-center">Hiệu quả</th>
            <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase text-center">Trạng thái</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-50">
          {pigs.length === 0 ? (
            <tr>
              <td colSpan={10} className="px-6 py-6 text-center text-slate-500">
                Không có dữ liệu
              </td>
            </tr>
          ) : (
            pigs.map((pig) => (
              <tr key={pig.id} className="bg-white hover:bg-slate-50 transition-all">
                {/* EAR TAG */}
                <td className="px-6 py-3">
                  <p className="font-black text-slate-900 text-[13px]">{pig.earTag || '--'}</p>
                </td>

                {/* TYPE */}
                <td className="px-6 py-3">
                  <span className="font-bold text-xs text-slate-700">{pig.type}</span>
                </td>

                {/* SPECIES */}
                <td className="px-6 py-3">
                  <span className="text-xs text-slate-700">{pig.species || '--'}</span>
                </td>

                {/* WEIGHT */}
                <td className="px-6 py-3 text-center">
                  <span className="font-bold text-sm">{pig.weight ?? '--'}</span>
                  <span className="ml-1 text-[10px] text-slate-400">kg</span>
                </td>

                {/* LITTER LENGTH */}
                <td className="px-6 py-3 text-center">
                  <span className="text-xs">{pig.litterLength ?? '--'}</span>
                  <span className="ml-1 text-[10px] text-slate-400">cm</span>
                </td>

                {/* CHEST GIRTH */}
                <td className="px-6 py-3 text-center">
                  <span className="text-xs">{pig.chestGirth ?? '--'}</span>
                  <span className="ml-1 text-[10px] text-slate-400">cm</span>
                </td>

                {/* LATEST TRACKING DATE */}
                <td className="px-6 py-3 text-center text-xs text-slate-600">
                  {pig.latestTrackingDate
                    ? new Date(pig.latestTrackingDate).toLocaleDateString('vi-VN')
                    : '--'}
                </td>

                {/* ADG (Average Daily Gain) */}
                <td className="px-6 py-3 text-center">
                  <span className="text-xs font-semibold text-emerald-600">
                    {pig.adg ? `${pig.adg.toFixed(2)}` : '--'}
                  </span>
                  <span className="ml-1 text-[10px] text-slate-400">g/ngày</span>
                </td>

                {/* FCR (Feed Conversion Ratio) */}
                <td className="px-6 py-3 text-center">
                  <span className="text-xs font-semibold">
                    {pig.fcr ? pig.fcr.toFixed(2) : '--'}
                  </span>
                </td>

                {/* STATUS */}
                <td className="px-6 py-3 text-center">
                  <span
                    className={cn(
                      'px-2 py-0.5 rounded-full text-[9px] font-bold uppercase',
                      pig.status === 'ACTIVE'
                        ? 'bg-emerald-50 text-emerald-600'
                        : 'bg-slate-100 text-slate-500'
                    )}
                  >
                    {pig.status || '--'}
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
