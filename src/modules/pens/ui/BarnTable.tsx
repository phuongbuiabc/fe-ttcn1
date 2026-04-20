// TODO: Move code from features/pens/ui/BarnTable.tsx here
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
    <div className="responsive-table">
      <table className="w-full text-left border-collapse">
        <thead className="bg-slate-50/50">
          <tr>
            <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Thông tin Chuồng</th>
            <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Phân khu</th>
            <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Mật độ / Sức chứa</th>
            <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Trạng thái</th>
            <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none text-right">Thao tác</th>
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
              <td className="px-6 py-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center">
                    <Home size={14} />
                  </div>
                  <div>
                    <p className="text-[13px] font-black text-slate-800 leading-none">{item.name}</p>
                    <p className="text-[9px] font-black text-slate-400 uppercase mt-0.5 tracking-tighter">ID: {item.id}</p>
                  </div>
                </div>
              </td>
              <td className="px-6 py-3">
                <span className="px-2 py-0.5 bg-slate-50 text-slate-500 text-[9px] font-black rounded border border-slate-100 uppercase tracking-widest">
                  {item.section}
                </span>
                <p className="text-[9px] text-slate-400 font-bold mt-0.5 uppercase">{item.type}</p>
              </td>
              <td className="px-6 py-3">
                <div className="flex items-center gap-1.5">
                  <span className="text-base font-black tracking-tighter text-slate-800">
                    {item.currentPigs}
                  </span>
                  <span className="text-[9px] font-black text-slate-300 uppercase">/ {item.capacity} con</span>
                </div>
                <div className="w-20 h-1 bg-slate-100 rounded-full mt-1.5 overflow-hidden">
                   <div 
                    className="h-full bg-emerald-500 rounded-full" 
                    style={{ width: `${(item.currentPigs / item.capacity) * 100}%` }}
                   />
                </div>
              </td>
              <td className="px-6 py-3">
                 <span className={cn(
                    "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest",
                    item.status === "ĐANG SỬ DỤNG" ? "bg-emerald-50 text-emerald-600" : 
                    item.status === "TRỐNG" ? "bg-amber-50 text-amber-600" : "bg-rose-50 text-rose-500"
                  )}>
                    {item.status}
                  </span>
              </td>
              <td className="px-6 py-2 text-right">
                <div className="flex justify-end gap-1.5 transition-all">
                  <button 
                    onClick={(e) => { e.stopPropagation(); onView(item); }}
                    className="p-1.5 text-slate-400 hover:text-emerald-600 transition-all"
                  >
                    <Eye size={14} />
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); onEdit(item); }}
                    className="p-1.5 text-slate-400 hover:text-blue-600 transition-all"
                  >
                    <Edit size={14} />
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); onDelete(item); }}
                    className="p-1.5 text-slate-400 hover:text-rose-600 transition-all"
                  >
                    <Trash2 size={14} />
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

