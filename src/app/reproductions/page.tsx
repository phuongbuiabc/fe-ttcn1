"use client";

import React, { useState } from "react";
import { 
  Search as SearchIcon, 
  PlusCircle, 
  CheckCircle2, 
  Baby, 
  RefreshCw,
  AlertTriangle,
  PawPrint,
} from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/shared/utils/utils";
import {
  BarChart,
  Bar,
  ResponsiveContainer,
  Cell
} from "recharts";

// Custom Features

import { useReproduction } from "@/modules/reproduction/hooks/useReproduction";
import { SowTable } from "@/modules/reproduction/ui/SowTable";
import { ReproductionStats } from "@/modules/reproduction/ui/ReproductionStats";

// Feature Modals
import { MatingFormModal } from "@/modules/reproduction/ui/MatingFormModal";
import { PregnancyFormModal } from "@/modules/reproduction/ui/PregnancyFormModal";
import { FarrowingFormModal } from "@/modules/reproduction/ui/FarrowingFormModal";

const performanceData = [
  { name: "Tháng 6", value: 45 }, { name: "Tháng 7", value: 60 }, { name: "Tháng 8", value: 75 },
  { name: "Tháng 9", value: 40 }, { name: "Tháng 10", value: 95 }, { name: "Hiện tại", value: 80 },
];

export default function ReproductionManagementPage() {
  const { sows, stats, loading, refresh } = useReproduction();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSowId, setSelectedSowId] = useState<string | null>(null);
  
  // Modals Status
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPregnancyModalOpen, setIsPregnancyModalOpen] = useState(false);
  const [isFarrowingModalOpen, setIsFarrowingModalOpen] = useState(false);

  const filteredSows = sows.filter(s => 
    s.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.breed.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedSow = sows.find(s => s.id === selectedSowId) || sows[0];

  return (
    <div className="space-y-4 pb-20 bg-[#fbfcfd] min-h-screen -m-4 p-4 ">
      {/* Smart Alerts */}
      <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-rose-50 border border-rose-100 p-4 rounded-xl flex items-center gap-4 shadow-sm">
        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-rose-500 shadow-sm shadow-rose-200/50"><AlertTriangle size={20} /></div>
        <div className="flex-1">
          <p className="font-black text-rose-900 uppercase tracking-tight text-[11px]">Cảnh báo: 4 nái quá hạn dự kiến đẻ</p>
          <p className="text-[9px] font-bold text-rose-700/60 uppercase mt-0.5">Kiểm tra ngay nái đã vượt quá 114 ngày mang thai.</p>
        </div>
        <button className="bg-rose-500 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest text-white shadow-lg shadow-rose-900/10 hover:bg-rose-600 transition-all active:scale-95">Xử lý ngay</button>
      </motion.div>

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

      <ReproductionStats stats={stats} />

      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1 space-y-4">
          <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 w-full">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
              <input type="text" placeholder="Tìm mã nái, giống..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-9 pr-4 py-2 bg-slate-50 border-none rounded-xl text-xs font-bold text-slate-700 focus:ring-2 focus:ring-[#00a67d]/10 outline-none" />
            </div>
            <div className="flex gap-2">
              <button onClick={() => setIsPregnancyModalOpen(true)} className="px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 hover:bg-blue-100 transition-all active:scale-95"><CheckCircle2 size={14} /> Kiểm thai</button>
              <button onClick={() => setIsFarrowingModalOpen(true)} className="px-4 py-2 bg-emerald-50 text-[#00a67d] rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 hover:bg-[#e2f7f1] transition-all active:scale-95"><Baby size={14} /> Ghi nhận đẻ</button>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden min-h-[300px]">
            <SowTable 
              sows={filteredSows} 
              loading={loading}
              onView={(sow) => console.log("View sow:", sow)}
              onEdit={(sow: any) => {}}
              onDelete={(id: string) => {}}
            />
          </div>
        </div>

        {/* Sidebar Detail */}
        <aside className="lg:w-72 space-y-4">
          {selectedSow && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-[#003d2e] text-white p-6 rounded-xl shadow-2xl space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-12 -mt-12 blur-2xl" />
              <div className="flex justify-between items-start relative z-10">
                <div>
                  <h4 className="text-xl font-black tracking-tight">{selectedSow.id}</h4>
                  <p className="text-emerald-400 text-[9px] font-black uppercase tracking-[0.2em] mt-1">{selectedSow.breed}</p>
                </div>
                <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center border border-white/10 shadow-inner"><PawPrint size={20} /></div>
              </div>

              <div className="space-y-4 relative z-10">
                <div className="p-4 bg-white/10 rounded-xl border border-white/10 shadow-inner">
                  <p className="text-[8px] font-black text-emerald-400 uppercase tracking-widest mb-1.5">Giai đoạn hiện tại</p>
                  <p className="text-lg font-bold">{selectedSow.status}</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 bg-white/10 rounded-xl border border-white/10">
                    <p className="text-[8px] font-black text-emerald-400 uppercase tracking-widest mb-1">Chuồng</p>
                    <p className="text-sm font-black">{selectedSow.pen}</p>
                  </div>
                  <div className="p-4 bg-white/10 rounded-xl border border-white/10">
                    <p className="text-[8px] font-black text-emerald-400 uppercase tracking-widest mb-1">Tiến độ</p>
                    <p className="text-sm font-black">{selectedSow.progress}%</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 relative z-10">
                <p className="text-[8px] font-black text-emerald-400 uppercase tracking-widest mb-4">Biểu đồ sinh sản (6 tháng)</p>
                <div className="h-28 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={performanceData}>
                      <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                        {performanceData.map((_, i) => (
                          <Cell key={i} fill={i === 5 ? "#00f0ff" : "#005e46"} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </motion.div>
          )}

          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm text-center">
            <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-4">Lịch trình tiếp theo</p>
            <div className="space-y-3">
               {[1, 2].map(i => (
                 <div key={i} className="p-4 bg-slate-50 rounded-2xl border-l-4 border-[#00a67d] flex items-center justify-between">
                   <div className="text-left">
                     <p className="text-xs font-bold text-slate-800">Khám thai định kỳ</p>
                     <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">20/10/2024</p>
                   </div>
                   <div className="w-8 h-8 rounded-full bg-[#e2f7f1] text-[#00a67d] flex items-center justify-center font-black text-[10px]">!</div>
                 </div>
               ))}
            </div>
          </div>
        </aside>
      </div>

      {/* Feature Modals */}
      <MatingFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <PregnancyFormModal isOpen={isPregnancyModalOpen} onClose={() => setIsPregnancyModalOpen(false)} />
      <FarrowingFormModal isOpen={isFarrowingModalOpen} onClose={() => setIsFarrowingModalOpen(false)} />
    </div>
  );
}

