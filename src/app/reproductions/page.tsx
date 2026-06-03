"use client";

import React, { useState } from "react";
import { 
  PlusCircle, 
  RefreshCw,
  Activity,
  Mars,
  BarChart3,
} from "lucide-react";
import { cn } from "@/shared/utils/utils";

// Custom Features

import { useReproduction } from "@/modules/reproduction/hooks/useReproduction";
import { SowTable } from "@/modules/pig/ui/SowTable";
import KPICard from "@/shared/components/KPICard";
import { PigType, PigStatus } from "@/shared/enums/pig.enum";
import type { SowResponse } from "@/modules/pig/model/pig.model";
import { FarrowingDetail } from "@/modules/pig/ui/farrowingDetail";

// Feature Modals
import MatingForm from "@/modules/mating/ui/MatingForm";
import { SemenTable } from "@/modules/semen/ui/semenTable";
import { SemenForm } from "@/modules/semen/ui/semenForm";
import {MatingTable} from "@/modules/mating/ui/MatingTable";

export default function ReproductionManagementPage() {
  const { sows, stats, loading, refresh } = useReproduction();
  const [selectedSowId, setSelectedSowId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"farrowing" | "pregnancy" | "sows">("pregnancy");
  
  // Modals Status
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSemenFormOpen, setIsSemenFormOpen] = useState(false);
  const [refreshSemenKey, setRefreshSemenKey] = useState(0);
  const [refreshMatingKey, setRefreshMatingKey] = useState(0);

  const handleSemenFormSuccess = () => {
    setRefreshSemenKey((prev) => prev + 1);
  };

  const sowTableData: SowResponse[] = sows.map((sow) => ({
    id: sow.id,
    earTag: sow.earTag || sow.id,
    type: PigType.NAI,
    species: sow.breed,
    breedName: sow.breed,
    totalPregnancies: 0,
    miscarriageCount: 0,
    status: PigStatus.ACTIVE,
  }));

  const selectedSow = sows.find((s) => s.id === selectedSowId) || null;

  return (
    <div className="space-y-4 pb-20 bg-[#fbfcfd] min-h-screen -m-4 p-4 ">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-lg font-extrabold text-slate-800 tracking-tight font-headline uppercase leading-none">Quản lý Sinh sản</h1>
        </div>
        <div className="flex gap-2">
          <button onClick={refresh} className="px-4 py-2 bg-white text-slate-600 rounded-xl text-[9px] font-black uppercase tracking-widest border border-slate-100 shadow-sm hover:bg-slate-50 transition-all"><RefreshCw size={14} className={loading ? "animate-spin" : ""} /></button>
          <button onClick={() => setIsModalOpen(true)} className="px-5 py-2.5 bg-[#00a67d] text-white rounded-full text-[11px] font-bold shadow-lg shadow-emerald-900/10 flex items-center gap-1.5 active:scale-95 transition-all">
            <PlusCircle size={14} /> Phối giống mới
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <KPICard
          label="Tổng số nái"
          value={stats.totalSows}
          icon={Activity}
          tone="emerald"
        />
        <KPICard
          label="Số nọc"
          value={stats.totalBoars}
          icon={Mars}
          tone="slate"
        />
        <KPICard
          label="Tỉ lệ đậu thai"
          value={`${stats.conceptionRate}%`}
          icon={BarChart3}
          tone="blue"
        />
      </div>

      <div className="flex flex-col gap-4">
        <div className="min-w-0 space-y-4">
          <div className="bg-white p-2 rounded-2xl border border-slate-100 shadow-sm inline-flex gap-2">
            
            <button
              onClick={() => setActiveTab("pregnancy")}
              className={cn(
                "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                activeTab === "pregnancy"
                  ? "bg-blue-50 text-blue-700"
                  : "text-slate-500 hover:bg-slate-50"
              )}
            >
              Phối giống
            </button>

            <button
              onClick={() => setActiveTab("sows")}
              className={cn(
                "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                activeTab === "sows"
                  ? "bg-[#00a67d] text-white shadow-lg shadow-emerald-900/10"
                  : "text-slate-500 hover:bg-slate-50"
              )}
            >
              Nái
            </button>

            <button
              onClick={() => setActiveTab("farrowing")}
              className={cn(
                "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                activeTab === "farrowing"
                  ? "bg-emerald-50 text-emerald-700"
                  : "text-slate-500 hover:bg-slate-50"
              )}
            >
              Nọc
            </button>
          </div>

          {activeTab === "sows" ? (
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden min-h-[300px]">
              <SowTable
                sows={sowTableData}
                loading={loading}
                selectedSowId={selectedSowId}
                expandedContent={<FarrowingDetail sow={selectedSow} />}
                onView={(sow) =>
                  setSelectedSowId((prev) => (prev === sow.id ? null : sow.id))
                }
              />
            </div>
          ) : activeTab === "farrowing" ? (
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden min-h-[300px]">
              <SemenTable key={refreshSemenKey} onAddClick={() => setIsSemenFormOpen(true)} />
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden min-h-[300px]">
              <MatingTable key={refreshMatingKey} />
            </div>
          )}
        </div>

      </div>

      {/* Feature Modals */}
      <MatingForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => setRefreshMatingKey((prev) => prev + 1)}
      />
      <SemenForm isOpen={isSemenFormOpen} onClose={() => setIsSemenFormOpen(false)} onSuccess={handleSemenFormSuccess} />
    </div>
  );
}

