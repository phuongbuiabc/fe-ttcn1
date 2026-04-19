"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  UserPlus,
  Edit,
  Trash2,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { staffService } from "@/entities/staff/api/staff.service";

// Feature Components
import { StaffFormModal } from "@/features/staff/ui/StaffFormModal";
import { StaffDetailModal } from "@/features/staff/ui/StaffDetailModal";
import { StaffTable } from "@/features/staff/ui/StaffTable";

// --- Mock Data ---
const mockEmployees: any[] = [
  { id: "m-001", employee_id: "NV001", full_name: "Nguyễn Quang Minh", gender: "Nam", birth_date: "1992-05-15", address: "Ba Đình, Hà Nội", phone: "0912.345.678", email: "minh.nq@mdfarm.vn", position: "Quản lý Kỹ thuật", qualification: "Thạc sĩ Chăn nuôi" },
  { id: "m-002", employee_id: "NV002", full_name: "Trần Thị Hường", gender: "Nữ", birth_date: "1995-08-22", address: "Từ Sơn, Bắc Ninh", phone: "0988.777.666", email: "huong.tt@mdfarm.vn", position: "Bác sĩ Thú y", qualification: "Bác sĩ Thú y" },
  { id: "m-003", employee_id: "NV003", full_name: "Lê Văn Hải", gender: "Nam", birth_date: "1990-11-02", address: "Thanh Hóa", phone: "0977.123.456", email: "hai.lv@mdfarm.vn", position: "Kỹ thuật Chăn nuôi", qualification: "Đại học Nông nghiệp" },
  { id: "m-004", employee_id: "NV004", full_name: "Phạm Phương Thảo", gender: "Nữ", birth_date: "1998-03-30", address: "Cẩm Giàng, Hải Dương", phone: "0345.678.901", email: "thao.pp@mdfarm.vn", position: "Kế toán Kho", qualification: "Cử nhân Kế toán" },
  { id: "m-005", employee_id: "NV005", full_name: "Hoàng Anh Tuấn", gender: "Nam", birth_date: "1994-12-12", address: "Kim Động, Hưng Yên", phone: "0909.123.456", email: "tuan.ha@mdfarm.vn", position: "Vận hành Hệ thống", qualification: "Cao đẳng Kỹ thuật" }
];

export default function StaffPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modals Status
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Selected Data
  const [editingMember, setEditingMember] = useState<any | null>(null);
  const [selectedForDetail, setSelectedForDetail] = useState<any | null>(null);
  const [selectedStaffForDelete, setSelectedStaffForDelete] = useState<any | null>(null);

  const [formData, setFormData] = useState<any>({
    employee_id: "", full_name: "", gender: "Nam", birth_date: "", address: "", phone: "", email: "", position: "Công nhân", qualification: ""
  });

  useEffect(() => {
    setTimeout(() => {
      setMembers(mockEmployees);
      setLoading(false);
    }, 600);
  }, []);

  const openAddModal = () => {
    setEditingMember(null);
    setFormData({
      employee_id: `NV${Math.floor(100 + Math.random() * 900)}`, full_name: "", gender: "Nam", birth_date: "", address: "", phone: "", email: "", position: "Kỹ thuật viên", qualification: ""
    });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingMember) {
      setMembers(members.map(m => m.id === editingMember.id ? { ...formData, id: editingMember.id } : m));
    } else {
      setMembers([{ ...formData, id: `m-${Math.random()}` }, ...members]);
    }
    setIsModalOpen(false);
  };

  const filteredMembers = members.filter(m =>
    m.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.employee_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.position.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-20 bg-[#fbfcfd] min-h-screen -m-8 p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight font-headline uppercase">Hồ sơ Nhân sự</h1>
        </div>
        <button
          onClick={openAddModal}
          className="px-8 py-3 bg-[#00a67d] text-white rounded-full text-sm font-bold shadow-lg shadow-emerald-900/10 flex items-center gap-2 hover:bg-[#008f6b] active:scale-95 transition-all"
        >
          <UserPlus size={18} /> Thêm nhân viên
        </button>
      </div>

      {/* Control Bar */}
      <div className="flex flex-col lg:flex-row justify-between items-center gap-6 bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
        <div className="relative flex-1 max-w-md w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Tìm theo tên, mã NV, chức vụ..."
            className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-[#00a67d]/10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="px-5 py-3 bg-[#f1f3f5] text-slate-400 text-[10px] font-black uppercase tracking-widest rounded-xl">
          Đang hiển thị: {filteredMembers.length} thành viên
        </div>
      </div>

      {/* Member List */}
      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
        <StaffTable 
          staffs={filteredMembers} 
          loading={loading}
          onView={(s) => { setSelectedForDetail(s); setIsDetailModalOpen(true); }}
          onEdit={(s) => { setEditingMember(s); setFormData(s); setIsModalOpen(true); }}
          onDelete={(s) => { setSelectedStaffForDelete(s); setIsDeleteModalOpen(true); }}
        />
      </div>

      {/* Feature Modals */}
      <StaffFormModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSave} 
        editingMember={editingMember} 
        formData={formData} 
        setFormData={setFormData} 
      />

      <StaffDetailModal 
        isOpen={isDetailModalOpen} 
        onClose={() => setIsDetailModalOpen(false)} 
        staff={selectedForDetail} 
      />

      {/* Delete Confirmation (Could be moved to Shared later) */}
      <AnimatePresence>
        {isDeleteModalOpen && selectedStaffForDelete && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white rounded-[2.5rem] w-full max-w-md shadow-2xl p-10 text-center"><div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-6"><Trash2 size={32} /></div><p className="text-xl font-extrabold text-slate-800 mb-2 uppercase">Xác nhận xóa?</p><p className="text-slate-500 text-sm mb-8 leading-relaxed">Hồ sơ nhân viên <span className="font-bold text-slate-900">{selectedStaffForDelete.full_name}</span> sẽ bị gỡ khỏi hệ thống.</p><div className="flex gap-4"><button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 py-4 bg-slate-100 text-slate-700 rounded-2xl text-sm font-bold">Hủy bỏ</button><button onClick={() => { setMembers(members.filter(m => m.id !== selectedStaffForDelete.id)); setIsDeleteModalOpen(false); }} className="flex-1 py-4 bg-rose-500 text-white rounded-2xl text-sm font-bold shadow-lg shadow-rose-900/20 active:scale-95 transition-all">Xác nhận xóa</button></div></motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
