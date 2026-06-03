'use client';

import React, { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useDashboard } from '@/modules/dashboard/hooks/useDashboard';

const ResponsiveContainer = dynamic(() => import('recharts').then(mod => mod.ResponsiveContainer), { ssr: false });
const BarChart = dynamic(() => import('recharts').then(mod => mod.BarChart), { ssr: false });
const Bar = dynamic(() => import('recharts').then(mod => mod.Bar), { ssr: false });
const XAxis = dynamic(() => import('recharts').then(mod => mod.XAxis), { ssr: false });
const YAxis = dynamic(() => import('recharts').then(mod => mod.YAxis), { ssr: false });
const CartesianGrid = dynamic(() => import('recharts').then(mod => mod.CartesianGrid), { ssr: false });
const Tooltip = dynamic(() => import('recharts').then(mod => mod.Tooltip), { ssr: false });
const Cell = dynamic(() => import('recharts').then(mod => mod.Cell), { ssr: false });

const COLORS = ['#e2e8f0', '#cbd5e1', '#94a3b8', '#64748b', '#475569', '#334155', '#10b981'];

export function WeightDistributionChart() {
  const { weightDistribution, fetchWeightDistribution } = useDashboard();

  useEffect(() => {
    fetchWeightDistribution();
  }, [fetchWeightDistribution]);

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
      <div className="mb-4">
        <h2 className="text-base font-bold text-slate-900 tracking-tight leading-tight font-headline">Phân bố trọng lượng đàn</h2>
        <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold mt-0.5">Phân bổ trọng lượng đàn (kg)</p>
      </div>
      <div className="h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={weightDistribution}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94a3b8', fontSize: 9, fontWeight: 700 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94a3b8', fontSize: 9, fontWeight: 700 }}
              tickFormatter={(value) => `${value}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                borderRadius: '12px',
                border: 'none',
                boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
              }}
              formatter={(value: any) => {
                if (value === undefined || value === null) return ['', ''];
                const numValue = typeof value === 'number' ? value : Number(value);
                return [`${numValue}`, 'Số lượng'];
              }}
            />
            <Bar dataKey="count" radius={[4, 4, 0, 0]} barSize={40}>
              {weightDistribution.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}