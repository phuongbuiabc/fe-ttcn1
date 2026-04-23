'use client';

import React, { useMemo } from 'react';
import { PigResponse } from '../model/pig.model';
import { PawPrint, CheckCircle, DollarSign, Skull } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

interface PigStatsProps {
  pigs: PigResponse[];
}

export function PigStats({ pigs }: PigStatsProps) {

  const stats = useMemo(() => {
    const total = pigs.length;

    const active = pigs.filter(p => p.status === 'ACTIVE').length;
    const sold = pigs.filter(p => p.status === 'SOLD').length;
    const dead = pigs.filter(p => p.status === 'DEAD').length;

    return {
      total,
      active,
      sold,
      dead,
    };
  }, [pigs]);

  const statItems = [
    {
      label: "Tổng số lượng",
      value: stats.total,
      icon: PawPrint,
      color: "emerald",
    },
    {
      label: "Đang nuôi",
      value: stats.active,
      icon: CheckCircle,
      color: "emerald",
    },
    {
      label: "Đã bán",
      value: stats.sold,
      icon: DollarSign,
      color: "blue",
    },
    {
      label: "Đã chết",
      value: stats.dead,
      icon: Skull,
      color: "rose",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {statItems.map((stat, idx) => (
        <div
          key={idx}
          className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm"
        >
          <div className="flex items-center justify-between mb-1.5">
            <div
              className={cn(
                "p-1.5 rounded-lg",
                stat.color === 'emerald' && "bg-emerald-50 text-emerald-600",
                stat.color === 'rose' && "bg-rose-50 text-rose-600",
                stat.color === 'blue' && "bg-blue-50 text-blue-600"
              )}
            >
              <stat.icon size={16} />
            </div>
          </div>

          <p className="text-slate-500 text-[9px] font-bold uppercase">
            {stat.label}
          </p>

          <h3 className="text-lg font-black text-slate-900">
            {stat.value}
          </h3>
        </div>
      ))}
    </div>
  );
}