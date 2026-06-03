"use client";

import React, { useMemo, useState } from "react";
import { PigCurrentResponse } from "@/modules/pig/model/pig.model";
import { BaseSearch } from "@/shared/components/search";

interface PigCurrentTableProps {
  pigs: PigCurrentResponse[];
  loading: boolean;
}

export function PigCurrentTable({
  pigs,
  loading,
}: PigCurrentTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedBreed, setSelectedBreed] = useState("");

  const types = useMemo(() => {
    const set = new Set<string>();
    pigs.forEach((p) => p.type && set.add(p.type));
    return Array.from(set);
  }, [pigs]);

  const breeds = useMemo(() => {
    const set = new Set<string>();
    pigs.forEach((p) => p.breedName && set.add(p.breedName));
    return Array.from(set);
  }, [pigs]);

  const visiblePigs = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    return pigs.filter((pig) => {
      if (selectedType && pig.type !== selectedType) return false;
      if (selectedBreed && pig.breedName !== selectedBreed) return false;

      if (!term) return true;

      return (pig.earTag || "")
        .toLowerCase()
        .includes(term);
    });
  }, [pigs, searchTerm, selectedType, selectedBreed]);

  if (loading && pigs.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-emerald-600" />
      </div>
    );
  }

  return (
    <div className="flex h-[72vh] min-h-[420px] flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white">

      {/* Filter */}
      <div className="border-b border-slate-100 px-4 py-3">
        <div className="flex flex-nowrap items-end gap-2 overflow-x-auto">

          <BaseSearch
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Nhập số tai"
            className="min-w-[300px] shrink-0"
          />

          <label className="flex min-w-[180px] items-center gap-2">
            <span className="text-[10px] font-bold uppercase text-slate-500">
              Loại
            </span>

            <select
              value={selectedType}
              onChange={(e) =>
                setSelectedType(e.target.value)
              }
              className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-500"
            >
              <option value="">Tất cả</option>

              {types.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </label>

          <label className="flex min-w-[180px] items-center gap-2">
            <span className="text-[10px] font-bold uppercase text-slate-500">
              Giống
            </span>

            <select
              value={selectedBreed}
              onChange={(e) =>
                setSelectedBreed(e.target.value)
              }
              className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-500"
            >
              <option value="">Tất cả</option>

              {breeds.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">

        <table className="w-full border-separate border-spacing-0 text-left [&_th]:border-0 [&_td]:border-0">

          <thead className="sticky top-0 z-10 bg-slate-50">
            <tr>
              {
                // define headers with alignment so numbers center under headers
                [
                  { key: 'earTag', label: 'Số tai', align: 'left' },
                  { key: 'type', label: 'Loại', align: 'left' },
                  { key: 'breed', label: 'Giống', align: 'left' },
                  { key: 'weight', label: 'Cân nặng', align: 'center' },
                  { key: 'litterLength', label: 'Dài lưng', align: 'center' },
                  { key: 'chestGirth', label: 'Vòng ngực', align: 'center' },
                  { key: 'date', label: 'Ngày đo', align: 'center' },
                  { key: 'adg', label: 'ADG/FCR', align: 'center' },
                ].map((h) => (
                  <th
                    key={h.key}
                    className={`px-6 py-4 text-[10px] font-black uppercase tracking-wider text-slate-400 ${
                      h.align === 'center' ? 'text-center' : ''
                    }`}
                  >
                    {h.label}
                  </th>
                ))
              }
            </tr>
          </thead>

          <tbody>

            {visiblePigs.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  className="py-10 text-center text-slate-500"
                >
                  Không có dữ liệu
                </td>
              </tr>
            ) : (
              visiblePigs.map((pig) => (
                <tr
                  key={pig.id}
                  className="transition hover:bg-slate-50"
                >

                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-slate-900">
                      {pig.earTag || "--"}
                    </p>
                  </td>

                  <td className="px-6 py-4 text-sm">
                    {pig.type || "--"}
                  </td>

                  <td className="px-6 py-4 text-sm">
                    {pig.breedName || "--"}
                  </td>

                  <td className="px-6 py-4 text-center">
                    {pig.weight ?? "--"} kg
                  </td>

                  <td className="px-6 py-4 text-center">
                    {pig.litterLength ?? "--"} cm
                  </td>

                  <td className="px-6 py-4 text-center">
                    {pig.chestGirth ?? "--"} cm
                  </td>

                  <td className="px-6 py-4 text-center text-sm">
                    {pig.latestTrackingDate
                      ? new Date(
                          pig.latestTrackingDate
                        ).toLocaleDateString("vi-VN")
                      : "--"}
                  </td>

                  <td className="px-6 py-4 text-center font-semibold text-emerald-600">
                    {pig.adg
                      ? pig.adg.toFixed(2)
                      : "--"}
                    /
                    {pig.fcr
                      ? pig.fcr.toFixed(2)
                      : "--"}
                  </td>

                </tr>
              ))
            )}

          </tbody>

        </table>
      </div>
    </div>
  );
}