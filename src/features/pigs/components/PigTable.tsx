// components/features/pigs/PigTable.tsx
'use client'

import React from 'react';
import { Pig } from '@/shared/types';
import { Eye, Edit, Trash2, Scale, History, MoreVertical, PawPrint } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

interface PigTableProps {
  pigs: Pig[];
  loading: boolean;
  onEdit: (pig: Pig) => void;
  onDelete: (id: string) => void;
  onView: (pig: Pig) => void;
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
    <div className="overflow-x-auto">
      <table className="w-full text-left border-separate border-spacing-y-2">
        <thead>
          <tr className="bg-slate-50">
            <th className="px-6 py-4 rounded-l-2xl text-[10px] uppercase font-bold text-slate-500">Mã Số</th>
            <th className="px-4 py-4 text-[10px] uppercase font-bold text-slate-500">Giống</th>
            <th className="px-4 py-4 text-[10px] uppercase font-bold text-slate-500">Trạng thái</th>
            <th className="px-4 py-4 text-[10px] uppercase font-bold text-slate-500">Cân nặng</th>
            <th className="px-6 py-4 rounded-r-2xl text-right text-[10px] uppercase font-bold text-slate-500">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {pigs.map((pig) => (
            <tr key={pig.id} className="bg-white hover:bg-slate-50 transition-colors group">
              <td className="px-6 py-4 rounded-l-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                     <PawPrint size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">{pig.pigCode}</p>
                    <p className="text-[10px] text-slate-500">ID: {pig.id.slice(0, 8)}</p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-4">
                <span className="font-medium text-slate-700">{pig.breed}</span>
              </td>
              <td className="px-4 py-4">
                <span className={cn(
                  "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                  pig.healthStatus === 'HEALTHY' ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
                )}>
                  {pig.healthStatus}
                </span>
              </td>
              <td className="px-4 py-4 font-bold text-slate-900">
                {pig.weight} kg
              </td>
              <td className="px-6 py-4 rounded-r-2xl text-right">
                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => onView(pig)} className="p-2 hover:bg-emerald-50 text-emerald-600 rounded-lg"><Eye size={18} /></button>
                  <button onClick={() => onEdit(pig)} className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg"><Edit size={18} /></button>
                  <button onClick={() => onDelete(pig.id)} className="p-2 hover:bg-rose-50 text-rose-600 rounded-lg"><Trash2 size={18} /></button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
