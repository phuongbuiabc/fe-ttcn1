import React, { useMemo } from 'react';
import { Package, Plus, Scale, AlertTriangle } from 'lucide-react';
import { cn } from '@/shared/utils/utils';
import { motion } from 'motion/react';
import { Supply } from '@/modules/inventory/model/inventory.model';

interface InventoryDashboardProps {
  supplies: Supply[];
}

export function InventoryDashboard({ supplies }: InventoryDashboardProps) {
  const stats = useMemo(() => {
    const totalFeed = supplies
      .filter(item => item.materialType === 'FEED')
      .reduce((sum, item) => sum + (item.quantity || 0), 0);

    const totalVaccine = supplies
      .filter(item => item.materialType === 'VACCINE')
      .reduce((sum, item) => sum + (item.quantity || 0), 0);

    const totalMedicine = supplies
      .filter(item => item.materialType === 'MEDICINE')
      .reduce((sum, item) => sum + (item.quantity || 0), 0);

    const lowStockCount = supplies.filter(item => item.quantity < 10).length;

    return { totalFeed, totalVaccine, totalMedicine, lowStockCount };
  }, [supplies]);

  const cards = [
    { label: "Thức ăn tồn kho", value: stats.totalFeed, unit: "Kg", icon: Package, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100/50" },
    { label: "Vaccine tồn kho", value: stats.totalVaccine, unit: "Liều", icon: Plus, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100/50" },
    { label: "Thuốc thú y tồn", value: stats.totalMedicine, unit: "Chai", icon: Scale, color: "text-violet-600", bg: "bg-violet-50", border: "border-violet-100/50" },
    { label: "Cần nhập gấp", value: stats.lowStockCount, unit: "Loại", icon: AlertTriangle, color: "text-rose-600", bg: "bg-rose-50", border: "border-rose-100/50" },
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
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mt-1">{s.unit}</span>
              <p className="mt-1.5 text-[9px] font-black text-slate-400 uppercase tracking-widest">{s.label}</p>
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
