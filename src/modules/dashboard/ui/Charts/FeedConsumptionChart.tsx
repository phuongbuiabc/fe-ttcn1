'use client';

import React, { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { format, startOfWeek, addDays } from 'date-fns';
import { useDashboard } from '@/modules/dashboard/hooks/useDashboard';
import { FeedConsumption } from '@/modules/dashboard/model/feedconsumption.model';

const ResponsiveContainer = dynamic(() => import('recharts').then(mod => mod.ResponsiveContainer), { ssr: false });
const BarChart = dynamic(() => import('recharts').then(mod => mod.BarChart), { ssr: false });
const Bar = dynamic(() => import('recharts').then(mod => mod.Bar), { ssr: false });
const XAxis = dynamic(() => import('recharts').then(mod => mod.XAxis), { ssr: false });
const YAxis = dynamic(() => import('recharts').then(mod => mod.YAxis), { ssr: false });
const CartesianGrid = dynamic(() => import('recharts').then(mod => mod.CartesianGrid), { ssr: false });
const Tooltip = dynamic(() => import('recharts').then(mod => mod.Tooltip), { ssr: false });

export function FeedConsumptionChart() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const { feedConsumption, loadingFeedConsumption, fetchFeedConsumption } = useDashboard();

  const formatDate = useCallback((date: Date) => {
    return format(date, 'yyyy-MM-dd');
  }, []);

  useEffect(() => {
    fetchFeedConsumption(formatDate(selectedDate));
  }, [selectedDate, fetchFeedConsumption, formatDate]);

  const generateWeekDays = useCallback((startDate: Date) => {
    const days = [];
    const start = startOfWeek(startDate, { weekStartsOn: 1 });
    for (let i = 0; i < 7; i++) {
      days.push(addDays(start, i));
    }
    return days;
  }, []);

  const weekDays = generateWeekDays(selectedDate);

  const chartData = weekDays.map((day) => {
    const dateStr = format(day, 'yyyy-MM-dd');
    const item = feedConsumption.find((f: FeedConsumption) => f.date === dateStr);
    return {
      date: dateStr,
      dayLabel: format(day, 'EEE'),
      totalFeedAmount: item?.totalFeedAmount || 0,
    };
  });

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight leading-tight font-headline">Biểu đồ tiêu thụ thức ăn</h2>
          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold mt-0.5">Tiêu thụ thức ăn theo tuần (kg)</p>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-[10px] font-bold text-slate-600">Từ:</label>
          <input
            type="date"
            value={format(selectedDate, 'yyyy-MM-dd')}
            onChange={(e) => setSelectedDate(new Date(e.target.value))}
            className="text-[10px] px-2 py-1 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>
      <div className="h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis
              dataKey="dayLabel"
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
                return [`${numValue} kg`, 'Tiêu thụ'];
              }}
              labelFormatter={(label) => `${label}`}
            />
            <Bar dataKey="totalFeedAmount" fill="#10b981" radius={[4, 4, 0, 0]} barSize={40} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}