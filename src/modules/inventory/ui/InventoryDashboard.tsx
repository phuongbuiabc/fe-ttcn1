import React, { useMemo } from 'react';
import { Package, Plus, AlertTriangle, History } from 'lucide-react';
import { cn } from '@/shared/utils/utils';
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
    { label: "Tổng loại vật tư", value: stats.totalMaterials, icon: Package, color: "text-emerald-500", bg: "bg-emerald-50" },
    { label: "Tổng tồn kho", value: stats.totalStock, icon: Plus, color: "text-blue-500", bg: "bg-blue-50" },
    { label: "Tổng hao hụt", value: stats.totalLossQty, icon: AlertTriangle, color: "text-rose-500", bg: "bg-rose-50" },
    { label: "Cần nhập thêm", value: stats.lowStockCount, icon: History, color: "text-amber-500", bg: "bg-amber-50" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {cards.map((s, i) => (
        <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm transition-all hover:shadow-md">
          <div className="flex justify-between items-start">
            <div className={cn("p-3 rounded-2xl", s.bg)}>
              <s.icon className={s.color} size={20} />
            </div>
            <span className="text-2xl font-black text-slate-900">{s.value}</span>
          </div>
          <p className="mt-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.label}</p>
        </div>
      ))}
    </div>
  );
}
