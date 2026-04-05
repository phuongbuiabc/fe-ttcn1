"use client";

import React, { useState } from "react";
import { 
  Search, 
  Filter, 
  Plus, 
  MoreVertical, 
  ChevronRight,
  UserPlus,
  Download,
  Eye,
  Edit2,
  Trash2,
  Mail,
  Phone
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import Image from "next/image";

import { StaffModal } from "@/components/StaffModal";
import { AlertCircle, CheckCircle2 } from "lucide-react";

const staffMembers = [
  {
    id: "EMP-2041",
    name: "Phạm Văn Nam",
    role: "Kỹ thuật viên",
    category: "Thú y",
    phone: "090 123 4567",
    shift: "Ca Sáng",
    status: "Đang làm",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAGNQo2u1DZ_xoL5qTsa0t0k-jFOFC-sIpSiOuLeHZAcOw-6ekYhq0jSk2qjybEJYKHDZ-MURjb4xL9suwyXklDbKyqwfS-EA5x5zekjF-L_FIIHaF0lPy1Vvj9_tdXnuT8Ffw4cGmfPQD9aNONE8ax2vPARK3kPkuqUlDsqem2lzyHRog3yblqW8GCBIOhRLocju2ISZqqsitTSg6zCK5jg_0urqjb2pudfIYJ48PfNE0nrsNaBgI8ejUzk9aaaZG28kW6btmHQyDN"
  },
  {
    id: "EMP-2042",
    name: "Nguyễn Thị Mai",
    role: "Trưởng nhóm",
    category: "Quản lý",
    phone: "091 987 6543",
    shift: "Ca Chiều",
    status: "Đang làm",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuD3fRjga91Ve82sQYlJ2LKr7jut_lOz_FMh8c5JdHBpws3Ot5g120rNAldxR7nIz9qL8ZmoDuNTv9JlUlxMT60XI81XnbuvSon9T02e8tQP5fMZr2VE940UV8TweEMrj71iL1RYIPEZfYai7RLruJjD0UuhtgOwclgsTawvCur0NlqFeTuL16LQ9fg7zUBo95b8INfkugIFGe1HYQiyKhRnxACWTirN7-3DkmbxLgETMpbUPfd7aJRZ0ZK4-p4NWeXfcssQd_fnUNSR"
  },
  {
    id: "EMP-2043",
    name: "Trần Anh Tuấn",
    role: "Công nhân",
    category: "Nhân viên",
    phone: "098 555 1234",
    shift: "-",
    status: "Nghỉ",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuC-KcqXMCNHZXypt91kH4JURI5lZ_koBxZcwRcP57LK9eXr6t5Raqt4Vh8Uk1zi_h563nIa-GCeD6PirvwbB8aTBhe59lrxuKGdfoeNQyA7-94frPXJZ7OJjZpi6wV_iLpk4zJo_q8hDWjjJRpGXRGkmkRMjK2KvPGGRJh-1ebQHMSghhwW4wlUehhmRa9X0crXON4Vx7iJA2SM4mD8PX_KdqzXrn2uQX9PEesrTlSV9ar-hIsyd1hLElzyba3BIhmYmsLfJcvhUMoV"
  },
  {
    id: "EMP-2044",
    name: "Lê Thị Hoa",
    role: "Phụ tá thú y",
    category: "Thú y",
    phone: "097 333 4444",
    shift: "Ca Đêm",
    status: "Đang làm",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuA_xmt3fSNiOyUkAm4Ux8gNu2h603ZPfbzXJfUMIxqnS6Ze-pW8-AnwaNOaWxGRLS6d1Fi5BEAbG4mbFLsjZ9PhQSv-17Ad8Pdozxw__6HO6MP-7tDU6LoOz014JcdPkkhcvr4Xbwyv_WX2cwwmq03R9f6441wh3qNNV2w-F8pgf1TeyC7nYJ6hm8E_-xDxHCAsa6AbWPDrHlzuZLW8a1mOwFjZP6i7G49v1m1dfpeASAJURUti0PbEQk_gFNKUdoCLV1Odl7OwyT-u"
  }
];

export default function StaffPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<any>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [staffToDelete, setStaffToDelete] = useState<any>(null);

  const filteredStaff = staffMembers.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddStaff = () => {
    setSelectedStaff(null);
    setIsModalOpen(true);
  };

  const handleEditStaff = (staff: any) => {
    setSelectedStaff(staff);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (staff: any) => {
    setStaffToDelete(staff);
    setIsDeleteModalOpen(true);
  };

  return (
    <div className="space-y-10">
      <StaffModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        staff={selectedStaff}
      />

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDeleteModalOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl p-10 text-center"
            >
              <div className="w-20 h-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <AlertCircle size={40} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Xác nhận xóa?</h3>
              <p className="text-slate-500 mb-8">
                Bạn có chắc chắn muốn xóa nhân viên <span className="font-bold text-slate-900">{staffToDelete?.name}</span>? Hành động này không thể hoàn tác.
              </p>
              <div className="flex gap-4">
                <button 
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="flex-1 py-4 bg-slate-50 text-slate-700 rounded-2xl text-sm font-bold hover:bg-slate-100 transition-all"
                >
                  Hủy bỏ
                </button>
                <button 
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="flex-1 py-4 bg-red-500 text-white rounded-2xl text-sm font-bold hover:bg-red-600 transition-all shadow-lg shadow-red-500/20"
                >
                  Xác nhận xóa
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* Breadcrumbs & Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <nav className="flex text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold mb-2">
            <span className="hover:text-emerald-600 cursor-pointer transition-colors">Cơ sở dữ liệu</span>
            <span className="mx-2 text-slate-300">/</span>
            <span className="text-emerald-600">Nhân sự</span>
          </nav>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight font-headline">Danh sách Nhân viên</h1>
          <p className="text-slate-500 mt-1 font-medium">Quản lý đội ngũ vận hành trang trại MDFARM.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-6 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm flex items-center gap-2">
            <Download size={18} />
            Xuất dữ liệu
          </button>
          <button 
            onClick={handleAddStaff}
            className="px-6 py-3 bg-gradient-to-br from-[#006c49] to-[#10b981] text-white rounded-2xl text-sm font-bold hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-emerald-900/20 flex items-center gap-2"
          >
            <UserPlus size={18} />
            Thêm nhân viên
          </button>
        </div>
      </div>

      {/* Toolbar & Filters */}
      <div className="bg-white p-4 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4 flex-grow">
          <div className="relative w-full max-w-md group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Tìm theo tên hoặc mã nhân viên..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-6 py-3 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-emerald-500/20 focus:bg-white transition-all outline-none text-slate-700 font-medium"
            />
          </div>
          <div className="flex items-center gap-2">
            <select className="bg-slate-50 border-none rounded-xl px-4 py-3 text-xs font-bold text-slate-600 outline-none ring-1 ring-slate-200 focus:ring-emerald-500 transition-all">
              <option>Chức vụ: Tất cả</option>
              <option>Quản lý</option>
              <option>Kỹ thuật viên</option>
              <option>Thú y</option>
              <option>Công nhân</option>
            </select>
            <select className="bg-slate-50 border-none rounded-xl px-4 py-3 text-xs font-bold text-slate-600 outline-none ring-1 ring-slate-200 focus:ring-emerald-500 transition-all">
              <option>Trạng thái: Tất cả</option>
              <option>Đang làm</option>
              <option>Nghỉ</option>
            </select>
          </div>
        </div>
        <button className="p-3 bg-slate-50 text-slate-500 rounded-xl hover:bg-slate-100 transition-all">
          <Filter size={20} />
        </button>
      </div>

      {/* Staff Table */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">ID</th>
                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Họ và Tên</th>
                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Số điện thoại</th>
                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Chức vụ</th>
                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Ca làm</th>
                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Trạng thái</th>
                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              <AnimatePresence mode="popLayout">
                {filteredStaff.map((staff, i) => (
                  <motion.tr 
                    key={staff.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: i * 0.05 }}
                    className="hover:bg-slate-50/50 transition-colors group cursor-pointer"
                  >
                    <td className="px-8 py-6 text-sm font-bold text-slate-400">{staff.id}</td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="relative w-12 h-12 rounded-2xl overflow-hidden ring-2 ring-slate-100 group-hover:ring-emerald-100 transition-all">
                          <Image 
                            src={staff.avatar} 
                            alt={staff.name} 
                            fill 
                            className={cn("object-cover", staff.status === "Nghỉ" && "grayscale opacity-60")}
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">{staff.name}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">{staff.role}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-sm font-medium text-slate-600">{staff.phone}</td>
                    <td className="px-8 py-6">
                      <span className={cn(
                        "px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider",
                        staff.category === "Thú y" ? "bg-emerald-50 text-emerald-600" :
                        staff.category === "Quản lý" ? "bg-blue-50 text-blue-600" : "bg-slate-100 text-slate-600"
                      )}>
                        {staff.category}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-sm font-bold text-slate-700">{staff.shift}</td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        <div className={cn(
                          "w-2 h-2 rounded-full",
                          staff.status === "Đang làm" ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-red-400"
                        )} />
                        <span className={cn(
                          "text-xs font-bold",
                          staff.status === "Đang làm" ? "text-emerald-700" : "text-red-600"
                        )}>{staff.status}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link 
                          href={`/staff/${staff.id}`}
                          className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"
                        >
                          <Eye size={18} />
                        </Link>
                        <button 
                          onClick={() => handleEditStaff(staff)}
                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button 
                          onClick={() => handleDeleteClick(staff)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
        
        {/* Pagination Footer */}
        <div className="p-8 bg-slate-50/50 border-t border-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest text-center sm:text-left">Hiển thị {filteredStaff.length} trên 24 nhân viên</p>
          <div className="flex items-center gap-2">
            <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-emerald-600 hover:border-emerald-200 transition-all">
              <ChevronRight size={20} className="rotate-180" />
            </button>
            <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-emerald-600 text-white font-bold text-sm shadow-lg shadow-emerald-900/20">1</button>
            <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all">2</button>
            <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all">3</button>
            <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-emerald-600 hover:border-emerald-200 transition-all">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
