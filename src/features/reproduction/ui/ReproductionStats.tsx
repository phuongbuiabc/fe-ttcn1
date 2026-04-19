import React from "react";
import { 
  PlusCircle, 
  Baby, 
  AlertTriangle, 
  CheckCircle2, 
  Activity,
  BarChart3
} from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { ReproductionStats as StatsType } from "@/shared/types";

interface ReproductionStatsProps {
  stats: StatsType;
}

export const ReproductionStats: React.FC<ReproductionStatsProps> = ({ stats }) => {
  const cards = [
    { label: "Tổng số nái", value: stats.totalSows, icon: Activity, color: "emerald" },
    { label: "Đang mang thai", value: stats.pregnantSows, icon: CheckCircle2, color: "emerald" },
    { label: "Sắp đẻ (7 ngày)", value: stats.farrowingSoon, icon: AlertTriangle, color: "rose" },
    { label: "Lứa đẻ tháng này", value: stats.monthlyLitters, icon: Baby, color: "emerald" },
    { label: "Tỉ lệ đậu thai", value: `${stats.conceptionRate}%`, icon: BarChart3, color: "emerald" },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
      {cards.map((card, idx) => (
        <div key={idx} className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className={cn(
            "absolute top-0 right-0 w-8 h-8 opacity-5 -mr-2 -mt-2 transition-transform group-hover:scale-110",
            card.color === "emerald" ? "text-emerald-600" : "text-rose-600"
          )}>
            <card.icon size={32} />
          </div>
          <p className="text-[9px] uppercase font-bold text-slate-400 mb-1 tracking-wider">{card.label}</p>
          <div className="flex items-baseline gap-2">
            <h3 className={cn(
              "text-lg font-black font-headline",
              card.color === "rose" ? "text-rose-600" : "text-emerald-900"
            )}>
              {card.value}
            </h3>
          </div>
        </div>
      ))}
    </div>
  );
};

