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
        <thead className="bg-slate-50/50">
          <tr>
            <th className="px-6 py-3 text-[10px] font-black text-slate-900 uppercase tracking-widest leading-none">Đối tác / Nhà cung cấp</th>
            <th className="px-6 py-3 text-[10px] font-black text-slate-900 uppercase tracking-widest leading-none">Phân loại hàng</th>
            <th className="px-6 py-3 text-[10px] font-black text-slate-900 uppercase tracking-widest leading-none">Thông tin liên hệ</th>
            <th className="px-6 py-3 text-[10px] font-black text-slate-900 uppercase tracking-widest leading-none text-right">Thao tác</th>
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
              <td className="px-6 py-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center">
                    <Truck size={14} />
                  </div>
                  <div>
                    <p className="text-[13px] font-bold text-slate-800 leading-none">{item.name}</p>
                    <p className="text-[10px] font-black text-slate-400 uppercase mt-0.5 tracking-tighter">{item.supplierCode}</p>
                  </div>
                </div>
              </td>
              <td className="px-6 py-1.5">
                <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[10px] font-black rounded-lg uppercase tracking-wider">
                  {item.type}
                </span>
              </td>
              <td className="px-6 py-1.5">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-[13px] font-bold text-slate-600">
                    <Phone size={12} className="text-slate-300" /> {item.phone}
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
                    <Mail size={12} className="text-slate-300" /> {item.email}
                  </div>
                </div>
              </td>
              <td className="px-6 py-1.5 text-right">
                <div className="flex justify-end gap-1.5 transition-all">
                  <button 
                    onClick={(e) => { e.stopPropagation(); onEdit(item); }}
                    className="p-1.5 text-slate-400 hover:text-emerald-600 transition-all"
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

