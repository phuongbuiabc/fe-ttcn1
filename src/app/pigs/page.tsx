"use client";

import React, { useState } from "react";
import { 
  PlusCircle, 
  RefreshCw, 
  Upload, 
  Search, 
  Filter, 
  X,
  Settings,
  HelpCircle,
  Edit,
  Trash2,
  ShoppingCart,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/shared/lib/utils";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
} from "recharts";
import { usePigs } from "@/features/pigs/hooks/use-pigs";
import { PigTable } from "@/features/pigs/components/PigTable";
import { PigStats } from "@/features/pigs/components/PigStats";
import { Pig } from "@/shared/types";

export default function PigManagementPage() {
  const { pigs, stats, loading, refresh, removePig } = usePigs();
  const [activeTab, setActiveTab] = useState("individual");
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLitterModalOpen, setIsLitterModalOpen] = useState(false);
  const [editingPig, setEditingPig] = useState<Pig | null>(null);
  const [editingLitter, setEditingLitter] = useState<any | null>(null); // Replace any with proper Litter type
  const [viewingPig, setViewingPig] = useState<Pig | null>(null);

  const filteredPigs = pigs.filter(p => 
    p.pigCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.breed.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const [litters, setLitters] = useState<any[]>([]);
  const [sales, setSales] = useState<any[]>([]);
  const [disposals, setDisposals] = useState<any[]>([]);
  
  const growthData: any[] = [
    { name: "Tuần 1", weight: 30 },
    { name: "Tuần 2", weight: 45 },
    { name: "Tuần 3", weight: 40 },
    { name: "Tuần 4", weight: 60 },
    { name: "Tuần 5", weight: 75 },
    { name: "Hôm nay", weight: 90 },
  ];

  // Form State for Pig
  const [formData, setFormData] = useState<Partial<Pig>>({
    id: "",
    type: "Lợn nái",
    breed: "Duroc",
    pen: "",
    date: new Date().toLocaleDateString("vi-VN"),
    weight: 0,
    growth: "+0kg",
    status: "Bình thường",
    statusColor: "emerald"
  });

  // Form State for Litter
  const [litterFormData, setLitterFormData] = useState<Partial<Litter>>({
    id: "",
    motherId: "",
    birthDate: new Date().toLocaleDateString("vi-VN"),
    count: 0,
    status: "Khỏe mạnh",
    pen: ""
  });

  const openAddModal = () => {
    if (activeTab === "individual") {
      setEditingPig(null);
      setFormData({
        id: `SW-${Math.floor(1000 + Math.random() * 9000)}`,
        type: "Lợn nái",
        breed: "Duroc",
        pen: "",
        date: new Date().toLocaleDateString("vi-VN"),
        weight: 0,
        growth: "+0kg",
        status: "Bình thường",
        statusColor: "emerald"
      });
      setIsModalOpen(true);
    } else {
      setEditingLitter(null);
      setLitterFormData({
        id: `L-${Math.floor(100 + Math.random() * 900)}`,
        motherId: "",
        birthDate: new Date().toLocaleDateString("vi-VN"),
        count: 0,
        status: "Khỏe mạnh",
        pen: ""
      });
      setIsLitterModalOpen(true);
    }
  };

  const openEditModal = (pig: Pig) => {
    setEditingPig(pig);
    setFormData(pig);
    setIsModalOpen(true);
  };

  const openEditLitterModal = (litter: Litter) => {
    setEditingLitter(litter);
    setLitterFormData(litter);
    setIsLitterModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa bản ghi này không?")) {
      setItems(items.filter(i => i.id !== id));
    }
  };

  const handleDeleteLitter = (id: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa đàn con này không?")) {
      setLitters(litters.filter(l => l.id !== id));
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPig) {
      setItems(items.map(i => i.id === editingPig.id ? (formData as Pig) : i));
    } else {
      setItems([(formData as Pig), ...items]);
    }
    setIsModalOpen(false);
  };

  const handleSaveLitter = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingLitter) {
      setLitters(litters.map(l => l.id === editingLitter.id ? (litterFormData as Litter) : l));
    } else {
      setLitters([(litterFormData as Litter), ...litters]);
    }
    setIsLitterModalOpen(false);
  };

  const approveSale = () => {
    if (confirm("Bạn có chắc chắn muốn duyệt danh sách bán này?")) {
      setSales([]);
      alert("Đã duyệt bán thành công!");
    }
  };

  const confirmDisposal = () => {
    if (confirm("Bạn có chắc chắn muốn xác nhận tiêu hủy danh sách này?")) {
      setDisposals([]);
      alert("Đã xác nhận tiêu hủy thành công!");
    }
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight font-headline">Quản lý Lợn</h1>
          <p className="text-slate-500 text-sm">Theo dõi và quản lý đàn gia súc của bạn</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={refresh}
            className="px-4 py-2 bg-white text-slate-600 rounded-full text-sm font-bold flex items-center gap-2 hover:bg-slate-50 border border-slate-100 transition-colors active:scale-95"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} /> Làm mới
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-2 bg-gradient-to-br from-[#006c49] to-[#10b981] text-white rounded-full text-sm font-bold shadow-lg shadow-emerald-900/20 flex items-center gap-2 hover:brightness-110 active:scale-95 transition-all"
          >
            <PlusCircle size={18} /> Thêm lợn
          </button>
        </div>
      </div>

      {/* Stats Section */}
      <PigStats stats={stats} />

      {/* Tab Navigation */}
      <div className="flex justify-center gap-4">
        <button 
          onClick={() => setActiveTab("individual")}
          className={cn(
            "flex items-center gap-2 px-8 py-3 rounded-2xl transition-all font-bold",
            activeTab === "individual" 
              ? "bg-white text-emerald-600 shadow-sm border-b-4 border-emerald-600 shadow-emerald-100" 
              : "text-slate-500 hover:bg-slate-100"
          )}
        >
          <span className="text-xl">🐖</span> Lợn cá thể
        </button>
        <button 
          onClick={() => setActiveTab("litters")}
          className={cn(
            "flex items-center gap-2 px-8 py-3 rounded-2xl transition-all font-bold",
            activeTab === "litters" 
              ? "bg-white text-emerald-600 shadow-sm border-b-4 border-emerald-600 shadow-emerald-100" 
              : "text-slate-500 hover:bg-slate-100"
          )}
        >
          <span className="text-xl">🐷</span> Đàn con
        </button>
      </div>

      {/* Search & Filter */}
      <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Tìm kiếm mã lợn, giống lợn..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-emerald-500/20 text-sm outline-none transition-all"
          />
        </div>
        <button className="p-3 bg-slate-100 text-slate-600 rounded-2xl hover:bg-slate-200 transition-colors">
          <Filter size={20} />
        </button>
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden min-h-[400px]">
        {activeTab === "individual" ? (
          <PigTable 
            pigs={filteredPigs} 
            loading={loading}
            onView={(pig) => setViewingPig(pig)}
            onEdit={(pig) => {}}
            onDelete={removePig}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-6 py-4 w-12"><input type="checkbox" className="rounded text-emerald-600 focus:ring-emerald-600 w-4 h-4" /></th>
                  <th className="px-4 py-4 text-[10px] uppercase tracking-wider font-extrabold text-slate-500">Mã đàn</th>
                  <th className="px-4 py-4 text-[10px] uppercase tracking-wider font-extrabold text-slate-500">Mẹ</th>
                  <th className="px-4 py-4 text-[10px] uppercase tracking-wider font-extrabold text-slate-500">Ngày sinh</th>
                  <th className="px-4 py-4 text-[10px] uppercase tracking-wider font-extrabold text-slate-500">Số lượng</th>
                  <th className="px-4 py-4 text-[10px] uppercase tracking-wider font-extrabold text-slate-500">Chuồng</th>
                  <th className="px-4 py-4 text-[10px] uppercase tracking-wider font-extrabold text-slate-500">Trạng thái</th>
                  <th className="px-6 py-4 text-right text-[10px] uppercase tracking-wider font-extrabold text-slate-500">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {litters.map((litter) => (
                  <tr key={litter.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-5"><input type="checkbox" className="rounded text-emerald-600 w-4 h-4" /></td>
                    <td className="px-4 py-5 font-bold text-emerald-600">{litter.id}</td>
                    <td className="px-4 py-5 font-medium text-slate-600">{litter.motherId}</td>
                    <td className="px-4 py-5 text-slate-500 text-sm">{litter.birthDate}</td>
                    <td className="px-4 py-5 font-bold text-slate-900">{litter.count} con</td>
                    <td className="px-4 py-5 font-medium text-slate-600">{litter.pen}</td>
                    <td className="px-4 py-5">
                      <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-[11px] font-bold rounded-full">{litter.status}</span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex justify-end gap-3 text-slate-400">
                        <button className="hover:text-blue-600 transition-colors"><Edit size={18} /></button>
                        <button className="hover:text-rose-600 transition-colors"><Trash2 size={18} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Bottom Tables Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Proposed for Sale Table */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-sm">
                <ShoppingCart size={20} />
              </div>
              <h2 className="text-xl font-headline font-extrabold text-slate-900">Bảng Đề xuất bán</h2>
            </div>
            <button 
              onClick={approveSale}
              className="px-5 py-2 bg-emerald-600 text-white rounded-full text-xs font-bold hover:bg-emerald-700 transition-all flex items-center gap-2 shadow-lg shadow-emerald-200"
            >
              <CheckCircle size={14} /> Duyệt bán
            </button>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-3 bg-slate-50 flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                <input 
                  type="text" 
                  placeholder="Tìm ID lợn..." 
                  className="w-full pl-8 pr-3 py-1.5 bg-white rounded-lg border-none text-xs focus:ring-1 focus:ring-emerald-500 outline-none"
                />
              </div>
              <button className="p-2 bg-white rounded-lg text-slate-400 hover:text-emerald-600 border border-slate-100"><Filter size={14} /></button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-50 bg-slate-50/50">
                    <th className="px-4 py-3 w-8"><input type="checkbox" className="rounded text-emerald-600 w-3.5 h-3.5" /></th>
                    <th className="px-3 py-3 text-[9px] uppercase tracking-wider font-extrabold text-slate-400">Mã nhân viên</th>
                    <th className="px-3 py-3 text-[9px] uppercase tracking-wider font-extrabold text-slate-400">Số tai</th>
                    <th className="px-3 py-3 text-[9px] uppercase tracking-wider font-extrabold text-slate-400">Cân nặng</th>
                    <th className="px-3 py-3 text-[9px] uppercase tracking-wider font-extrabold text-slate-400">Lý do</th>
                    <th className="px-3 py-3 text-[9px] uppercase tracking-wider font-extrabold text-slate-400">Trạng thái</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {sales.map((item, idx) => (
                    <tr key={idx} className="hover:bg-emerald-50/20 transition-colors">
                      <td className="px-4 py-3"><input type="checkbox" className="rounded text-emerald-600 w-3.5 h-3.5" /></td>
                      <td className="px-3 py-3 text-xs text-slate-600 font-medium">{item.staffId}</td>
                      <td className="px-3 py-3 font-bold text-emerald-700 text-xs">{item.pigId}</td>
                      <td className="px-3 py-3 text-xs text-slate-600 font-bold">{item.weight}</td>
                      <td className="px-3 py-3 text-xs text-slate-600">{item.reason}</td>
                      <td className="px-3 py-3">
                        <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-[9px] font-bold rounded-full">{item.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Proposed for Disposal Table */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shadow-sm">
                <AlertTriangle size={20} />
              </div>
              <h2 className="text-xl font-headline font-extrabold text-slate-900">Bảng đề xuất tiêu hủy</h2>
            </div>
            <button 
              onClick={confirmDisposal}
              className="px-5 py-2 bg-rose-600 text-white rounded-full text-xs font-bold hover:bg-rose-700 transition-all flex items-center gap-2 shadow-lg shadow-rose-200"
            >
              <CheckCircle size={14} /> Xác nhận tiêu hủy
            </button>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-3 bg-slate-50 flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                <input 
                  type="text" 
                  placeholder="Tìm ID lợn..." 
                  className="w-full pl-8 pr-3 py-1.5 bg-white rounded-lg border-none text-xs focus:ring-1 focus:ring-rose-500 outline-none"
                />
              </div>
              <button className="p-2 bg-white rounded-lg text-slate-400 hover:text-rose-600 border border-slate-100"><Filter size={14} /></button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-50 bg-slate-50/50">
                    <th className="px-4 py-3 w-8"><input type="checkbox" className="rounded text-rose-600 w-3.5 h-3.5" /></th>
                    <th className="px-3 py-3 text-[9px] uppercase tracking-wider font-extrabold text-slate-400">Mã nhân viên</th>
                    <th className="px-3 py-3 text-[9px] uppercase tracking-wider font-extrabold text-slate-400">Số tai</th>
                    <th className="px-3 py-3 text-[9px] uppercase tracking-wider font-extrabold text-slate-400">Lý do</th>
                    <th className="px-3 py-3 text-[9px] uppercase tracking-wider font-extrabold text-slate-400">Trạng thái</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {disposals.map((item, idx) => (
                    <tr key={idx} className="hover:bg-rose-50/20 transition-colors">
                      <td className="px-4 py-3"><input type="checkbox" className="rounded text-rose-600 w-3.5 h-3.5" /></td>
                      <td className="px-3 py-3 text-xs text-slate-600 font-medium">{item.staffId}</td>
                      <td className="px-3 py-3 font-bold text-rose-700 text-xs">{item.pigId}</td>
                      <td className="px-3 py-3 text-xs text-slate-600 italic">{item.reason}</td>
                      <td className="px-3 py-3">
                        <span className={cn(
                          "px-2 py-0.5 text-[9px] font-bold rounded-full",
                          item.status === "Khẩn cấp" ? "bg-rose-100 text-rose-700" : "bg-slate-100 text-slate-500"
                        )}>{item.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
      {/* Litter Modal */}
      <AnimatePresence>
        {isLitterModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white">
                <h3 className="text-2xl font-headline font-black text-emerald-900">
                  {editingLitter ? "Sửa thông tin đàn con" : "Thêm đàn con mới"}
                </h3>
                <button 
                  onClick={() => setIsLitterModalOpen(false)}
                  className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors"
                >
                  <X size={24} className="text-slate-400" />
                </button>
              </div>

              <form onSubmit={handleSaveLitter} className="p-8 space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400">Mã đàn</label>
                    <input 
                      type="text" 
                      required
                      value={litterFormData.id}
                      onChange={(e) => setLitterFormData({...litterFormData, id: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-emerald-500/20 outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400">Mã lợn mẹ</label>
                    <input 
                      type="text" 
                      required
                      value={litterFormData.motherId}
                      onChange={(e) => setLitterFormData({...litterFormData, motherId: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-emerald-500/20 outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400">Số lượng (con)</label>
                    <input 
                      type="number" 
                      required
                      value={litterFormData.count}
                      onChange={(e) => setLitterFormData({...litterFormData, count: parseInt(e.target.value)})}
                      className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-emerald-500/20 outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400">Chuồng</label>
                    <input 
                      type="text" 
                      required
                      value={litterFormData.pen}
                      onChange={(e) => setLitterFormData({...litterFormData, pen: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-emerald-500/20 outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400">Trạng thái</label>
                    <select 
                      className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-emerald-500/20 outline-none"
                      value={litterFormData.status}
                      onChange={(e) => setLitterFormData({...litterFormData, status: e.target.value})}
                    >
                      <option>Khỏe mạnh</option>
                      <option>Cần theo dõi</option>
                      <option>Yếu</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
                  <button 
                    type="button"
                    onClick={() => setIsLitterModalOpen(false)}
                    className="px-8 py-2.5 bg-white text-slate-600 text-sm font-bold rounded-full border border-slate-200 hover:bg-slate-50 transition-colors"
                  >
                    Hủy
                  </button>
                  <button 
                    type="submit"
                    className="px-8 py-2.5 bg-emerald-600 text-white text-sm font-bold rounded-full shadow-lg shadow-emerald-900/20 hover:bg-emerald-700 transition-all"
                  >
                    Lưu thông tin
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white">
                <h3 className="text-2xl font-headline font-black text-emerald-900">
                  {editingPig ? "Sửa thông tin lợn" : "Thêm lợn mới"}
                </h3>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors"
                >
                  <X size={24} className="text-slate-400" />
                </button>
              </div>

              <form onSubmit={handleSave} className="p-8 space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400">Số tai / ID</label>
                    <input 
                      type="text" 
                      required
                      value={formData.id}
                      onChange={(e) => setFormData({...formData, id: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-emerald-500/20 outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400">Loại lợn</label>
                    <select 
                      className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-emerald-500/20 outline-none"
                      value={formData.type}
                      onChange={(e) => setFormData({...formData, type: e.target.value})}
                    >
                      <option>Lợn nái</option>
                      <option>Lợn nọc</option>
                      <option>Lợn con</option>
                      <option>Lợn vỗ béo</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400">Giống</label>
                    <select 
                      className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-emerald-500/20 outline-none"
                      value={formData.breed}
                      onChange={(e) => setFormData({...formData, breed: e.target.value})}
                    >
                      <option>Duroc</option>
                      <option>Landrace</option>
                      <option>Yorkshire</option>
                      <option>Pietrain</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400">Chuồng</label>
                    <input 
                      type="text" 
                      required
                      value={formData.pen}
                      onChange={(e) => setFormData({...formData, pen: e.target.value})}
                      placeholder="Ví dụ: A1 - Box 12"
                      className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-emerald-500/20 outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400">Cân nặng (kg)</label>
                    <input 
                      type="number" 
                      required
                      value={formData.weight}
                      onChange={(e) => setFormData({...formData, weight: parseFloat(e.target.value) || 0})}
                      className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-emerald-500/20 outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400">Trạng thái</label>
                    <select 
                      className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-emerald-500/20 outline-none"
                      value={formData.status}
                      onChange={(e) => {
                        const status = e.target.value;
                        const statusColor = status === "Bình thường" ? "emerald" : "rose";
                        setFormData({...formData, status, statusColor});
                      }}
                    >
                      <option>Bình thường</option>
                      <option>Cảnh báo Sức khỏe</option>
                      <option>Cần theo dõi</option>
                      <option>Cách ly</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-8 py-2.5 bg-white text-slate-600 text-sm font-bold rounded-full border border-slate-200 hover:bg-slate-50 transition-colors"
                  >
                    Hủy
                  </button>
                  <button 
                    type="submit"
                    className="px-8 py-2.5 bg-emerald-600 text-white text-sm font-bold rounded-full shadow-lg shadow-emerald-900/20 hover:bg-emerald-700 transition-all"
                  >
                    Lưu thông tin
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
