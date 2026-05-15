'use client';

import React, { useState, useMemo } from 'react';
import { PigResponse } from '@/modules/pig/model/pig.model';
import { Eye, Edit, Trash2, X } from 'lucide-react';
import { cn } from '@/shared/utils/utils';
import { PigType } from '@/shared/enums/pig.enum';
import { BaseSearch } from '@/shared/components/search';
import { BaseSelect, SelectOption } from '@/shared/components/filter';
import { PIG_TYPE_OPTIONS, PIG_STATUS_OPTIONS } from '@/modules/pig/utils/pig.mapper';

interface PigTableProps {
  pigs: PigResponse[];
  loading: boolean;
  onEdit: (pig: PigResponse) => void;
  onDelete: (id: string) => void;
  onView: (pig: PigResponse) => void;
}

export function PigTable({ pigs, loading, onEdit, onDelete, onView }: PigTableProps) {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterType, setFilterType] = useState<string>('');
  const [filterBreed, setFilterBreed] = useState<string>('');

  // Helper function to get pig type label
  const getPigTypeLabel = (type: string): string => {
    const option = PIG_TYPE_OPTIONS.find(opt => opt.value === type);
    return option?.label || type;
  };

  // Get unique breeds from pigs
  const uniqueBreeds = useMemo(() => {
    const breeds = new Set(pigs.map((p) => p.breedName).filter(Boolean));
    return Array.from(breeds).sort();
  }, [pigs]);

  // Type options for filter
  const typeOptions: SelectOption[] = [
    { label: 'Nái', value: PigType.NAI },
    { label: 'Nọc', value: PigType.NOC },
    { label: 'Thịt', value: PigType.THIT },
  ];

  // Breed options for filter
  const breedOptions: SelectOption[] = uniqueBreeds.map((breed) => ({
    label: breed,
    value: breed,
  }));

  // Filter pigs based on search and filters
  const filteredPigs = useMemo(() => {
    return pigs.filter((pig) => {
      const searchMatch =
        !searchTerm ||
        pig.earTag?.toLowerCase().includes(searchTerm.toLowerCase());
      const typeMatch = !filterType || pig.type === filterType;
      const breedMatch = !filterBreed || pig.breedName === filterBreed;
      return searchMatch && typeMatch && breedMatch;
    });
  }, [pigs, searchTerm, filterType, filterBreed]);

  const hasActiveFilters = filterType || filterBreed;


  if (loading && pigs.length === 0) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Search and Filter Section */}
      <div className="px-6 py-4 bg-white border-b border-slate-100 flex gap-3 items-center">
        <div className="flex-1 max-w-xs">
          <BaseSearch
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Tìm kiếm theo số tai..."
          />
        </div>

        <div className="flex gap-2 items-center">
          <BaseSelect
            value={filterType}
            onChange={setFilterType}
            options={typeOptions}
            placeholder="Loại"
            className="border-slate-200 text-xs font-semibold text-slate-700 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
          />
        </div>

        <div className="flex gap-2 items-center">
          <BaseSelect
            value={filterBreed}
            onChange={setFilterBreed}
            options={breedOptions}
            placeholder="Giống"
            className="border-slate-200 text-xs font-semibold text-slate-700 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
          />
        </div>

        {hasActiveFilters && (
          <button
            onClick={() => {
              setFilterType('');
              setFilterBreed('');
            }}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-xs font-semibold flex items-center gap-1 transition"
          >
            <X size={14} />
            Xóa bộ lọc
          </button>
        )}
      </div>

      {/* Table */}
      <div className="responsive-table max-h-[65vh] overflow-y-auto overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead className="sticky top-0 z-10 bg-slate-50/95 backdrop-blur">
          <tr>
            <th className="px-6 py-3 text-[9px] font-black text-slate-900 uppercase">Số Tai</th>
            <th className="px-6 py-3 text-[9px] font-black text-slate-900 uppercase">Loại</th>
            <th className="px-6 py-3 text-[9px] font-black text-slate-900 uppercase">Giống</th>
            <th className="px-6 py-3 text-[9px] font-black text-slate-900 uppercase">Nguồn</th>
            <th className="px-6 py-3 text-[9px] font-black text-slate-900 uppercase text-center">Số vú</th>
            <th className="px-6 py-3 text-[9px] font-black text-slate-900 uppercase text-center">Cân nặng</th>
            <th className="px-6 py-3 text-[9px] font-black text-slate-900 uppercase text-center">Ngày sinh</th>
            <th className="px-6 py-3 text-[9px] font-black text-slate-900 uppercase text-right">Thao tác</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-50">
          {filteredPigs.map((pig) => (
            <tr
              key={pig.id}
              className="bg-white hover:bg-slate-50 transition-all cursor-pointer"
              onClick={() => onView(pig)}
            >
              {/* EARTAG */}
              <td className="px-6 py-3">
                <p className="font-bold text-[10px] text-slate-900">
                  {pig.earTag || '--'}
                </p>
              </td>

              {/* TYPE */}
              <td className="px-6 py-3">
                <span className="font-bold text-xs text-slate-700">
                  {getPigTypeLabel(pig.type)}
                </span>
              </td>

              {/* BREED */}
              <td className="px-6 py-3">
                <span className="text-xs text-slate-700">
                  {pig.breedName || '--'}
                </span>
              </td>

              {/* ORIGIN */}
              <td className="px-6 py-3">
                <span className="text-xs text-slate-600">
                  {pig.origin || '--'}
                </span>
              </td>

              {/* NIPPLE COUNT */}
              <td className="px-6 py-3 text-center">
                <span className="text-xs text-slate-700">
                  {pig.nippleCount ?? '--'}
                </span>
              </td>

              {/* BIRTH WEIGHT */}
              <td className="px-6 py-3 text-center">
                <span className="font-bold text-sm">
                  {pig.birthWeight ?? '--'}
                </span>
                <span className="ml-1 text-[10px] text-slate-900">kg</span>
              </td>

              {/* BIRTH DATE */}
              <td className="px-6 py-3 text-center text-xs text-slate-600">
                {pig.birthDate
                  ? new Date(pig.birthDate).toLocaleDateString('vi-VN')
                  : '--'}
              </td>

              {/* ACTION */}
              <td className="px-6 py-3 text-right">
                <div className="flex justify-end gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onView(pig);
                    }}
                    className="text-slate-400 hover:text-emerald-600"
                  >
                    <Eye size={16} />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(pig);
                    }}
                    className="text-slate-400 hover:text-blue-600"
                  >
                    <Edit size={16} />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(pig.id);
                    }}
                    className="text-slate-400 hover:text-rose-600"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
}