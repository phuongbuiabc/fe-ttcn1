"use client";

import React, { useState } from "react";
import { 
  ArrowDownLeft, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  ChevronLeft, 
  ChevronRight,
  Calendar,
  Truck,
  User,
  Package,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  Download,
  Edit,
  Trash2,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/shared/lib/utils";

// --- Types ---

interface ImportRecord {
  id: string;
  date: string;
  supplier: string;
  type: string;
  quantity: number;
  totalAmount: string;
  status: string;
  staff: string;
}

interface Stat {
  label: string;
  value: string;
  icon: React.ElementType;
  color: string;
}

const importRecords: ImportRecord[] = [
  { 
    id: "IMP-2024-001", 
    date: "20/05/2026", 
    supplier: "Công ty Giống CP", 
    type: "Lợn giống", 
    quantity: 50, 
    totalAmount: "250,000,000đ", 
    status: "Hoàn thành",
    staff: "Nguyễn Văn A"
  },
  { 
    id: "IMP-2024-002", 
    date: "18/05/2026", 
    supplier: "Đại lý Thức ăn X", 
    type: "Cám hỗn hợp", 
    quantity: 200, 
    totalAmount: "120,000,000đ", 
    status: "Đang giao",
    staff: "Trần Thị B"
  },
  { 
    id: "IMP-2024-003", 
    date: "15/05/2026", 
    supplier: "Thuốc thú y Minh Anh", 
    type: "Vaccine", 
    quantity: 500, 
    totalAmount: "45,000,000đ", 
    status: "Chờ duyệt",
    staff: "Lê Văn C"
  },
];

const stats: Stat[] = [
  { label: "Tổng nhập tháng này", value: "415.2M", icon: Package, color: "emerald" },
  { label: "Đơn hàng chờ duyệt", value: "03", icon: Clock, color: "amber" },
  { label: "Đơn hàng đang giao", value: "05", icon: Truck, color: "blue" },
];

export default function ImportPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("Tất cả");
  const [records, setRecords] = useState<ImportRecord[]>(importRecords);
  
  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<ImportRecord | null>(null);
  
  // Delete Confirmation
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState<ImportRecord | null>(null);

  // Filtered records
  const filteredRecords = records.filter(record => {
    const matchesSearch = record.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         record.supplier.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "Tất cả" || record.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  // Form State
  const [formData, setFormData] = useState<Partial<ImportRecord>>({
    id: "",
    date: new Date().toLocaleDateString("vi-VN"),
    supplier: "",
    type: "Lợn giống",
    quantity: 0,
    totalAmount: "",
    status: "Chờ duyệt",
    staff: "Nguyễn Văn A"
  });

  const openAddModal = () => {
    setEditingRecord(null);
    setFormData({
      id: `IMP-2024-${Math.floor(100 + Math.random() * 900)}`,
      date: new Date().toLocaleDateString("vi-VN"),
      supplier: "",
      type: "Lợn giống",
      quantity: 10,
      totalAmount: "50,000,000đ",
      status: "Chờ duyệt",
      staff: "Nguyễn Văn A"
    });
    setIsModalOpen(true);
  };

  const openEditModal = (record: ImportRecord) => {
    setEditingRecord(record);
    setFormData(record);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (record: ImportRecord) => {
    setRecordToDelete(record);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (recordToDelete) {
      setRecords(records.filter(r => r.id !== recordToDelete.id));
      setIsDeleteModalOpen(false);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingRecord) {
      setRecords(records.map(r => r.id === editingRecord.id ? (formData as ImportRecord) : r));
    } else {
      setRecords([formData as ImportRecord, ...records]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight font-headline">Nhập hàng</h1>
          <p className="text-slate-500 text-sm mt-1">Quản lý các đơn hàng nhập giống, vật tư và thức ăn.</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-white text-slate-600 rounded-full text-sm font-bold flex items-center gap-2 hover:bg-slate-50 border border-slate-100 transition-all active:scale-95">
            <Download size={16} /> Xuất báo cáo
          </button>
          <button 
            onClick={openAddModal}
            className="px-6 py-2 bg-gradient-to-br from-[#006c49] to-[#10b981] text-white rounded-full text-sm font-bold shadow-lg shadow-emerald-900/20 flex items-center gap-2 hover:brightness-110 active:scale-95 transition-all"
          >
            <Plus size={18} /> Tạo đơn nhập mới
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <stat.icon size={64} className={cn(
                stat.color === "emerald" ? "text-emerald-600" : 
                stat.color === "amber" ? "text-amber-500" : "text-blue-500"
              )} />
            </div>
            <p className="text-slate-400 text-[10px] uppercase font-bold tracking-wider mb-2">{stat.label}</p>
            <h3 className="text-3xl font-headline font-black text-slate-900">{stat.value}</h3>
            <div className={cn(
              "mt-4 h-1 w-12 rounded-full",
              stat.color === "emerald" ? "bg-emerald-500" : 
              stat.color === "amber" ? "bg-amber-500" : "bg-blue-500"
            )} />
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-1 min-w-[300px]">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Tìm kiếm mã đơn, nhà cung cấp..." 
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="p-2 bg-slate-50 text-slate-600 rounded-xl hover:bg-slate-100 transition-colors">
              <Filter size={20} />
            </button>
          </div>
          <div className="flex bg-slate-100 p-1 rounded-xl">
            <button 
              onClick={() => setFilterStatus("Tất cả")}
              className={cn(
                "px-4 py-1.5 text-xs font-bold rounded-lg transition-all",
                filterStatus === "Tất cả" ? "bg-white text-emerald-700 shadow-sm" : "text-slate-500 hover:text-emerald-700"
              )}
            >
              Tất cả
            </button>
            <button 
              onClick={() => setFilterStatus("Chờ duyệt")}
              className={cn(
                "px-4 py-1.5 text-xs font-bold rounded-lg transition-all",
                filterStatus === "Chờ duyệt" ? "bg-white text-emerald-700 shadow-sm" : "text-slate-500 hover:text-emerald-700"
              )}
            >
              Chờ duyệt
            </button>
            <button 
              onClick={() => setFilterStatus("Đang giao")}
              className={cn(
                "px-4 py-1.5 text-xs font-bold rounded-lg transition-all",
                filterStatus === "Đang giao" ? "bg-white text-emerald-700 shadow-sm" : "text-slate-500 hover:text-emerald-700"
              )}
            >
              Đang giao
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Mã đơn</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Ngày nhập</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Nhà cung cấp</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Loại hàng</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">Số lượng</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">Tổng tiền</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Trạng thái</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Nhân viên</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredRecords.map((record) => (
                <tr key={record.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4">
                    <span className="font-bold text-slate-900 text-sm">{record.id}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">{record.date}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                        <Truck size={14} />
                      </div>
                      <span className="font-bold text-slate-700 text-sm">{record.supplier}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">{record.type}</td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-900 text-right">{record.quantity}</td>
                  <td className="px-6 py-4 text-sm font-black text-emerald-700 text-right">{record.totalAmount}</td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 w-fit",
                      record.status === "Hoàn thành" ? "bg-emerald-50 text-emerald-600" : 
                      record.status === "Đang giao" ? "bg-blue-50 text-blue-600" : "bg-amber-50 text-amber-600"
                    )}>
                      {record.status === "Hoàn thành" ? <CheckCircle2 size={12} /> : 
                       record.status === "Đang giao" ? <Truck size={12} /> : <Clock size={12} />}
                      {record.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">{record.staff}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => openEditModal(record)}
                        className="p-2 text-slate-400 hover:text-blue-600 transition-colors"
                      >
                        <Edit size={18} />
                      </button>
                      <button 
                        onClick={() => handleDeleteClick(record)}
                        className="p-2 text-slate-400 hover:text-rose-600 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t border-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-400 font-medium">Hiển thị {filteredRecords.length} trong số {records.length} đơn nhập</p>
          <div className="flex gap-2">
            <button className="w-8 h-8 flex items-center justify-center rounded-xl bg-slate-100 text-slate-400 disabled:opacity-30" disabled>
              <ChevronLeft size={18} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-lg shadow-emerald-900/20">1</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
      
      {/* Add/Edit Modal */}
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
                  {editingRecord ? "Sửa đơn nhập hàng" : "Tạo đơn nhập hàng mới"}
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
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400">Mã đơn</label>
                    <input 
                      type="text" 
                      required
                      value={formData.id}
                      onChange={(e) => setFormData({...formData, id: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-emerald-500/20 outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400">Ngày nhập</label>
                    <input 
                      type="text" 
                      required
                      value={formData.date}
                      onChange={(e) => setFormData({...formData, date: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-emerald-500/20 outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400">Nhà cung cấp</label>
                    <input 
                      type="text" 
                      required
                      value={formData.supplier}
                      onChange={(e) => setFormData({...formData, supplier: e.target.value})}
                      placeholder="Tên công ty/đại lý"
                      className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-emerald-500/20 outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400">Loại hàng</label>
                    <select 
                      className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-emerald-500/20 outline-none"
                      value={formData.type}
                      onChange={(e) => setFormData({...formData, type: e.target.value})}
                    >
                      <option>Lợn giống</option>
                      <option>Cám hỗn hợp</option>
                      <option>Vaccine</option>
                      <option>Vật tư khác</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400">Số lượng</label>
                    <input 
                      type="number" 
                      required
                      value={formData.quantity}
                      onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value)})}
                      className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-emerald-500/20 outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400">Tổng tiền</label>
                    <input 
                      type="text" 
                      required
                      value={formData.totalAmount}
                      onChange={(e) => setFormData({...formData, totalAmount: e.target.value})}
                      placeholder="Ví dụ: 100,000,000đ"
                      className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-emerald-500/20 outline-none"
                    />
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
                    Lưu đơn hàng
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {isDeleteModalOpen && recordToDelete && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white rounded-[2.5rem] w-full max-w-md shadow-2xl p-10 text-center">
              <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <Trash2 size={40} />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-2 italic uppercase">Xóa đơn nhập?</h3>
              <p className="text-slate-500 text-sm mb-8 leading-relaxed">
                Bạn có chắc chắn muốn xóa đơn nhập <span className="font-bold text-slate-900">"{recordToDelete.id}"</span> từ nhà cung cấp <span className="font-bold text-slate-900">"{recordToDelete.supplier}"</span>? 
              </p>
              <div className="flex gap-4">
                <button 
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="flex-1 py-4 bg-slate-100 text-slate-700 rounded-2xl text-sm font-bold"
                >
                  Hủy bỏ
                </button>
                <button 
                  onClick={confirmDelete}
                  className="flex-1 py-4 bg-rose-500 text-white rounded-2xl text-sm font-bold shadow-lg shadow-rose-900/20"
                >
                  Xác nhận xóa
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
