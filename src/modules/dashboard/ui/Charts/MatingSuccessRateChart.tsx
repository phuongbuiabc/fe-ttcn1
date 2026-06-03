'use client';

import React, { useEffect } from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

import { useDashboard } from '@/modules/dashboard/hooks/useDashboard';

export function MatingSuccessRateChart() {
  const { matingSuccessRate, fetchMatingSuccessRate } = useDashboard();

  useEffect(() => {
    fetchMatingSuccessRate();
  }, [fetchMatingSuccessRate]);

  const successRate =
    typeof matingSuccessRate?.successRate === 'number'
      ? matingSuccessRate.successRate
      : 0;

  const matingData = [
    {
      name: 'Thành công',
      value: successRate,
      color: '#3b82f6',
    },
    {
      name: 'Thất bại',
      value: Math.max(100 - successRate, 0),
      color: '#cbd5e1',
    },
  ];

  return (
    <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
      <div className="mb-4">
        <h2 className="font-headline text-base font-bold tracking-tight text-slate-900">
          Tỷ lệ thụ tinh thành công
        </h2>
      </div>

      <div className="flex h-40 items-center justify-around">
        <div className="relative h-32 w-32">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={matingData}
                dataKey="value"
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={50}
                paddingAngle={2}
                strokeWidth={0}
              >
                {matingData.map((entry) => (
                  <Cell
                    key={entry.name}
                    fill={entry.color}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xl font-black text-slate-900">
              {successRate.toFixed(1)}%
            </span>
            <span className="text-[8px] font-bold uppercase text-slate-400">
              Thành công
            </span>
          </div>
        </div>

        <div className="space-y-3">
          {matingData.map((item) => (
            <div
              key={item.name}
              className="flex items-center gap-2"
            >
              <div
                className="h-2.5 w-2.5 rounded-sm"
                style={{
                  backgroundColor: item.color,
                }}
              />

              <div>
                <p className="text-[8px] font-bold uppercase text-slate-600">
                  {item.name}
                </p>

                <p className="text-xs font-extrabold text-slate-900">
                  {item.value.toFixed(1)}%
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MatingSuccessRateChart;