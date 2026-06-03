import React from 'react';
import { cn } from '@/shared/utils/utils';
import { BaseSearch } from '@/shared/components/search';

interface InventoryFiltersProps {
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  activeType: string;
  setActiveType: (val: string) => void;
}

export function InventoryFilters({
  searchTerm,
  setSearchTerm,
  activeType,
  setActiveType,
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
          {materialTypes.map((type) => (
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
        </div>

        <BaseSearch
          value={searchTerm}
          onChange={setSearchTerm}
          className="w-full lg:w-72"
        />
      </div>
    </div>
  );
}
