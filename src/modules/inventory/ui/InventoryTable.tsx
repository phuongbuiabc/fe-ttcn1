import React from 'react';
import { Trash2, Edit, AlertTriangle } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/shared/utils/utils';
import { Supply, MaterialType } from '@/modules/inventory/model/inventory.model';

interface InventoryTableProps {
  supplies: Supply[];
  loading: boolean;
  onEdit: (item: Supply) => void;
  onDelete: (item: Supply) => void;
  onView: (item: Supply) => void;
}

const materialTypeLabels: Record<string, string> = {
  [MaterialType.FEED]: "Thức ăn",
  [MaterialType.VACCINE]: "Vaccine",
  [MaterialType.MEDICINE]: "Thuốc",
};

export function InventoryTable({ 
  supplies, 
  loading, 
  onEdit, 
  onDelete,
  onView 
}: InventoryTableProps) {
  if (loading) {
    return (
      <div className="py-20 text-center font-black text-slate-400 uppercase tracking-widest">
        Đang đồng bộ kho...
      </div>
    );
  }

  return (
    <div className="responsive-table">
      <table className="w-full text-left">
        <thead className="bg-slate-50/50">
          <tr>
            <th className="px-6 py-3 text-[10px] font-black text-slate-900 uppercase tracking-widest leading-none">Vật tư / Sản phẩm</th>
            <th className="px-6 py-3 text-[10px] font-black text-slate-900 uppercase tracking-widest leading-none">Phân loại hàng</th>
            <th className="px-6 py-3 text-[10px] font-black text-slate-900 uppercase tracking-widest leading-none text-center">Số lượng</th>
            <th className="px-6 py-3 text-[10px] font-black text-slate-900 uppercase tracking-widest leading-none text-right">Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {supplies.map((item, i) => (
            <motion.tr 
              key={item.id} 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              transition={{ delay: i * 0.02 }} 
              onClick={() => onView(item)} 
              className="hover:bg-slate-50 transition-all group cursor-pointer"
            >
              <td className="px-6 py-3">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs", 
                    item.quantity < 10 ? "bg-rose-50 text-rose-500" : "bg-emerald-50 text-emerald-600"
                  )}>
                    {item.name?.charAt(0) || 'V'}
                  </div>
                  <div>
                    <p className="text-sm font-black text-slate-800 leading-none">{item.name}</p>
                  </div>

                </div>
              </td>
              <td className="px-6 py-3">
                <span className="px-3 py-1 bg-slate-50 text-slate-500 text-[10px] font-black rounded-lg border border-slate-100 uppercase tracking-widest">
                  {materialTypeLabels[item.materialType] || item.materialType}
                </span>
              </td>

              <td className="px-8 py-3.5 text-center">
                <span className={cn("text-lg font-black tracking-tighter", item.quantity < 10 ? "text-rose-500" : "text-emerald-600")}>
                  {item.quantity}
                </span>
                <span className="ml-1.5 text-[10px] font-black text-slate-400 uppercase">{item.unit}</span>
              </td>
              <td className="px-8 py-3.5 text-right">
                <div className="flex justify-end gap-2 transition-all">
                  <button 
                    onClick={(e) => { e.stopPropagation(); onEdit(item); }} 
                    className="p-2.5 text-slate-400 hover:text-blue-600 transition-all"
                  >
                    <Edit size={18}/>
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); onDelete(item); }} 
                    className="p-2.5 text-slate-400 hover:text-rose-600 transition-all"
                  >
                    <Trash2 size={18}/>
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
