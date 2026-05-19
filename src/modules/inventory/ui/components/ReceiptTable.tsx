import React from 'react';
import { Package, Calendar, Truck, DollarSign } from 'lucide-react';
import { motion } from 'motion/react';
import { ReceiptHistoryItem } from '../../model/inventory.model';

interface ReceiptTableProps {
  receipts: ReceiptHistoryItem[];
  loading: boolean;
}

export function ReceiptTable({ receipts, loading }: ReceiptTableProps) {
  if (loading) {
    return (
      <div className="py-20 text-center font-black text-slate-400 uppercase tracking-widest">
        Đang tải lịch sử nhập...
      </div>
    );
  }

  if (receipts.length === 0) {
    return (
      <div className="py-20 text-center">
        <Package size={48} className="mx-auto text-slate-200 mb-4" />
        <p className="font-black text-slate-400 uppercase tracking-widest text-sm">Chưa có lịch sử nhập kho</p>
      </div>
    );
  }

  return (
    <div className="responsive-table">
      <table className="w-full text-left">
        <thead className="bg-slate-50/50">
          <tr>
            <th className="px-6 py-4 text-[10px] font-black text-slate-900 uppercase tracking-widest leading-none">Vật tư / Mã phiếu</th>
            <th className="px-6 py-4 text-[10px] font-black text-slate-900 uppercase tracking-widest leading-none text-center">Ngày nhập</th>
            <th className="px-6 py-4 text-[10px] font-black text-slate-900 uppercase tracking-widest leading-none">Nhà cung cấp</th>
            <th className="px-6 py-4 text-[10px] font-black text-slate-900 uppercase tracking-widest leading-none text-center">Số lượng</th>
            <th className="px-6 py-4 text-[10px] font-black text-slate-900 uppercase tracking-widest leading-none text-right">Giá nhập</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {receipts.map((rec, i) => (
            <motion.tr 
              key={rec.id} 
              initial={{ opacity: 0, x: -10 }} 
              animate={{ opacity: 1, x: 0 }} 
              transition={{ delay: i * 0.04 }}
              className="hover:bg-slate-50/80 transition-all group cursor-default"
            >
              <td className="px-6 py-5">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center font-black text-[10px] shadow-sm">
                    IN
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-slate-800 leading-none">{rec.supply_id}</p>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Mã: {rec.receipt_id?.slice(0, 8)}</p>
                  </div>
                </div>
              </td>
              <td className="px-6 py-5 text-center">
                <div className="flex items-center justify-center gap-2 text-slate-400">
                  <Calendar size={13} />
                  <span className="text-xs font-bold text-slate-600">
                    {new Date(rec.date).toLocaleDateString('vi-VN')}
                  </span>
                </div>
              </td>
              <td className="px-6 py-5">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-blue-50 flex items-center justify-center text-blue-400">
                    <Truck size={12} />
                  </div>
                  <span className="text-xs font-bold text-slate-600 uppercase tracking-tight">{rec.supplier}</span>
                </div>
              </td>
              <td className="px-6 py-5 text-center">
                <span className="px-3 py-1.5 bg-blue-50 text-blue-600 text-[11px] font-black rounded-xl border border-blue-100/50">
                  {rec.quantity.toLocaleString()} {rec.unit}
                </span>
              </td>
              <td className="px-6 py-5 text-right">
                <div className="flex items-center justify-end gap-1 text-emerald-600 font-black tracking-tighter">
                  <span className="text-sm">{(rec.price || 0).toLocaleString('vi-VN')}</span>
                  <span className="text-[10px] uppercase font-bold text-emerald-500/70">đ</span>
                </div>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
