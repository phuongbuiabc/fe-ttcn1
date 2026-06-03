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
      <div className="col-span-12 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {[...Array(9)].map((_, i) => (
          <KPICard key={i} label="..." value={0} loading />
        ))}
      </div>
    );
  }

  return (
    <div className="col-span-12 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      <KPICard
        label="Tổng Heo"
        value={summary.totalPigs}
        icon={PiggyBank}
        tone="emerald"
      />
      <KPICard
        label="Nái"
        value={summary.totalSows}
        icon={Users}
        tone="blue"
      />
      <KPICard
        label="Nọc"
        value={summary.totalBoars}
        icon={Users}
        tone="amber"
      />
      <KPICard
        label="Heo Con"
        value={summary.totalPiglets}
        icon={Baby}
        tone="rose"
      />
      <KPICard
        label="Theo mẹ"
        value={summary.unweanedPiglets}
        icon={Baby}
        tone="slate"
      />
      <KPICard
        label="Cai sữa"
        value={summary.weanedPiglets}
        icon={Baby}
        tone="slate"
      />
      <KPICard
        label="Mang thai"
        value={summary.pregnantPigs}
        icon={Calendar}
        tone="emerald"
      />
      <KPICard
        label="Thức Ăn"
        value={summary.totalFeedStock}
        icon={Wheat}
        tone="blue"
        subtitle="kg"
      />
      <KPICard
        label="Nhân Viên"
        value={summary.totalEmployees}
        icon={UserCheck}
        tone="amber"
      />
    </div>
  );
}