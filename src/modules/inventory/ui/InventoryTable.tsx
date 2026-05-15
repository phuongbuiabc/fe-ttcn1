import React from 'react';
import { Trash2, Edit, AlertTriangle } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/shared/utils/utils';
import { Supply, MaterialType } from '@/modules/inventory/model/inventory.model';
import { useAuth } from '@/shared/components/AuthProvider';

interface InventoryTableProps {
  supplies: Supply[];
  loading: boolean;
  onEdit: (item: Supply) => void;
  onDelete: (item: Supply) => void;
  onView: (item: Supply) => void;
  onLoss: (item: Supply) => void;
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
  onView,
  onLoss
}: InventoryTableProps) {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN' || user?.role === 'OWNER';

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
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: i * 0.03 }} 
              onClick={() => onView(item)} 
              className="hover:bg-slate-50/80 transition-all group cursor-pointer relative"
            >
              <td className="px-6 py-5">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-11 h-11 rounded-2xl flex items-center justify-center font-black text-sm shadow-sm transition-transform group-hover:scale-110", 
                    item.quantity < 10 ? "bg-rose-50 text-rose-500 shadow-rose-100" : "bg-emerald-50 text-emerald-600 shadow-emerald-100"
                  )}>
                    {item.name?.charAt(0).toUpperCase() || 'V'}
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-slate-800 leading-none group-hover:text-emerald-600 transition-colors">{item.name}</p>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">ID: {item.id?.slice(0, 8)}</p>
                  </div>
                </div>
              </td>
              <td className="px-6 py-5">
                <span className="px-3 py-1.5 bg-slate-100/50 text-slate-500 text-[9px] font-black rounded-lg border border-slate-200/50 uppercase tracking-widest">
                  {materialTypeLabels[item.materialType] || item.materialType}
                </span>
              </td>

              <td className="px-8 py-5 text-center">
                <div className="flex flex-col items-center justify-center">
                  <div className="flex items-center gap-2">
                    {item.quantity < 10 && (
                      <motion.div
                        animate={{ opacity: [1, 0.4, 1], scale: [1, 1.2, 1] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                      >
                        <AlertTriangle size={14} className="text-rose-500" />
                      </motion.div>
                    )}
                    <span className={cn("text-xl font-black tracking-tight", item.quantity < 10 ? "text-rose-500" : "text-emerald-600")}>
                      {item.quantity.toLocaleString()}
                    </span>
                  </div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">{item.unit}</span>
                </div>
              </td>
              <td className="px-8 py-5 text-right">
                <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                  <button 
                    onClick={(e) => { e.stopPropagation(); onLoss(item); }} 
                    className="p-2.5 bg-white text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl shadow-sm border border-slate-100 transition-all"
                    title="Báo hao hụt"
                  >
                    <AlertTriangle size={18}/>
                  </button>
                  {isAdmin && (
                    <>
                      <button 
                        onClick={(e) => { e.stopPropagation(); onEdit(item); }} 
                        className="p-2.5 bg-white text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl shadow-sm border border-slate-100 transition-all"
                      >
                        <Edit size={18}/>
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); onDelete(item); }} 
                        className="p-2.5 bg-white text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl shadow-sm border border-slate-100 transition-all"
                      >
                        <Trash2 size={18}/>
                      </button>
                    </>
                  )}
                </div>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
