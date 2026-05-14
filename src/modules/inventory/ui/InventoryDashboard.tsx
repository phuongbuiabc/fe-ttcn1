import React, { useMemo } from 'react';
import { Package, Plus, AlertTriangle, History } from 'lucide-react';
import { cn } from '@/shared/utils/utils';
import { motion } from 'motion/react';
import { Supply, SupplyLoss } from '../model/inventory.model';

interface InventoryDashboardProps {
  supplies: Supply[];
  lossHistory: SupplyLoss[];
}

export function InventoryDashboard({ supplies, lossHistory }: InventoryDashboardProps) {
  const stats = useMemo(() => {
    const totalMaterials = supplies.length;
    const totalStock = supplies.reduce((sum, item) => sum + (item.quantity || 0), 0);
    const totalLossQty = lossHistory.reduce((sum, item) => sum + (item.quantity || 0), 0);
    const lowStockCount = supplies.filter(item => item.quantity < 10).length;

    return { totalMaterials, totalStock, totalLossQty, lowStockCount };
  }, [supplies, lossHistory]);

  const cards = [
    { label: "Tổng loại vật tư", value: stats.totalMaterials, icon: Package, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100/50" },
    { label: "Tổng tồn kho", value: stats.totalStock, icon: Plus, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100/50" },
    { label: "Tổng hao hụt", value: stats.totalLossQty, icon: AlertTriangle, color: "text-rose-600", bg: "bg-rose-50", border: "border-rose-100/50" },
    { label: "Cần nhập thêm", value: stats.lowStockCount, icon: History, color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-100/50" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {cards.map((s, i) => (
        <motion.div 
          key={i} 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className={cn(
            "bg-white p-7 rounded-[2.5rem] border shadow-sm transition-all hover:shadow-xl hover:-translate-y-1 group",
            s.border
          )}
        >
          <div className="flex justify-between items-start">
            <div className={cn("p-4 rounded-2xl transition-transform group-hover:scale-110 duration-500", s.bg)}>
              <s.icon className={s.color} size={24} />
            </div>
            <div className="text-right">
              <span className="text-3xl font-black text-slate-900 tracking-tight">
                {s.value.toLocaleString()}
              </span>
              <p className="mt-1 text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.label}</p>
            </div>
          </div>
          <div className="mt-6 h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: "70%" }}
              transition={{ duration: 1.5, delay: i * 0.2 }}
              className={cn("h-full rounded-full", s.color.replace('text', 'bg'))}
            />
          </div>
        </motion.div>
      ))}
    </div>
  );
}
