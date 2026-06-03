'use client';

import React, { useEffect } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';

import { useDashboard } from '@/modules/dashboard/hooks/useDashboard';

export function WeightDistributionChart() {
  const { weightDistribution, fetchWeightDistribution } = useDashboard();

  useEffect(() => {
    fetchWeightDistribution();
  }, [fetchWeightDistribution]);

  return (
    <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
      <div className="mb-4">
        <h2 className="font-headline text-base font-bold tracking-tight text-slate-900">
          Phân bố trọng lượng đàn (KG)
        </h2>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={weightDistribution}
            layout="vertical"
            margin={{
              top: 5,
              right: 20,
              left: 10,
              bottom: 5,
            }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#f1f5f9"
            />

            <XAxis
              type="number"
              axisLine={false}
              tickLine={false}
              tick={{
                fill: '#94a3b8',
                fontSize: 10,
                fontWeight: 600,
              }}
            />

            <YAxis
              type="category"
              dataKey="label"
              width={80}
              axisLine={false}
              tickLine={false}
              tick={{
                fill: '#64748b',
                fontSize: 10,
                fontWeight: 700,
              }}
            />

            <Tooltip
              cursor={{
                fill: 'rgba(16,185,129,0.06)',
              }}
              contentStyle={{
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                boxShadow:
                  '0 10px 15px -3px rgb(0 0 0 / 0.1)',
              }}
              formatter={(value) => [
                `${value}`,
                'Số lượng',
              ]}
            />

            <Bar
              dataKey="count"
              fill="#10b981"
              radius={[0, 8, 8, 0]}
              barSize={18}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default WeightDistributionChart;