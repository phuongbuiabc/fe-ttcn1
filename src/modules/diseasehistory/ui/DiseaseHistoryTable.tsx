'use client';

import React, { useMemo, useState } from "react";
import { cn } from "@/shared/utils/utils";
import { X } from "lucide-react";
import { Pencil, CheckCircle2, XCircle, Trash2 } from "lucide-react";

import { BaseSearch } from "@/shared/components/search";
import { BaseSelect, SelectOption } from "@/shared/components/Filter";

import { DiseaseHistoryResponse } from "../model/diseasehistory.model";
import { DiseaseHistoryStatus } from "@/shared/enums/diseasehistory.enum";
import { mapDiseaseHistoryStatus } from "@/modules/diseasehistory/utils/DiseaseHistory.mapper";

import { useDiseaseHistory } from "@/modules/diseasehistory/hooks/useDiseasehistory";

interface DiseaseHistoryTableProps {
  diseaseHistories: DiseaseHistoryResponse[];
  loading: boolean;
  onView?: (history: DiseaseHistoryResponse) => void;
  onEdit?: (history: DiseaseHistoryResponse) => void;
}

const formatDate = (value?: string) => {
  if (!value) return "--";
  return new Date(value).toLocaleDateString("vi-VN");
};

const statusOptions: SelectOption[] = [
  { label: "Tất cả", value: "" },
  { label: "Đang bệnh", value: DiseaseHistoryStatus.FOLLOWING },
  { label: "Đã khỏi", value: DiseaseHistoryStatus.RECOVERED },
  { label: "Đã chết", value: DiseaseHistoryStatus.DECEASED },
];

export function DiseaseHistoryTable({
  diseaseHistories,
  loading,
  onView,
  onEdit,
}: DiseaseHistoryTableProps) {

  const { update, remove: deleteHistory, fetchAll } = useDiseaseHistory();

  const [earTagSearch, setEarTagSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const filteredHistories = useMemo(() => {
    const q = earTagSearch.trim().toLowerCase();

    return diseaseHistories.filter((h) => {
      const matchEarTag =
        !q || (h.pigEarTag || "").toLowerCase().includes(q);

      const matchStatus =
        !statusFilter || h.status === statusFilter;

      return matchEarTag && matchStatus;
    });
  }, [diseaseHistories, earTagSearch, statusFilter]);

  const hasActions = true;

  const handleMarkRecovered = async (id: string) => {
    await update(id, {
      status: DiseaseHistoryStatus.RECOVERED,
      recoveryDate: new Date().toISOString().split("T")[0],
    });

    fetchAll();
  };

  const handleMarkDeceased = async (id: string) => {
    await update(id, {
      status: DiseaseHistoryStatus.DECEASED,
    });

    fetchAll();
  };

  const handleDelete = async (id: string) => {
    await deleteHistory(id);
    fetchAll();
  };

  if (loading && diseaseHistories.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-emerald-600" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl overflow-hidden border border-slate-100">

      {/* FILTER */}
      <div className="px-6 py-4 border-b border-slate-100 flex gap-3 items-center">
        <div className="flex-1 max-w-xs">
          <BaseSearch
            value={earTagSearch}
            onChange={setEarTagSearch}
            placeholder="Tìm theo số tai..."
          />
        </div>

        <BaseSelect
          value={statusFilter}
          onChange={setStatusFilter}
          options={statusOptions}
          placeholder="Trạng thái"
          className="text-xs font-semibold"
        />

        {(earTagSearch || statusFilter) && (
          <button
            onClick={() => {
              setEarTagSearch("");
              setStatusFilter("");
            }}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-xs font-semibold flex items-center gap-1"
          >
            <X size={14} />
            Xóa lọc
          </button>
        )}
      </div>

      {/* TABLE */}
      <div className="responsive-table max-h-[65vh] overflow-auto">
        <table className="w-full border-collapse text-left">
          <thead className="sticky top-0 z-10 bg-slate-50/95 backdrop-blur">
            <tr>
              <th className="px-6 py-3 text-[9px] font-black uppercase text-slate-900">Số tai</th>
              <th className="px-6 py-3 text-[9px] font-black uppercase text-slate-900">Bệnh</th>
              <th className="px-6 py-3 text-[9px] font-black uppercase text-slate-900">Mức độ</th>
              <th className="px-6 py-3 text-[9px] font-black uppercase text-slate-900">Ngày mắc</th>
              <th className="px-6 py-3 text-[9px] font-black uppercase text-slate-900">Ngày khỏi</th>
              <th className="px-6 py-3 text-center text-[9px] font-black uppercase text-slate-900">Trạng thái</th>
              <th className="px-6 py-3 text-right text-[9px] font-black uppercase text-slate-900">Thao tác</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-50">
            {filteredHistories.map((h) => (
              <tr
                key={h.id}
                className={cn("hover:bg-slate-50 transition cursor-pointer")}
                onClick={() => onView?.(h)}
              >
                <td className="px-6 py-3 font-bold text-slate-900 text-sm">{h.pigEarTag || "--"}</td>
                <td className="px-6 py-3 text-sm text-slate-700">{h.diseaseName || "--"}</td>
                <td className="px-6 py-3 text-sm text-slate-700">{h.severity || "--"}</td>
                <td className="px-6 py-3 text-sm text-slate-700">{formatDate(h.sickDate)}</td>
                <td className="px-6 py-3 text-sm text-slate-700">{formatDate(h.recoveryDate)}</td>

                <td className="px-6 py-3 text-center">
                  <span
                    className={cn(
                      "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase",
                      h.status === DiseaseHistoryStatus.FOLLOWING && "bg-emerald-50 text-emerald-600",
                      h.status === DiseaseHistoryStatus.RECOVERED && "bg-blue-50 text-blue-600",
                      h.status === DiseaseHistoryStatus.DECEASED && "bg-red-50 text-red-600"
                    )}
                  >
                    {mapDiseaseHistoryStatus(h.status as DiseaseHistoryStatus)}
                  </span>
                </td>

                <td className="px-6 py-3 text-right">
                  <div className="flex justify-end gap-3">

                    {onEdit && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEdit(h);
                        }}
                        className="text-xs font-bold text-blue-600"
                      >
                        <Pencil size={16} />
                      </button>
                    )}

                    {h.status !== DiseaseHistoryStatus.RECOVERED && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMarkRecovered(h.id);
                        }}
                        className="text-xs font-bold text-emerald-600"
                      >
                        <CheckCircle2 size={16} />
                      </button>
                    )}

                    {h.status !== DiseaseHistoryStatus.DECEASED && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMarkDeceased(h.id);
                        }}
                        className="text-xs font-bold text-red-600"
                      >
                        <XCircle size={16} />
                      </button>
                    )}

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(h.id);
                      }}
                      className="text-xs font-bold text-gray-500"
                    >
                      <Trash2 size={16} />
                    </button>

                  </div>
                </td>
              </tr>
            ))}

            {filteredHistories.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center py-10 text-xs text-slate-400 font-semibold">
                  Không có dữ liệu phù hợp
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}