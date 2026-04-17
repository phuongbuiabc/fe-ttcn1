// components/features/pigs/PigStats.tsx
'use client'

import React from 'react';
import { PigStats as PigStatsType } from '@/types';
import { PawPrint, CheckCircle, AlertTriangle, Syringe, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PigStatsProps {
  stats: PigStatsType;
}

export function PigStats({ stats }: PigStatsProps) {
  const statItems = [
    { label: "Tổng số lượng", value: stats.total, icon: PawPrint, color: "emerald" },
    { label: "Khỏe mạnh", value: stats.healthy, icon: CheckCircle, color: "emerald" },
    { label: "Đang bệnh", value: stats.sick, icon: AlertTriangle, color: "rose" },
    { label: "Đang điều trị", value: stats.treating, icon: Syringe, color: "blue" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {statItems.map((stat, idx) => (
        <div key={idx} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className={cn(
              "p-2.5 rounded-2xl",
              stat.color === 'emerald' ? "bg-emerald-50 text-emerald-600" :
              stat.color === 'rose' ? "bg-rose-50 text-rose-600" : "bg-blue-50 text-blue-600"
            )}>
              <stat.icon size={22} />
            </div>
            {idx === 0 && (
              <div className="flex items-center text-emerald-600 text-[10px] font-bold gap-0.5 bg-emerald-50 px-2 py-1 rounded-full">
                <TrendingUp size={12} /> +12%
              </div>
            )}
          </div>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">{stat.label}</p>
          <h3 className="text-2xl font-black text-slate-900">{stat.value}</h3>
        </div>
      ))}
    </div>
  );
}
