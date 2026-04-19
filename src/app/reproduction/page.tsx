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
import { cn } from "@/shared/lib/utils";
import { 
  BarChart, 
  Bar, 
  ResponsiveContainer,
  Cell
} from "recharts";

// Custom Features
import { useReproduction } from "@/features/reproduction/hooks/use-reproduction";
import { SowTable } from "@/features/reproduction/ui/SowTable";
import { ReproductionStats } from "@/features/reproduction/ui/ReproductionStats";

// Feature Modals
import { MatingFormModal } from "@/features/reproduction/ui/MatingFormModal";
import { PregnancyFormModal } from "@/features/reproduction/ui/PregnancyFormModal";
import { FarrowingFormModal } from "@/features/reproduction/ui/FarrowingFormModal";

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
    <div className="space-y-6 pb-20 bg-[#fbfcfd] min-h-screen -m-6 p-6 ">
      {/* Smart Alerts */}
      <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-rose-50 border border-rose-100 p-6 rounded-[2rem] flex items-center gap-6 shadow-sm">
        <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-rose-500 shadow-sm shadow-rose-200/50"><AlertTriangle size={28} /></div>
        <div className="flex-1">
          <p className="font-black text-rose-900 uppercase tracking-tight">Cảnh báo: 4 nái quá hạn dự kiến đẻ</p>
          <p className="text-xs font-bold text-rose-700/60 uppercase mt-1">Cần kiểm tra ngay các nái đã vượt quá 114 ngày mang thai.</p>
        </div>
        <button className="bg-rose-500 px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest text-white shadow-lg shadow-rose-900/10 hover:bg-rose-600 transition-all active:scale-95">Xử lý ngay</button>
      </motion.div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight font-headline">Quản lý Sinh sản</h1>
        </div>
        <div className="flex gap-4">
          <button onClick={refresh} className="px-5 py-2.5 bg-white text-slate-600 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-slate-100 shadow-sm hover:bg-slate-50 transition-all"><RefreshCw size={16} className={loading ? "animate-spin" : ""} /></button>
          <button onClick={() => setIsModalOpen(true)} className="px-8 py-3.5 bg-[#00a67d] text-white rounded-full text-sm font-bold shadow-lg shadow-emerald-900/10 flex items-center gap-2 active:scale-95 transition-all">
            <PlusCircle size={18} /> Phối giống mới
          </button>
        </div>
      </div>

      <ReproductionStats stats={stats} />

      <div className="flex flex-col lg:flex-row gap-10">
        <div className="flex-1 space-y-6">
          <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col md:flex-row gap-6 items-center justify-between">
            <div className="relative flex-1 w-full">
              <SearchIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input type="text" placeholder="Tìm mã nái, giống..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-14 pr-6 py-4 bg-slate-50 border-none rounded-[1.5rem] text-sm font-bold text-slate-700 focus:ring-2 focus:ring-[#00a67d]/10 outline-none" />
            </div>
            <div className="flex gap-2">
              <button onClick={() => setIsPregnancyModalOpen(true)} className="px-6 py-3.5 bg-blue-50 text-blue-600 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-blue-100 transition-all active:scale-95"><CheckCircle2 size={16} /> Kiểm thai</button>
              <button onClick={() => setIsFarrowingModalOpen(true)} className="px-6 py-3.5 bg-emerald-50 text-[#00a67d] rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-[#e2f7f1] transition-all active:scale-95"><Baby size={16} /> Ghi nhận đẻ</button>
            </div>
          </div>

          <div className="bg-white rounded-[1.75rem] border border-slate-100 shadow-sm overflow-hidden min-h-[400px]">
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
        <aside className="lg:w-96 space-y-8">
          {selectedSow && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-[#003d2e] text-white p-10 rounded-[1.75rem] shadow-2xl space-y-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl" />
              <div className="flex justify-between items-start relative z-10">
                <div>
                  <h4 className="text-4xl font-black tracking-tight">{selectedSow.id}</h4>
                  <p className="text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em] mt-2">{selectedSow.breed}</p>
                </div>
                <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center border border-white/10 shadow-inner"><PawPrint size={28} /></div>
              </div>

              <div className="space-y-6 relative z-10">
                <div className="p-6 bg-white/10 rounded-[2rem] border border-white/10 shadow-inner">
                  <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-3">Giai đoạn hiện tại</p>
                  <p className="text-xl font-bold">{selectedSow.status}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-6 bg-white/10 rounded-[2rem] border border-white/10">
                    <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-2">Chuồng</p>
                    <p className="text-lg font-black">{selectedSow.pen}</p>
                  </div>
                  <div className="p-6 bg-white/10 rounded-[2rem] border border-white/10">
                    <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-2">Tiến độ</p>
                    <p className="text-lg font-black">{selectedSow.progress}%</p>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-white/10 relative z-10">
                <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-6">Biểu đồ sinh sản (6 tháng)</p>
                <div className="h-32 w-full">
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

