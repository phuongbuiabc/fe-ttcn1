"use client";

import React, { useState } from "react";
import { 
  PlusCircle, 
  RefreshCw, 
  Search, 
  Filter, 
  ShoppingCart, 
  CheckCircle, 
  AlertTriangle, 
  Edit,
  Trash2,
} from "lucide-react";
import { cn } from "@/shared/lib/utils";

// Custom Features
import { usePigs } from "@/features/pigs/hooks/use-pigs";
import { PigTable } from "@/features/pigs/ui/PigTable";
import { PigStats } from "@/features/pigs/ui/PigStats";
import { PigFormModal } from "@/features/pigs/ui/PigFormModal";
import { LitterFormModal } from "@/features/pigs/ui/LitterFormModal";
import { ActionConfirmModal } from "@/features/pigs/ui/ActionConfirmModal";
import { Pig, Litter } from "@/shared/types";

export default function PigManagementPage() {
  const { pigs, stats, loading, refresh, removePig } = usePigs();
  const [activeTab, setActiveTab] = useState("individual");
  const [searchTerm, setSearchTerm] = useState("");
  
  // Modals Status
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLitterModalOpen, setIsLitterModalOpen] = useState(false);
  const [confirmModal, setConfirmModal] = useState<any>({ isOpen: false, type: "delete-pig" });

  const [editingPig, setEditingPig] = useState<any>(null);
  const [editingLitter, setEditingLitter] = useState<any>(null);
  
  const [litters, setLitters] = useState<any[]>([]);
  const [sales] = useState<any[]>([]);
  const [disposals] = useState<any[]>([]);

  const [formData, setFormData] = useState<any>({
    id: "", pigCode: "", type: "Lợn nái", breed: "Duroc", pen: "", date: "", weight: 0, growth: "+0kg", status: "Bình thường", statusColor: "emerald"
  });

  const [litterFormData, setLitterFormData] = useState<any>({
    id: "", motherId: "", birthDate: "", count: 0, status: "Khỏe mạnh", pen: ""
  });

  const openAddModal = () => {
    if (activeTab === "individual") {
      setEditingPig(null);
      setFormData({ id: `SW-${Math.floor(1000 + Math.random() * 9000)}`, type: "Lợn nái", breed: "Duroc", pen: "", weight: 0, status: "Bình thường" });
      setIsModalOpen(true);
    } else {
      setEditingLitter(null);
      setLitterFormData({ id: `L-${Math.floor(100 + Math.random() * 900)}`, motherId: "M01", count: 0, status: "Khỏe mạnh", pen: "C01" });
      setIsLitterModalOpen(true);
    }
  };

  const handleActionConfirm = async () => {
    const { type, targetId } = confirmModal;
    if (type === "delete-pig" && targetId) await removePig(targetId);
    else if (type === "delete-litter" && targetId) setLitters(litters.filter(l => l.id !== targetId));
    setConfirmModal({ ...confirmModal, isOpen: false });
  };

  const filteredPigs = pigs.filter(p => 
    p.pigCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.breed.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4 pb-20 bg-[#fbfcfd] min-h-screen -m-4 p-4 ">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-xl font-extrabold text-slate-800 tracking-tight font-headline uppercase">Quản lý đàn lợn</h1>
        </div>
        <div className="flex gap-4">
          <button onClick={refresh} className="px-5 py-2.5 bg-white text-slate-600 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-slate-100 shadow-sm hover:bg-slate-50 active:scale-95 transition-all">
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} /> Làm mới
          </button>
          <button onClick={openAddModal} className="px-8 py-3.5 bg-[#00a67d] text-white rounded-full text-sm font-bold shadow-lg shadow-emerald-900/10 flex items-center gap-2 active:scale-95 transition-all">
            <PlusCircle size={18} /> Thêm {activeTab === "individual" ? "cá thể" : "đàn mới"}
          </button>
        </div>
      </div>

      {/* Stats Section */}
      <PigStats stats={stats} />

      {/* Navigation & Controls */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-6 bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm">
        <div className="flex bg-slate-100 p-1.5 rounded-[1.5rem] w-full lg:w-auto">
          <button onClick={() => setActiveTab("individual")} className={cn("flex-1 lg:flex-none px-8 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all", activeTab === "individual" ? "bg-white text-[#00a67d] shadow-sm" : "text-slate-400")}>Heo cá thể</button>
          <button onClick={() => setActiveTab("litters")} className={cn("flex-1 lg:flex-none px-8 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all", activeTab === "litters" ? "bg-white text-[#00a67d] shadow-sm" : "text-slate-400")}>Quản lý đàn con</button>
        </div>

        <div className="relative flex-1 lg:max-w-md w-full">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input type="text" placeholder="Tìm theo ID, giống lợn..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-14 pr-6 py-4 bg-slate-50 border-none rounded-[1.5rem] text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-[#00a67d]/10" />
        </div>
      </div>

      {/* Main Table Area */}
      <div className="bg-white rounded-[1.75rem] border border-slate-100 shadow-sm overflow-hidden min-h-[400px]">
        {activeTab === "individual" ? (
          <PigTable 
            pigs={filteredPigs} loading={loading}
            onView={(pig) => {}}
            onEdit={(pig) => { setEditingPig(pig); setFormData(pig); setIsModalOpen(true); }}
            onDelete={(id) => setConfirmModal({ isOpen: true, type: "delete-pig", targetId: id, targetName: id })}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Mã đàn</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Lợn mẹ</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Số lượng</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Vị trí</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {litters.length === 0 ? (
                  <tr><td colSpan={5} className="py-20 text-center font-bold text-slate-300 uppercase italic">Chưa có dữ liệu đàn con</td></tr>
                ) : litters.map((litter) => (
                  <tr key={litter.id} className="hover:bg-slate-50/50 group transition-all">
                    <td className="px-8 py-5 font-black text-[#00a67d]">{litter.id}</td>
                    <td className="px-8 py-5 font-bold text-slate-600 uppercase text-xs">Mẹ: {litter.motherId}</td>
                    <td className="px-8 py-5 font-black text-slate-800">{litter.count} con</td>
                    <td className="px-8 py-5 font-bold text-slate-500 uppercase text-xs">{litter.pen}</td>
                    <td className="px-8 py-5 text-right flex justify-end gap-2 transition-opacity">
                      <button onClick={() => { setEditingLitter(litter); setLitterFormData(litter); setIsLitterModalOpen(true); }} className="p-2.5 text-slate-300 hover:text-[#00a67d] hover:bg-[#e2f7f1] rounded-xl"><Edit size={18} /></button>
                      <button onClick={() => setConfirmModal({ isOpen: true, type: "delete-litter", targetId: litter.id, targetName: litter.id })} className="p-2.5 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl"><Trash2 size={18} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Proposal Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {[
          { title: "Đề xuất xuất bán", icon: ShoppingCart, color: "text-[#00a67d]", bg: "bg-[#e2f7f1]", type: "approve-sale" },
          { title: "Đề xuất tiêu hủy", icon: AlertTriangle, color: "text-rose-500", bg: "bg-rose-50", type: "confirm-disposal" }
        ].map((sec, i) => (
          <div key={i} className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={cn("w-12 h-12 rounded-[1.25rem] flex items-center justify-center shadow-sm", sec.bg, sec.color)}><sec.icon size={24} /></div>
                <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">{sec.title}</h2>
              </div>
              <button onClick={() => setConfirmModal({ isOpen: true, type: sec.type })} className="px-6 py-2 bg-slate-900 text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl shadow-slate-900/20 active:scale-95 transition-all">Duyệt danh sách</button>
            </div>
            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-10 text-center">
              <p className="text-xs font-bold text-slate-300 uppercase tracking-widest italic">Danh sách trống</p>
            </div>
          </div>
        ))}
      </div>

      {/* Modals */}
      <PigFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={(e) => { e.preventDefault(); setIsModalOpen(false); }} editingPig={editingPig} formData={formData} setFormData={setFormData} />
      <LitterFormModal isOpen={isLitterModalOpen} onClose={() => setIsLitterModalOpen(false)} onSave={(e) => { e.preventDefault(); setIsLitterModalOpen(false); }} editingLitter={editingLitter} litterFormData={litterFormData} setLitterFormData={setLitterFormData} />
      <ActionConfirmModal isOpen={confirmModal.isOpen} type={confirmModal.type} targetName={confirmModal.targetName} onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })} onConfirm={handleActionConfirm} />
    </div>
  );
}

