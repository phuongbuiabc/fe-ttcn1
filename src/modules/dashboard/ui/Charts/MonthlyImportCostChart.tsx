'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useDashboard } from '@/modules/dashboard/hooks/useDashboard';
import { MonthlyImportCost } from '@/modules/dashboard/model/monthlyimportcost.model';

const ResponsiveContainer = dynamic(() => import('recharts').then(mod => mod.ResponsiveContainer), { ssr: false });
const BarChart = dynamic(() => import('recharts').then(mod => mod.BarChart), { ssr: false });
const Bar = dynamic(() => import('recharts').then(mod => mod.Bar), { ssr: false });
const XAxis = dynamic(() => import('recharts').then(mod => mod.XAxis), { ssr: false });
const YAxis = dynamic(() => import('recharts').then(mod => mod.YAxis), { ssr: false });
const CartesianGrid = dynamic(() => import('recharts').then(mod => mod.CartesianGrid), { ssr: false });
const Tooltip = dynamic(() => import('recharts').then(mod => mod.Tooltip), { ssr: false });

const monthLabels = ['Th1', 'Th2', 'Th3', 'Th4', 'Th5', 'Th6', 'Th7', 'Th8', 'Th9', 'Th10', 'Th11', 'Th12'];

export function MonthlyImportCostChart() {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const { monthlyImportCost, loadingMonthlyImportCost, fetchMonthlyImportCost } = useDashboard();

  useEffect(() => {
    fetchMonthlyImportCost(selectedYear);
  }, [selectedYear, fetchMonthlyImportCost]);

  const getMonthLabel = (monthStr: string): string => {
    const parts = monthStr.split(/[\/\-]/);
    const monthNum = parseInt(parts[0], 10);
    if (!isNaN(monthNum) && monthNum >= 1 && monthNum <= 12) {
      return monthLabels[monthNum - 1];
    }
    const match = monthStr.match(/(?:tháng|thang|month)[\s]*(\d+)/i);
    if (match) {
      const monthNum = parseInt(match[1], 10);
      if (!isNaN(monthNum) && monthNum >= 1 && monthNum <= 12) {
        return monthLabels[monthNum - 1];
      }
    }
    return monthStr;
  };

  const chartData = monthlyImportCost.map((item: MonthlyImportCost) => ({
    month: getMonthLabel(item.month),
    totalCost: item.totalCost,
  }));

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight leading-tight font-headline">Chi phí nhập theo tháng</h2>
          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold mt-0.5">Chi phí nhập nguyên liệu hàng tháng (triệu đồng)</p>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-[10px] font-bold text-slate-600">Năm:</label>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="text-[10px] px-2 py-1 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            {[currentYear - 1, currentYear, currentYear + 1].map((year) => (
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
              tickFormatter={(value) => `${value / 1000000}`}
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
                return [`${numValue / 1000000} triệu`, 'Chi phí'];
              }}
            />
            <Bar dataKey="totalCost" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}