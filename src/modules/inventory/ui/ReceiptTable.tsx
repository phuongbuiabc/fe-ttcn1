import React from 'react';
import { Package, Calendar, Truck, DollarSign } from 'lucide-react';
import { motion } from 'motion/react';

interface ReceiptTableProps {
  receipts: any[];
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
              transition={{ delay: i * 0.05 }}
              className="hover:bg-slate-50 transition-colors cursor-default"
            >
              <td className="px-6 py-4">
                <div className="flex items-center gap-4">
                  <div className="w-9 h-9 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center font-black text-[10px]">
                    IN
                  </div>
                  <div>
                    <p className="text-sm font-black text-slate-800 leading-none">{rec.supply_id}</p>
                    <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-tighter">#{rec.receipt_id}</p>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 text-center">
                <div className="flex items-center justify-center gap-2 text-slate-500">
                  <Calendar size={14} />
                  <span className="text-xs font-bold">{rec.date}</span>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2 text-slate-500">
                  <Truck size={14} />
                  <span className="text-xs font-bold text-slate-600">{rec.supplier}</span>
                </div>
              </td>
              <td className="px-6 py-4 text-center">
                <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-black rounded-lg">
                  {rec.quantity} {rec.unit}
                </span>
              </td>
              <td className="px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-1 text-emerald-600 font-black tracking-tighter">
                  <DollarSign size={14} />
                  <span className="text-sm">{rec.price?.toLocaleString()} đ</span>
                </div>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
