'use client';

import React, { useMemo, useState } from 'react';
import { Eye, Edit, Trash2, GitBranch, ArrowRightLeft } from 'lucide-react';

import { BaseSearch } from '@/shared/components/search';
import { PigletHerdResponse } from '@/modules/pigletherds/model/pigletherd.model';
import { PigletHerdStatus } from '@/shared/enums/pigletherd.enum';

interface Props {
   data: PigletHerdResponse[];
   loading?: boolean;
   onView: (item: PigletHerdResponse) => void;
   onEdit: (item: PigletHerdResponse) => void;
   onDelete: (id: string) => void;
   onSplit: (item: PigletHerdResponse) => void;
   onTransfer: (item: PigletHerdResponse) => void;
}

export function PigletHerdTable({
   data,
   loading,
   onView,
   onEdit,
   onDelete,
   onSplit,
   onTransfer,
}: Props) {
  const [search, setSearch] = useState('');

  const filteredData = useMemo(() => {
    if (!search.trim()) return data;

    const keyword = search.toLowerCase();

    return data.filter((item) =>
      [
        item.herdName,
        item.penName,
        item.motherBreed,
        item.fatherEarTag,
        item.fatherBreed,
        String(item.litterNumber),
      ]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(keyword))
    );
  }, [data, search]);

  const renderStatusBadge = (status?: PigletHerdStatus) => {
    if (status === PigletHerdStatus.UNWEANED) {
      return (
        <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-semibold text-amber-700">
          Theo mẹ
        </span>
      );
    }

    if (status === PigletHerdStatus.WEANED) {
      return (
        <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
          Cai sữa
        </span>
      );
    }

    return <span className="text-slate-500">{status || '--'}</span>;
  };

  if (loading) {
    return <div className="p-4 text-center text-sm">Đang tải...</div>;
  }

  if (!data.length) {
    return <div className="p-4 text-center text-sm">Không có dữ liệu</div>;
  }

  return (
    <div className="space-y-3">

      {/* SEARCH */}
      <div className="px-6 py-4 bg-white border-b border-slate-100 flex items-center">
        <div className="w-full max-w-xs">
          <BaseSearch
            value={search}
            onChange={setSearch}
            placeholder="Tìm kiếm đàn, chuồng, giống..."
          />
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto rounded-2xl border border-slate-100 bg-white max-h-[420px] overflow-y-auto">
        <table className="w-full border-separate border-spacing-0 text-left text-sm [&_th]:border-0 [&_td]:border-0">
          <thead className="sticky top-0 z-10 bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-[10px] font-black uppercase tracking-wider text-slate-400">Tên đàn</th>
              <th className="px-4 py-3 text-[10px] font-black uppercase tracking-wider text-slate-400">Chuồng</th>
              <th className="px-4 py-3 text-[10px] font-black uppercase tracking-wider text-slate-400">Giống mẹ</th>
              <th className="px-4 py-3 text-[10px] font-black uppercase tracking-wider text-slate-400">Bố</th>
              <th className="px-4 py-3 text-[10px] font-black uppercase tracking-wider text-slate-400">Giống bố</th>
              <th className="px-4 py-3 text-[10px] font-black uppercase tracking-wider text-slate-400">Lứa</th>
              <th className="px-4 py-3 text-[10px] font-black uppercase tracking-wider text-slate-400">Số lượng</th>
              <th className="px-4 py-3 text-[10px] font-black uppercase tracking-wider text-slate-400">Cân TB (kg)</th>
              <th className="px-4 py-3 text-[10px] font-black uppercase tracking-wider text-slate-400">Ngày sinh</th>
              <th className="px-4 py-3 text-[10px] font-black uppercase tracking-wider text-slate-400">Trạng thái</th>
              <th className="px-4 py-3 text-center text-[10px] font-black uppercase tracking-wider text-slate-400">Thao tác</th>
            </tr>
          </thead>

          <tbody>
            {filteredData.map((item) => (
              <tr
                key={item.id}
                className="cursor-pointer transition hover:bg-slate-50"
                onClick={() => onView(item)}
              >
                <td className="px-4 py-3 font-semibold text-slate-800">{item.herdName}</td>
                <td className="px-4 py-3 text-slate-600">{item.penName || '--'}</td>
                <td className="px-4 py-3 text-slate-600">{item.motherBreed || '--'}</td>
                <td className="px-4 py-3 text-slate-600">{item.fatherEarTag || '--'}</td>
                <td className="px-4 py-3 text-slate-600">{item.fatherBreed || '--'}</td>
                <td className="px-4 py-3 text-slate-600">{item.litterNumber}</td>
                <td className="px-4 py-3 text-slate-600">{item.quantity}</td>
                <td className="px-4 py-3 text-slate-600">{item.averageBirthWeight ?? '--'}</td>
                <td className="px-4 py-3 text-slate-600">
                  {item.birthDate ? new Date(item.birthDate).toLocaleDateString() : '--'}
                </td>
                <td className="px-4 py-3 text-slate-600">
                  {renderStatusBadge(item.status)}
                </td>

                 <td className="px-4 py-3 text-right">
                   <div className="flex justify-end gap-2">

                     <button
                       onClick={(e) => {
                         e.stopPropagation();
                         onView(item);
                       }}
                       className="rounded-full p-2 text-slate-400 hover:bg-slate-50 hover:text-emerald-600"
                     >
                       <Eye size={14} />
                     </button>

                     <button
                       onClick={(e) => {
                         e.stopPropagation();
                         onSplit(item);
                       }}
                     >
                       <GitBranch size={14} />
                     </button>

                     <button
                       onClick={(e) => {
                         e.stopPropagation();
                         onTransfer(item);
                       }}
                       className="rounded-full p-2 text-slate-400 hover:bg-slate-50 hover:text-blue-600"
                     >
                       <ArrowRightLeft size={14} />
                     </button>

                     {/* <button
                       onClick={(e) => {
                         e.stopPropagation();
                         onEdit(item);
                       }}
                       className="rounded-full p-2 text-slate-400 hover:bg-slate-50 hover:text-blue-600"
                     >
                       <Edit size={14} />
                     </button> */}

                     <button
                       onClick={(e) => {
                         e.stopPropagation();
                         onDelete(item.id);
                       }}
                       className="rounded-full p-2 text-slate-400 hover:bg-slate-50 hover:text-rose-600"
                     >
                       <Trash2 size={14} />
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