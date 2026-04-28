'use client';

import React, { useState, useEffect, useMemo } from "react";
import {
  Plus,
  Search,
  ArrowRightLeft
} from "lucide-react";

import { PenDetail } from "@/modules/pens/ui/PenDetail";
import { usePathname } from "next/navigation";
import { getPageTitle } from "@/shared/utils/getPageTitle";

// Components
import { TransferPigModal } from "@/modules/pens/ui/TransferPigModal";
import { PenTable } from "@/modules/pens/ui/PenTable";
import { PenForm } from "@/modules/pens/ui/PenForm";

// API Hook
import { useArea } from "@/modules/area/hooks/useArea";
import { usePen } from "@/modules/pens/hooks/usePen";

// ENUM
import { PenStatus } from "@/shared/enums/pen.enum";

// TYPE
import { PenResponse } from "@/modules/pens/model/pen.model";

export default function PenPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);

  const [sectionFilter, setSectionFilter] = useState<string>("ALL");
  const [typeFilter, setTypeFilter] = useState<string>("ALL");

  const [openForm, setOpenForm] = useState(false);
  const [editingPen, setEditingPen] = useState<PenResponse | null>(null);
  const [selectedPenId, setSelectedPenId] = useState<string | null>(null);
  const [isDetailMode, setIsDetailMode] = useState(false);

  // ✅ PEN API
  const {
    pens,
    penDetail,
    loadingList,
    loadingDetail,
    fetchPens,
    fetchPenDetail,
    deletePen,
    createPen,
    updatePen
  } = usePen();

  // ✅ AREA API
  const {
    areas,
    loading: areaLoading,
    fetchAreas,
  } = useArea();

  const pathname = usePathname();
  const title = getPageTitle(pathname);

  useEffect(() => {
    fetchPens();
    fetchAreas();
  }, [fetchPens, fetchAreas]);

  // 👉 map areaId → name
  const areaMap = useMemo(() => {
    const map: Record<string, string> = {};
    areas.forEach(a => {
      map[a.id] = a.name;
    });
    return map;
  }, [areas]);

  // 👉 filter options
  const sectionOptions = [
    { label: "Tất cả", value: "ALL" },
    ...areas.map(a => ({
      label: a.name,
      value: a.id,
    })),
  ];

  const typeOptions = [
    { label: "Tất cả", value: "ALL" },
    ...Array.from(new Set(pens.map(i => i.penType)))
      .filter(Boolean)
      .map(t => ({
        label: t,
        value: t,
      })),
  ];

  // 👉 filter logic
  const filteredItems = useMemo(() => {
    return pens.filter(item => {
      const areaName = areaMap[item.areaId] || "";

      const matchSearch =
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        areaName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchSection =
        sectionFilter === "ALL" || item.areaId === sectionFilter;

      const matchType =
        typeFilter === "ALL" || item.penType === typeFilter;

      return matchSearch && matchSection && matchType;
    });
  }, [pens, searchTerm, sectionFilter, typeFilter, areaMap]);

  // 👉 handlers
  const handleEdit = (pen: PenResponse) => {
    setEditingPen(pen);
    setOpenForm(true);
  };

  const handleDelete = async (id: string) => {
    await deletePen(id);
  };

  const handleCreate = async (data: any) => {
    await createPen(data);
    setOpenForm(false);
  };

  const handleUpdate = async (data: any) => {
    if (!editingPen) return;
    await updatePen(editingPen.id, data);
    setEditingPen(null);
    setOpenForm(false);
  };

  return (
    <div className="space-y-4 pb-20 bg-[#fbfcfd] min-h-screen -m-4 p-4">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-extrabold uppercase">{title}</h1>

        <div className="flex gap-2">
          <button
            onClick={() => {
              setEditingPen(null);
              setOpenForm(true);
            }}
            className="px-4 py-2 bg-white border rounded-xl text-xs flex items-center gap-2"
          >
            <Plus size={14} /> Thêm chuồng
          </button>

          <button
            onClick={() => setIsTransferModalOpen(true)}
            className="px-5 py-2 bg-emerald-600 text-white rounded-full flex items-center gap-2"
          >
            <ArrowRightLeft size={14} /> Điều chuyển
          </button>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          {
            label: "Đang sử dụng",
            value: pens.filter(i => i.status === PenStatus.IN_USE).length
          },
          {
            label: "Trống",
            value: pens.filter(i => i.status === PenStatus.EMPTY).length
          },
          {
            label: "Bảo trì",
            value: pens.filter(i => i.status === PenStatus.MAINTENANCE).length
          }
        ].map((stat, i) => (
          <div key={i} className="bg-white p-4 rounded-xl border shadow-sm">
            <p className="text-xs text-gray-400">{stat.label}</p>
            <h3 className="text-xl font-bold">{stat.value}</h3>
          </div>
        ))}
      </div>

      {/* FILTER */}
      <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-xl">

        <div className="flex gap-2 items-center">
          Khu vực:
          <select
            value={sectionFilter}
            onChange={(e) => setSectionFilter(e.target.value)}
            disabled={areaLoading}
            className="px-2 py-1 border rounded text-sm"
          >
            {sectionOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          Chuồng:
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-2 py-1 border rounded text-sm"
          >
            {typeOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="relative ml-auto">
          <Search className="absolute left-2 top-2" size={14} />
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm chuồng..."
            className="pl-7 pr-3 py-1 bg-gray-50 rounded text-sm"
          />
        </div>
      </div>

      {/* TABLE */}
      <div className={`grid gap-4 ${isDetailMode ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
        <div className="bg-white rounded-xl overflow-hidden">
          <PenTable
            pens={filteredItems}
            loading={loadingList}
            onView={async (p) => {
              if (p.id === selectedPenId && isDetailMode) return;
              setSelectedPenId(p.id);
              setIsDetailMode(true);
              await fetchPenDetail(p.id);
            }}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>

        {isDetailMode && (
          <div className="bg-white rounded-xl p-4 overflow-y-auto max-h-[80vh]">
            <PenDetail
              pen={penDetail}
              loading={loadingDetail}
              onClose={() => setIsDetailMode(false)}
            />
          </div>
        )}
      </div>

      {/* FORM CREATE / UPDATE */}
      <PenForm
        open={openForm}
        onClose={() => {
          setOpenForm(false);
          setEditingPen(null);
        }}
        onSubmit={editingPen ? handleUpdate : handleCreate}
        initialData={editingPen}
      />

      {/* MODAL TRANSFER */}
      <TransferPigModal
        isOpen={isTransferModalOpen}
        onClose={() => setIsTransferModalOpen(false)}
        barns={pens as any}
      />
    </div>
  );
}