'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useDashboard } from '@/modules/dashboard/hooks/useDashboard';
import { MonthlyLiveBirths } from '@/modules/dashboard/model/monthlylivebirths';

const ResponsiveContainer = dynamic(() => import('recharts').then(mod => mod.ResponsiveContainer), { ssr: false });
const BarChart = dynamic(() => import('recharts').then(mod => mod.BarChart), { ssr: false });
const Bar = dynamic(() => import('recharts').then(mod => mod.Bar), { ssr: false });
const XAxis = dynamic(() => import('recharts').then(mod => mod.XAxis), { ssr: false });
const YAxis = dynamic(() => import('recharts').then(mod => mod.YAxis), { ssr: false });
const CartesianGrid = dynamic(() => import('recharts').then(mod => mod.CartesianGrid), { ssr: false });
const Tooltip = dynamic(() => import('recharts').then(mod => mod.Tooltip), { ssr: false });

export function MonthlyLiveBirthsChart() {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const { monthlyLiveBirths, loadingMonthlyLiveBirths, fetchMonthlyLiveBirths } = useDashboard();

  useEffect(() => {
    fetchMonthlyLiveBirths(selectedYear);
  }, [selectedYear, fetchMonthlyLiveBirths]);

  const getMonthLabel = (monthStr: string | number): string => {
    const str = String(monthStr).trim();
    const monthNum = parseInt(str, 10);
    if (!isNaN(monthNum) && monthNum >= 1 && monthNum <= 12) {
      return `Tháng ${monthNum}`;
    }
    const parts = str.split(/[-\/]/);
    const firstNum = parseInt(parts[0], 10);
    if (!isNaN(firstNum) && firstNum >= 1 && firstNum <= 12) {
      return `Tháng ${firstNum}`;
    }
    const match = str.match(/(?:tháng|thang|month)[\s]*(\d+)/i);
    if (match) {
      const m = parseInt(match[1], 10);
      if (!isNaN(m) && m >= 1 && m <= 12) {
        return `Tháng ${m}`;
      }
    }
    return str;
  };

  const chartData = monthlyLiveBirths.map((item: MonthlyLiveBirths) => ({
    month: getMonthLabel(item.month),
    alivePigletCount: item.alivePigletCount,
  }));

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight leading-tight font-headline">Năng suất sinh sản hàng tháng</h2>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-[10px] font-bold text-slate-600">Năm:</label>
         <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="rounded-md border border-slate-300 px-2 py-1 text-[10px] focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            {Array.from({ length: 6 }, (_, index) => currentYear - index).map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94a3b8', fontSize: 9, fontWeight: 700 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94a3b8', fontSize: 9, fontWeight: 700 }}
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
                return [`${numValue} con`, 'Lợn con'];
              }}
            />
            <Bar dataKey="alivePigletCount" fill="#10b981" radius={[4, 4, 0, 0]} barSize={40} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
