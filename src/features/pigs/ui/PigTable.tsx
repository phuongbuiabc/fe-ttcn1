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
      <table className="w-full text-left border-collapse">
        <thead className="bg-slate-50/50">
          <tr>
            <th className="px-10 py-6 text-[10px] font-black text-slate-900 uppercase tracking-widest leading-none">Mã Số Tai / ID</th>
            <th className="px-10 py-6 text-[10px] font-black text-slate-900 uppercase tracking-widest leading-none">Giống / Đặc điểm</th>
            <th className="px-10 py-6 text-[10px] font-black text-slate-900 uppercase tracking-widest leading-none">Trạng thái</th>
            <th className="px-10 py-6 text-[10px] font-black text-slate-900 uppercase tracking-widest leading-none text-center">Trọng lượng</th>
            <th className="px-10 py-6 text-[10px] font-black text-slate-900 uppercase tracking-widest leading-none text-right">Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {pigs.map((pig) => (
            <tr 
              key={pig.id} 
              className="bg-white hover:bg-slate-50 transition-all group cursor-pointer"
              onClick={() => onView(pig)}
            >
              <td className="px-10 py-6">
                 <p className="font-black text-slate-900 tracking-tight">{pig.pigCode}</p>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter mt-1">ID: {pig.id.slice(0, 8)}</p>
              </td>
              <td className="px-10 py-6">
                <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-black text-xs uppercase">
                      {pig.breed.charAt(0)}
                   </div>
                   <span className="font-bold text-slate-700">{pig.breed}</span>
                </div>
              </td>
              <td className="px-10 py-6">
                <span className={cn(
                  "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest",
                  pig.healthStatus === 'HEALTHY' ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                )}>
                  {pig.healthStatus === 'HEALTHY' ? "KHỎE MẠNH" : "THEO DÕI"}
                </span>
              </td>
              <td className="px-10 py-6 text-center">
                <span className="text-lg font-black text-slate-800 tracking-tighter">{pig.weight}</span>
                <span className="ml-1 text-[10px] font-black text-slate-400 uppercase">KG</span>
              </td>
              <td className="px-10 py-6 text-right">
                <div className="flex justify-end gap-2 transition-all">
                  <button 
                    onClick={(e) => { e.stopPropagation(); onView(pig); }}
                    className="p-2.5 text-slate-400 hover:text-emerald-600 transition-all"
                  >
                    <Eye size={18} />
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); onEdit(pig); }}
                    className="p-2.5 text-slate-400 hover:text-blue-600 transition-all"
                  >
                    <Edit size={18} />
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); onDelete(pig.id); }}
                    className="p-2.5 text-slate-400 hover:text-rose-600 transition-all"
                  >
                    <Trash2 size={18} />
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
