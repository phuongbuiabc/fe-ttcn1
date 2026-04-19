'use client'

import React from 'react';
import { Edit, Trash2, Truck, Phone, Mail, MapPin } from 'lucide-react';
import { motion } from 'motion/react';
import { Supplier } from '@/shared/types';
import { cn } from '@/shared/lib/utils';

interface SupplierTableProps {
  suppliers: Supplier[];
  loading: boolean;
  onEdit: (supplier: Supplier) => void;
  onDelete: (supplier: Supplier) => void;
}

export function SupplierTable({ suppliers, loading, onEdit, onDelete }: SupplierTableProps) {
  if (loading) {
    return (
      <div className="py-20 text-center font-black text-slate-400 uppercase tracking-widest">
        Đang tải danh sách đối tác...
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="bg-slate-50/50">
            <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Nhà cung cấp</th>
            <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Phân loại</th>
            <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Liên hệ</th>
            <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none text-right">Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {suppliers.map((item, i) => (
            <motion.tr 
              key={item.id} 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              transition={{ delay: i * 0.05 }}
              className="hover:bg-slate-50/50 group transition-all"
            >
              <td className="px-8 py-5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
                    <Truck size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800 leading-none">{item.name}</p>
                    <p className="text-[10px] font-black text-slate-400 uppercase mt-1.5 tracking-tighter">{item.supplierCode}</p>
                  </div>
                </div>
              </td>
              <td className="px-8 py-5">
                <span className="px-3 py-1 bg-slate-100 text-slate-500 text-[10px] font-black rounded-lg uppercase tracking-wider">
                  {item.type}
                </span>
              </td>
              <td className="px-8 py-5">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm font-bold text-slate-600">
                    <Phone size={12} className="text-slate-300" /> {item.phone}
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 font-medium">
                    <Mail size={12} className="text-slate-300" /> {item.email}
                  </div>
                </div>
              </td>
              <td className="px-10 py-6 text-right">
                <div className="flex justify-end gap-2 transition-all">
                  <button 
                    onClick={(e) => { e.stopPropagation(); onEdit(item); }}
                    className="p-2.5 text-slate-400 hover:text-emerald-600 transition-all"
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
