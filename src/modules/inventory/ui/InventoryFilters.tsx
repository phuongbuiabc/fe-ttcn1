import React from 'react';
import { Search } from 'lucide-react';
import { cn } from '@/shared/utils/utils';

interface InventoryFiltersProps {
  activeTab: string;
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  activeType: string;
  setActiveType: (val: string) => void;
  dateRange: { start: string; end: string };
  setDateRange: (val: any) => void;
}

export function InventoryFilters({
  activeTab,
  searchTerm,
  setSearchTerm,
  activeType,
  setActiveType,
  dateRange,
  setDateRange
}: InventoryFiltersProps) {
  const materialTypes = ["Tất cả", "FEED", "VACCINE", "MEDICINE"];
  const typeLabels: Record<string, string> = {
    "Tất cả": "Tất cả",
    "FEED": "Thức ăn",
    "VACCINE": "Vaccine",
    "MEDICINE": "Thuốc"
  };

  return (
    <div className="bg-white p-4 rounded-[1.75rem] border border-slate-100 shadow-sm space-y-4">
      <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 w-full lg:w-auto no-scrollbar">
          {activeTab === "inventory" && materialTypes.map((type) => (
            <button
              key={type}
              onClick={() => setActiveType(type)}
              className={cn(
                "px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border",
                activeType === type 
                  ? "bg-slate-900 border-slate-900 text-white shadow-lg shadow-slate-900/20" 
                  : "bg-white border-slate-100 text-slate-400 hover:border-slate-300"
              )}
            >
              {typeLabels[type] || type}
            </button>
          ))}

          {activeTab !== "inventory" && (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-3 px-5 py-2.5 bg-slate-50 rounded-xl border border-slate-100 transition-all focus-within:border-slate-300 focus-within:bg-white">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Từ</span>
                <input 
                  type="date" 
                  value={dateRange.start} 
                  onChange={e => setDateRange({...dateRange, start: e.target.value})} 
                  className="bg-transparent border-none text-[11px] font-bold outline-none text-slate-700 cursor-pointer"
                />
              </div>
              <div className="flex items-center gap-3 px-5 py-2.5 bg-slate-50 rounded-xl border border-slate-100 transition-all focus-within:border-slate-300 focus-within:bg-white">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Đến</span>
                <input 
                  type="date" 
                  value={dateRange.end} 
                  onChange={e => setDateRange({...dateRange, end: e.target.value})} 
                  className="bg-transparent border-none text-[11px] font-bold outline-none text-slate-700 cursor-pointer"
                />
              </div>
            </div>
          )}
        </div>

        <div className="relative w-full lg:w-72">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            placeholder="Tìm kiếm..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-6 py-3.5 bg-slate-50 border-none rounded-[1.25rem] text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-slate-900/5 transition-all"
          />
        </div>
      </div>
    </div>
  );
}
