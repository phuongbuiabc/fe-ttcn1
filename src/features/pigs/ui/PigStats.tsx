// components/features/pigs/PigStats.tsx
'use client'

import React from 'react';
import { PigStats as PigStatsType } from '@/shared/types';
import { PawPrint, CheckCircle, AlertTriangle, Syringe, TrendingUp } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

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
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {statItems.map((stat, idx) => (
        <div key={idx} className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-1.5">
            <div className={cn(
              "p-1.5 rounded-lg",
              stat.color === 'emerald' ? "bg-emerald-50 text-emerald-600" :
              stat.color === 'rose' ? "bg-rose-50 text-rose-600" : "bg-blue-50 text-blue-600"
            )}>
              <stat.icon size={16} />
            </div>
            {idx === 0 && (
              <div className="flex items-center text-emerald-600 text-[9px] font-bold gap-0.5 bg-emerald-50 px-1.5 py-0.5 rounded-full">
                <TrendingUp size={10} /> +12%
              </div>
            )}
          </div>
          <p className="text-slate-500 text-[9px] font-bold uppercase tracking-wider mb-0.5">{stat.label}</p>
          <h3 className="text-lg font-black text-slate-900 leading-none">{stat.value}</h3>
        </div>
      ))}
    </div>
  );
}

