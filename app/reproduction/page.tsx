"use client";

import React, { useState } from "react";
import { 
  Search as SearchIcon, 
  PlusCircle, 
  CheckCircle2, 
  Baby, 
  Activity,
  X,
  Edit,
  Trash2,
  RefreshCw,
  AlertTriangle,
  PawPrint,
  ChevronRight
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { 
  BarChart, 
  Bar, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from "recharts";
import { useReproduction } from "@/hooks/use-reproduction";
import { SowTable } from "@/components/features/reproduction/SowTable";
import { ReproductionStats } from "@/components/features/reproduction/ReproductionStats";
import { SowRecord } from "@/types";

const performanceData = [
  { name: "Tháng 6", value: 45 },
  { name: "Tháng 7", value: 60 },
  { name: "Tháng 8", value: 75 },
  { name: "Tháng 9", value: 40 },
  { name: "Tháng 10", value: 95 },
  { name: "Hiện tại", value: 80 },
];

export default function ReproductionManagementPage() {
  const { sows, stats, loading, refresh, updateStatus } = useReproduction();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSowId, setSelectedSowId] = useState<string | null>(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPregnancyModalOpen, setIsPregnancyModalOpen] = useState(false);
  const [isFarrowingModalOpen, setIsFarrowingModalOpen] = useState(false);

  const filteredSows = sows.filter(s => 
    s.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.breed.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedSow = sows.find(s => s.id === selectedSowId) || sows[0];

  return (
    <div className="space-y-8 pb-20">
      {/* Smart Alerts */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-rose-50 border border-rose-100 p-4 rounded-2xl flex items-center gap-4 shadow-sm"
      >
        <div className="w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center text-rose-600">
          <AlertTriangle size={20} />
        </div>
        <div className="flex-1">
          <p className="font-headline font-bold text-sm text-rose-900">Cảnh báo: 4 nái quá hạn đẻ</p>
          <p className="text-xs text-rose-700/80">Cần kiểm tra ngay các nái đã vượt quá 114 ngày mang thai.</p>
        </div>
        <button className="bg-white px-4 py-1.5 rounded-full text-xs font-bold text-rose-600 border border-rose-100 hover:bg-rose-50 transition-colors">
          Xem chi tiết
        </button>
      </motion.div>

      {/* Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight font-headline">Quản lý Sinh sản</h1>
          <p className="text-slate-500 text-sm mt-1">Theo dõi chu kỳ phối giống, thai kỳ và lứa đẻ của đàn nái.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={refresh}
            className="px-4 py-2 bg-white text-slate-600 rounded-full text-sm font-bold flex items-center gap-2 hover:bg-slate-50 border border-slate-100 transition-colors"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} /> Làm mới
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-2 bg-gradient-to-br from-[#006c49] to-[#10b981] text-white rounded-full text-sm font-bold shadow-lg shadow-emerald-900/20 flex items-center gap-2"
          >
            <PlusCircle size={18} /> Phối giống mới
          </button>
        </div>
      </div>

      {/* stats */}
      <ReproductionStats stats={stats} />

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 space-y-6">
          {/* Search & Filter */}
          <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex gap-4 items-center">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="text" 
                placeholder="Tìm kiếm mã nái, giống..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-50 rounded-2xl border-none text-sm outline-none"
              />
            </div>
          </div>

          {/* Table Area */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden min-h-[400px]">
            <SowTable 
              sows={filteredSows} 
              loading={loading}
              onEdit={(sow) => {}}
              onDelete={(id) => {}}
            />
          </div>
        </div>

        {/* Sidebar Detail */}
        <aside className="lg:w-80 space-y-6">
          <div className="grid grid-cols-1 gap-3">
             <button 
                onClick={() => setIsPregnancyModalOpen(true)}
                className="flex items-center justify-center gap-2 bg-white text-slate-700 py-3 rounded-2xl font-bold text-xs border border-slate-100 shadow-sm hover:bg-slate-50 transition-colors"
              >
                <CheckCircle2 size={16} className="text-emerald-600" />
                Ghi nhận Thai
              </button>
              <button 
                onClick={() => setIsFarrowingModalOpen(true)}
                className="flex items-center justify-center gap-2 bg-white text-slate-700 py-3 rounded-2xl font-bold text-xs border border-slate-100 shadow-sm hover:bg-slate-50 transition-colors"
              >
                <Baby size={16} className="text-emerald-600" />
                Ghi nhận Đẻ
              </button>
          </div>

          {selectedSow && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-emerald-900 text-white p-6 rounded-3xl shadow-xl space-y-6"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-2xl font-black">{selectedSow.id}</h4>
                  <p className="text-emerald-300 text-xs font-bold uppercase">{selectedSow.breed}</p>
                </div>
                <div className="w-10 h-10 bg-emerald-800 rounded-xl flex items-center justify-center">
                  <PawPrint size={20} />
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-emerald-800/50 rounded-2xl border border-emerald-700/50">
                  <p className="text-[10px] font-bold text-emerald-300 uppercase mb-2">Trạng thái hiện tại</p>
                  <p className="text-lg font-bold">{selectedSow.status}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-emerald-800/50 rounded-2xl border border-emerald-700/50">
                    <p className="text-[10px] font-bold text-emerald-300 uppercase mb-1">Chuồng</p>
                    <p className="font-bold">{selectedSow.pen}</p>
                  </div>
                  <div className="p-4 bg-emerald-800/50 rounded-2xl border border-emerald-700/50">
                    <p className="text-[10px] font-bold text-emerald-300 uppercase mb-1">Tiến độ</p>
                    <p className="font-bold">{selectedSow.progress}%</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-emerald-800">
                <p className="text-[10px] font-bold text-emerald-300 uppercase mb-4">Hiệu suất 6 tháng</p>
                <div className="h-24 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={performanceData}>
                      <Bar dataKey="value">
                        {performanceData.map((_, i) => (
                          <Cell key={i} fill={i === 5 ? "#fff" : "#065f46"} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </motion.div>
          )}
        </aside>
      </div>
    </div>
  );
}
