'use client';

import React, { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useDashboard } from '@/modules/dashboard/hooks/useDashboard';

const ResponsiveContainer = dynamic(() => import('recharts').then(mod => mod.ResponsiveContainer), { ssr: false });
const PieChart = dynamic(() => import('recharts').then(mod => mod.PieChart), { ssr: false });
const Pie = dynamic(() => import('recharts').then(mod => mod.Pie), { ssr: false });
const Cell = dynamic(() => import('recharts').then(mod => mod.Cell), { ssr: false });

export function SurvivalRateChart() {
  const { survivalRate, fetchSurvivalRate } = useDashboard();

  useEffect(() => {
    fetchSurvivalRate();
  }, [fetchSurvivalRate]);

  const latestSurvivalRate = survivalRate.length > 0 ? survivalRate[survivalRate.length - 1].aliveRate : 0;
  const survivalData = [
    { name: 'Sống', value: latestSurvivalRate, color: '#10b981' },
    { name: 'Rủi ro', value: 100 - latestSurvivalRate, color: '#e2e8f0' },
  ];

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
      <div className="mb-4">
        <h2 className="text-base font-bold text-slate-900 tracking-tight leading-tight font-headline">Tỷ lệ sống sót khi sinh</h2>
        <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold mt-0.5">Tỷ lệ sống sót lợn con khi sinh</p>
      </div>
      <div className="flex items-center justify-around h-40">
        <div className="relative w-32 h-32">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={survivalData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={50}
                paddingAngle={0}
                dataKey="value"
                startAngle={90}
                endAngle={-270}
              >
                {survivalData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xl font-black text-slate-900 leading-none">{latestSurvivalRate.toFixed(1)}%</span>
            <span className="text-[8px] font-bold text-slate-400 uppercase">Tỷ lệ</span>
          </div>
        </div>
        <div className="space-y-2">
          {survivalData.map((item) => (
            <div key={item.name} className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: item.color }}></div>
              <div className="text-left">
                <p className="text-[8px] font-bold text-slate-600 uppercase">{item.name}</p>
                <p className="text-xs font-extrabold">{item.value.toFixed(1)}%</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}