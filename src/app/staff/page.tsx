"use client";

import React, { useState } from "react";
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Mail, 
  Phone, 
  Calendar, 
  Clock, 
  ShieldCheck, 
  UserPlus,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Briefcase,
  Award,
  X,
  Edit,
  Trash2
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/shared/lib/utils";
import Image from "next/image";

// --- Types ---

interface StaffMember {
  id: string;
  name: string;
  role: "Quản trị viên" | "Kỹ thuật viên" | "Công nhân" | "Kế toán";
  email: string;
  phone: string;
  status: "Đang làm việc" | "Nghỉ phép" | "Vắng mặt";
  joinDate: string;
  avatar: string;
  performance: number;
}

// --- Mock Data ---

const staffMembers: StaffMember[] = [
  {
    id: "STF-001",
    name: "Nguyễn Văn An",
    role: "Quản trị viên",
    email: "an.nv@agriintel.com",
    phone: "0901 234 567",
    status: "Đang làm việc",
    joinDate: "01/01/2023",
    avatar: "https://picsum.photos/seed/an/200/200",
    performance: 98
  },
  {
    id: "STF-002",
    name: "Trần Thị Bình",
    role: "Kỹ thuật viên",
    email: "binh.tt@agriintel.com",
    phone: "0902 345 678",
    status: "Đang làm việc",
    joinDate: "15/03/2023",
    avatar: "https://picsum.photos/seed/binh/200/200",
    performance: 92
  },
  {
    id: "STF-003",
    name: "Lê Văn Cường",
    role: "Công nhân",
    email: "cuong.lv@agriintel.com",
    phone: "0903 456 789",
    status: "Nghỉ phép",
    joinDate: "10/06/2023",
    avatar: "https://picsum.photos/seed/cuong/200/200",
    performance: 85
  },
  {
    id: "STF-004",
    name: "Phạm Minh Đức",
    role: "Công nhân",
    email: "duc.pm@agriintel.com",
    phone: "0904 567 890",
    status: "Đang làm việc",
    joinDate: "20/08/2023",
    avatar: "https://picsum.photos/seed/duc/200/200",
    performance: 88
  },
  {
    id: "STF-005",
    name: "Hoàng Thị Em",
    role: "Kế toán",
    email: "em.ht@agriintel.com",
    phone: "0905 678 901",
    status: "Đang làm việc",
    joinDate: "05/10/2023",
    avatar: "https://picsum.photos/seed/em/200/200",
    performance: 95
  }
];

