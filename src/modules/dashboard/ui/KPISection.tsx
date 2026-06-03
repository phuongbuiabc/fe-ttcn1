'use client';

import React, { useEffect } from 'react';
import { KPICard } from '@/shared/components/KPICard';
import { useDashboard } from '../hooks/useDashboard';
import { Users, PiggyBank, Baby, Calendar, Wheat, UserCheck } from 'lucide-react';

export function SummarySection() {
  const { summary, loadingSummary, fetchSummary } = useDashboard();

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  if (!summary) {
    return (
      <div className="flex flex-nowrap overflow-x-auto gap-2 pb-1">
        {[...Array(9)].map((_, i) => (
          <div key={i} className="min-w-[110px] flex-1">
            <KPICard label="..." value={0} loading />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-nowrap overflow-x-auto gap-2 pb-1">
      <div className="min-w-[110px] flex-1">
        <KPICard
          label="Tổng Heo"
          value={summary.totalPigs}
          icon={PiggyBank}
          tone="emerald"
        />
      </div>
      <div className="min-w-[110px] flex-1">
        <KPICard
          label="Nái"
          value={summary.totalSows}
          icon={PiggyBank}
          tone="blue"
        />
      </div>
      <div className="min-w-[110px] flex-1">
        <KPICard
          label="Nọc"
          value={summary.totalBoars}
          icon={PiggyBank}
          tone="amber"
        />
      </div>
      <div className="min-w-[110px] flex-1">
        <KPICard
          label="Heo Con"
          value={summary.totalPiglets}
          icon={Baby}
          tone="rose"
        />
      </div>
      <div className="min-w-[110px] flex-1">
        <KPICard
          label="Theo mẹ"
          value={summary.unweanedPiglets}
          icon={Baby}
          tone="slate"
        />
      </div>
      <div className="min-w-[110px] flex-1">
        <KPICard
          label="Cai sữa"
          value={summary.weanedPiglets}
          icon={Baby}
          tone="slate"
        />
      </div>
      <div className="min-w-[110px] flex-1">
        <KPICard
          label="Mang thai"
          value={summary.pregnantPigs}
          icon={Calendar}
          tone="emerald"
        />
      </div>
      <div className="min-w-[110px] flex-1">
        <KPICard
          label="Thức Ăn(KG)"
          value={summary.totalFeedStock}
          icon={Wheat}
          tone="blue"
        />
      </div>
      <div className="min-w-[110px] flex-1">
        <KPICard
          label="Nhân Viên"
          value={summary.totalEmployees}
          icon={UserCheck}
          tone="amber"
        />
      </div>
    </div>
  );
}