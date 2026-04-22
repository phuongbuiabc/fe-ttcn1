"use client";

import React, { useState } from "react";
import { 
  Plus, 
  Search, 
  ArrowRightLeft, 
  Eye, 
  ChevronDown
} from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/shared/lib/utils";

// Feature Components
import { TransferPigModal } from "@/modules/pens/ui/TransferPigModal";
import { BarnTable } from "@/modules/pens/ui/BarnTable";

// --- Types ---
interface Barn {
  id: string;
  name: string;
  section: string;
  type: string;
  capacity: number;
  currentPigs: number;
  area: number;
  density: number;
  status: "ĐANG SỬ DỤNG" | "TRỐNG" | "BẢO TRÌ";
}

// --- Mock Data ---
const initialBarns: Barn[] = [
  { id: "P-01", name: "Chuồng A1", section: "KHU LỢN CON", type: "Sinh sản", capacity: 100, currentPigs: 62, area: 120, density: 0.52, status: "ĐANG SỬ DỤNG" },
  { id: "P-02", name: "Chuồng A2", section: "KHU VỖ BÉO", type: "Vỗ béo", capacity: 150, currentPigs: 92, area: 150, density: 0.61, status: "ĐANG SỬ DỤNG" },
  { id: "P-03", name: "Chuồng A3", section: "KHU SINH SẢN", type: "Sinh sản", capacity: 100, currentPigs: 0, area: 120, density: 0, status: "TRỐNG" },
  { id: "P-04", name: "Chuồng A4", section: "KHU CÁCH LY", type: "Cách ly", capacity: 40, currentPigs: 12, area: 80, density: 0.15, status: "BẢO TRÌ" }
];

export default function BarnManagementPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [items] = useState<Barn[]>(initialBarns);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);

  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.section.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (barn: Barn) => {
    console.log("Edit barn:", barn);
  };

  const handleDelete = (barn: Barn) => {
     console.log("Delete barn:", barn);
  };

  return (
    <div className="space-y-4 pb-20 bg-[#fbfcfd] min-h-screen -m-4 p-4 ">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-lg font-extrabold text-slate-800 tracking-tight font-headline uppercase leading-none">Hệ thống Chuồng trại</h1>
        </div>
        
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-white border border-slate-100 text-slate-600 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-sm hover:bg-slate-50 transition-all flex items-center gap-1.5">
            <Plus size={14} /> Thêm chuồng
          </button>
          <button 
            onClick={() => setIsTransferModalOpen(true)}
            className="px-5 py-2.5 bg-[#00a67d] text-white rounded-full text-[11px] font-bold shadow-lg shadow-emerald-900/10 flex items-center gap-1.5 active:scale-95 transition-all"
          >
            <ArrowRightLeft size={14} /> Điều chuyển
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "Sử dụng", value: "18", total: "/ 24", color: "bg-slate-200" },
          { label: "Hoạt động", value: "16", color: "bg-[#00a67d]" },
          { label: "Bảo trì", value: "02", color: "bg-[#f5a623]" }
        ].map((stat, i) => (
          <div key={i} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm relative overflow-hidden h-28 flex flex-col justify-between">
            <div className={cn("absolute left-0 top-6 bottom-6 w-1 rounded-r-full", stat.color)} />
            <p className="text-slate-400 text-[9px] font-black uppercase tracking-[0.2em] ml-2">{stat.label}</p>
            <h3 className="text-2xl font-black text-slate-800 tracking-tighter ml-2">
              {stat.value}
              {stat.total && <span className="text-sm text-slate-300 font-bold ml-1.5">{stat.total}</span>}
            </h3>
          </div>
        ))}
      </div>

      {/* Control Bar */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
        <div className="flex gap-1.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {["Tất cả", "Lợn con", "Vỗ béo", "Sinh sản"].map((s) => (
            <button key={s} className={cn("px-4 py-1.5 rounded-lg text-[11px] font-bold transition-all whitespace-nowrap", s === "Tất cả" ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100" : "text-slate-400 hover:text-slate-600")}>{s}</button>
          ))}
        </div>
        
        <div className="relative flex-1 md:max-w-xs w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
          <input 
            type="text" 
            placeholder="Tìm chuồng..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border-none rounded-xl text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-emerald-500/10"
          />
        </div>
      </div>

      {/* Barn List - Table Format */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <BarnTable 
          barns={filteredItems}
          onView={(b) => console.log("View:", b)}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      <TransferPigModal 
        isOpen={isTransferModalOpen} 
        onClose={() => setIsTransferModalOpen(false)} 
        barns={items} 
      />
    </div>
  );
}