export default function StaffPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [members, setMembers] = useState<StaffMember[]>(staffMembers);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<StaffMember | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<StaffMember>>({
    id: "",
    name: "",
    role: "Công nhân",
    email: "",
    phone: "",
    status: "Đang làm việc",
    joinDate: new Date().toLocaleDateString("vi-VN"),
    avatar: "https://picsum.photos/seed/new/200/200",
    performance: 100
  });

  const openAddModal = () => {
    setEditingMember(null);
    setFormData({
      id: `STF-${Math.floor(100 + Math.random() * 900)}`,
      name: "",
      role: "Công nhân",
      email: "",
      phone: "",
      status: "Đang làm việc",
      joinDate: new Date().toLocaleDateString("vi-VN"),
      avatar: `https://picsum.photos/seed/${Math.random()}/200/200`,
      performance: 100
    });
    setIsModalOpen(true);
  };

  const openEditModal = (member: StaffMember) => {
    setEditingMember(member);
    setFormData(member);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa nhân viên này không?")) {
      setMembers(members.filter(m => m.id !== id));
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingMember) {
      setMembers(members.map(m => m.id === editingMember.id ? (formData as StaffMember) : m));
    } else {
      setMembers([formData as StaffMember, ...members]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight font-headline">Quản lý Nhân sự</h1>
          <p className="text-slate-500 text-sm mt-1">Danh sách nhân viên, phân quyền, lịch trực và đánh giá hiệu quả công việc.</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-white text-slate-600 rounded-full text-sm font-bold flex items-center gap-2 hover:bg-slate-50 border border-slate-100 transition-all active:scale-95">
            <Calendar size={16} /> Lịch trực tuần
          </button>
          <button 
            onClick={openAddModal}
            className="px-6 py-2 bg-gradient-to-br from-[#006c49] to-[#10b981] text-white rounded-full text-sm font-bold shadow-lg shadow-emerald-900/20 flex items-center gap-2 hover:brightness-110 active:scale-95 transition-all"
          >
            <UserPlus size={18} /> Thêm nhân viên
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <p className="text-slate-400 text-[10px] uppercase font-bold tracking-widest mb-2">Tổng nhân sự</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-4xl font-headline font-black text-slate-900">42</h3>
            <span className="text-emerald-600 text-xs font-bold">+2 mới</span>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <p className="text-slate-400 text-[10px] uppercase font-bold tracking-widest mb-2">Đang làm việc</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-4xl font-headline font-black text-emerald-600">38</h3>
            <span className="text-slate-400 text-xs font-bold">/42</span>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <p className="text-slate-400 text-[10px] uppercase font-bold tracking-widest mb-2">Nghỉ phép/Vắng</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-4xl font-headline font-black text-amber-600">04</h3>
            <span className="text-slate-400 text-xs font-bold">Hôm nay</span>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <p className="text-slate-400 text-[10px] uppercase font-bold tracking-widest mb-2">Hiệu suất TB</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-4xl font-headline font-black text-slate-900">92%</h3>
            <Award size={20} className="text-amber-500" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-1 min-w-[300px]">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Tìm kiếm tên, email, số điện thoại..." 
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
            <button className="px-4 py-1.5 text-xs font-bold bg-white text-emerald-700 rounded-lg shadow-sm">Tất cả</button>
            <button className="px-4 py-1.5 text-xs font-medium text-slate-500 hover:text-emerald-700 transition-colors">Kỹ thuật</button>
            <button className="px-4 py-1.5 text-xs font-medium text-slate-500 hover:text-emerald-700 transition-colors">Công nhân</button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Nhân viên</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Vai trò</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Liên hệ</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Trạng thái</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Hiệu suất</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Ngày gia nhập</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {members.map((staff) => (
                <tr key={staff.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm">
                        <Image 
                          src={staff.avatar} 
                          alt={staff.name} 
                          fill 
                          className="object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 text-sm">{staff.name}</p>
                        <p className="text-[10px] text-slate-400 font-medium">ID: {staff.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                      <div className={cn(
                        "w-2 h-2 rounded-full",
                        staff.role === "Quản trị viên" ? "bg-rose-500" : 
                        staff.role === "Kỹ thuật viên" ? "bg-blue-500" : 
                        staff.role === "Kế toán" ? "bg-amber-500" : "bg-slate-400"
                      )} />
                      <span className="text-xs font-bold text-slate-700">{staff.role}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <Mail size={12} className="text-slate-400" />
                        {staff.email}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <Phone size={12} className="text-slate-400" />
                        {staff.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className={cn(
                      "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider flex items-center gap-1.5 w-fit",
                      staff.status === "Đang làm việc" ? "bg-emerald-50 text-emerald-600" : 
                      staff.status === "Nghỉ phép" ? "bg-amber-50 text-amber-600" : "bg-rose-50 text-rose-600"
                    )}>
                      {staff.status === "Đang làm việc" ? <CheckCircle2 size={12} /> : 
                       staff.status === "Nghỉ phép" ? <Clock size={12} /> : <XCircle size={12} />}
                      {staff.status}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-black text-slate-900">{staff.performance}%</span>
                      <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={cn(
                            "h-full",
                            staff.performance > 90 ? "bg-emerald-500" : 
                            staff.performance > 80 ? "bg-amber-500" : "bg-rose-500"
                          )} 
                          style={{ width: `${staff.performance}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-xs text-slate-500 font-medium">{staff.joinDate}</td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => openEditModal(staff)}
                        className="p-2 text-slate-400 hover:text-blue-600 transition-colors"
                      >
                        <Edit size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(staff.id)}
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
          <p className="text-xs text-slate-400 font-medium">Hiển thị 5 trong số 42 nhân sự</p>
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
                  {editingMember ? "Sửa thông tin nhân viên" : "Thêm nhân viên mới"}
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
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400">Họ và tên</label>
                    <input 
                      type="text" 
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="Nguyễn Văn A"
                      className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-emerald-500/20 outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400">Vai trò</label>
                    <select 
                      className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-emerald-500/20 outline-none"
                      value={formData.role}
                      onChange={(e) => setFormData({...formData, role: e.target.value as any})}
                    >
                      <option>Quản trị viên</option>
                      <option>Kỹ thuật viên</option>
                      <option>Công nhân</option>
                      <option>Kế toán</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400">Email</label>
                    <input 
                      type="email" 
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder="email@agriintel.com"
                      className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-emerald-500/20 outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400">Số điện thoại</label>
                    <input 
                      type="text" 
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      placeholder="09xx xxx xxx"
                      className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-emerald-500/20 outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400">Trạng thái</label>
                    <select 
                      className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-emerald-500/20 outline-none"
                      value={formData.status}
                      onChange={(e) => setFormData({...formData, status: e.target.value as any})}
                    >
                      <option>Đang làm việc</option>
                      <option>Nghỉ phép</option>
                      <option>Vắng mặt</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400">Hiệu suất (%)</label>
                    <input 
                      type="number" 
                      required
                      min="0"
                      max="100"
                      value={formData.performance}
                      onChange={(e) => setFormData({...formData, performance: parseInt(e.target.value)})}
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
