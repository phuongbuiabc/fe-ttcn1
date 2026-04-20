'use client'

import React from 'react';
import { Pig } from '../model/pig.model';
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
    <div className="responsive-table">
      <table className="w-full text-left border-collapse">
        <thead className="bg-slate-50/50">
          <tr>
            <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Mã Số Tai / ID</th>
            <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Giống / Đặc điểm</th>
            <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Trạng thái</th>
            <th className="px-6 py-3 text-[9px] font-black text-slate-900 uppercase tracking-widest leading-none text-center">Trọng lượng</th>
            <th className="px-6 py-3 text-[9px] font-black text-slate-900 uppercase tracking-widest leading-none text-right">Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {pigs.map((pig) => (
            <tr 
              key={pig.id} 
              className="bg-white hover:bg-slate-50 transition-all group cursor-pointer"
              onClick={() => onView(pig)}
            >
              <td className="px-6 py-3">
                 <p className="font-black text-slate-900 tracking-tighter text-[13px] leading-none">{pig.pigCode}</p>
                 <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter mt-0.5">ID: {pig.id.slice(0, 8)}</p>
              </td>
              <td className="px-6 py-3">
                <div className="flex items-center gap-2">
                   <div className="w-6 h-6 rounded bg-emerald-50 text-emerald-600 flex items-center justify-center font-black text-[10px] uppercase">
                      {pig.breed.charAt(0)}
                   </div>
                   <span className="font-bold text-slate-700 text-xs">{pig.breed}</span>
                </div>
              </td>
              <td className="px-6 py-3">
                <span className={cn(
                  "px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest",
                  pig.healthStatus === 'HEALTHY' ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                )}>
                  {pig.healthStatus}
                </span>
              </td>
              <td className="px-6 py-3 text-center font-bold text-slate-800">
                {pig.weight}
              </td>
              <td className="px-6 py-3 text-right">
                <button onClick={e => { e.stopPropagation(); onEdit(pig); }} className="mr-2 text-blue-500 hover:underline"><Edit size={16} /></button>
                <button onClick={e => { e.stopPropagation(); onDelete(pig.id); }} className="mr-2 text-red-500 hover:underline"><Trash2 size={16} /></button>
                <button onClick={e => { e.stopPropagation(); onView(pig); }} className="text-green-500 hover:underline"><Eye size={16} /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
