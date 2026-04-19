'use client'

import React from 'react';
import { Eye, Edit, Trash2, Home } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/shared/lib/utils';

interface Barn {
  id: string;
  name: string;
  section: string;
  type: string;
  capacity: number;
  currentPigs: number;
  area: number;
  density: number;
  status: "ĐANG SỬ DỤNG" | "TRỐNG" | "BẢO TRÌ";
}

interface BarnTableProps {
  barns: Barn[];
  onView: (barn: Barn) => void;
  onEdit: (barn: Barn) => void;
  onDelete: (barn: Barn) => void;
}

export function BarnTable({ barns, onView, onEdit, onDelete }: BarnTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead className="bg-slate-50/50">
          <tr>
            <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Thông tin Chuồng</th>
            <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Phân khu</th>
            <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Mật độ / Sức chứa</th>
            <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Trạng thái</th>
            <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none text-right">Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {barns.map((item, i) => (
            <motion.tr 
              key={item.id} 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              transition={{ delay: i * 0.02 }} 
              onClick={() => onView(item)} 
              className="hover:bg-slate-50 transition-all group cursor-pointer"
            >
              <td className="px-10 py-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                    <Home size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-black text-slate-800 leading-none">{item.name}</p>
                    <p className="text-[10px] font-black text-slate-400 uppercase mt-1.5 tracking-tighter">ID: {item.id}</p>
                  </div>
                </div>
              </td>
              <td className="px-10 py-6">
                <span className="px-3 py-1 bg-slate-50 text-slate-500 text-[10px] font-black rounded-lg border border-slate-100 uppercase tracking-widest">
                  {item.section}
                </span>
                <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase">{item.type}</p>
              </td>
              <td className="px-10 py-6">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-black tracking-tighter text-slate-800">
                    {item.currentPigs}
                  </span>
                  <span className="text-[10px] font-black text-slate-300 uppercase">/ {item.capacity} con</span>
                </div>
                <div className="w-24 h-1 bg-slate-100 rounded-full mt-2 overflow-hidden">
                   <div 
                    className="h-full bg-emerald-500 rounded-full" 
                    style={{ width: `${(item.currentPigs / item.capacity) * 100}%` }}
                   />
                </div>
              </td>
              <td className="px-10 py-6">
                 <span className={cn(
                    "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest",
                    item.status === "ĐANG SỬ DỤNG" ? "bg-emerald-50 text-emerald-600" : 
                    item.status === "TRỐNG" ? "bg-amber-50 text-amber-600" : "bg-rose-50 text-rose-500"
                  )}>
                    {item.status}
                  </span>
              </td>
              <td className="px-10 py-6 text-right">
                <div className="flex justify-end gap-2 transition-all">
                  <button 
                    onClick={(e) => { e.stopPropagation(); onView(item); }}
                    className="p-2.5 text-slate-400 hover:text-emerald-600 transition-all"
                  >
                    <Eye size={18} />
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); onEdit(item); }}
                    className="p-2.5 text-slate-400 hover:text-blue-600 transition-all"
                  >
                    <Edit size={18} />
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); onDelete(item); }}
                    className="p-2.5 text-slate-400 hover:text-rose-600 transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
