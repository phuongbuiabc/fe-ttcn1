"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  UserPlus,
  Edit,
  Trash2,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { staffService } from "@/modules/staff/api/staff.service";
import { authService } from "@/modules/auth/api/auth.service";

import { Employee, CreateEmployeeRequest } from "@/shared/types";
import { StaffFormModal } from "@/modules/staff/ui/StaffFormModal";
import { StaffDetailModal } from "@/modules/staff/ui/StaffDetailModal";
import { StaffTable } from "@/modules/staff/ui/StaffTable";

export default function StaffPage() {

  const [searchTerm, setSearchTerm] = useState("");
  const [members, setMembers] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modals Status
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Selected Data
  const [editingMember, setEditingMember] = useState<Employee | null>(null);
  const [selectedForDetail, setSelectedForDetail] = useState<Employee | null>(null);
  const [selectedStaffForDelete, setSelectedStaffForDelete] = useState<Employee | null>(null);

  const [formData, setFormData] = useState<any>({
    userId: "", firstName: "", lastName: "", email: "", phone: "", dateOfBirth: "", gender: "MALE", currentAddress: "", position: "Công nhân",
    password: ""
  });

  const fetchMembers = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      const res = await staffService.getEmployees();
      if (res.success) setMembers(res.data);
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  useEffect(() => {
    const cached = staffService.getCachedEmployees();
    if (cached) {
      setMembers(cached);
      setLoading(false);
      fetchMembers(false);
    } else {
      fetchMembers(true);
    }
  }, []);

  const openAddModal = () => {
    setEditingMember(null);
    setFormData({
      userId: "", firstName: "", lastName: "", email: "", phone: "", dateOfBirth: "", gender: "MALE", currentAddress: "", position: "Kỹ thuật viên",
      password: ""
    });

    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    let res;
    let finalUserId = formData.userId;

    try {
      // Step 1: Create User Account for new staff
      if (!editingMember) {
        const regRes = await authService.register({
          givenName: formData.firstName,
          familyName: formData.lastName,
          email: formData.email,
          password: formData.password
        });
        
        if (!regRes.success) {
          alert(regRes.message || "Không thể tạo tài khoản người dùng");
          return;
        }
        // Correct path based on Swagger: regRes.data.user.id
        finalUserId = regRes.data.user.id;
      }

      // Step 2: Create/Update Employee Profile
      const { password, ...employeeData } = { ...formData, userId: finalUserId };
      
      if (editingMember) {
        res = await staffService.updateEmployee(editingMember.id, employeeData);
      } else {
        res = await staffService.createEmployee(employeeData);
      }


      if (res.success) {
        fetchMembers(false);
        setIsModalOpen(false);
      } else {
        alert(res.message || "Có lỗi xảy ra khi tạo hồ sơ");
      }
    } catch (error: any) {
      alert(error.message || "Lỗi hệ thống");
    }
  };


  const confirmDelete = async () => {
    if (selectedStaffForDelete) {
      const res = await staffService.deleteEmployee(selectedStaffForDelete.id);
      if (res.success) {
        fetchMembers(false);
        setIsDeleteModalOpen(false);
      } else {
        alert(res.message || "Không thể xóa nhân viên");
      }
    }
  };

  const filteredMembers = members.filter(m =>
    (m.firstName + " " + m.lastName).toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.position.toLowerCase().includes(searchTerm.toLowerCase())
  );


  return (
    <div className="space-y-6 pb-20 bg-[#fbfcfd] min-h-screen -m-6 p-6">
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
      <div className="bg-white rounded-[1.75rem] border border-slate-100 shadow-sm overflow-hidden">
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
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white rounded-[2.5rem] w-full max-w-md shadow-2xl p-10 text-center"><div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-6"><Trash2 size={32} /></div><p className="text-xl font-extrabold text-slate-800 mb-2 uppercase">Xác nhận xóa?</p><p className="text-slate-500 text-sm mb-8 leading-relaxed">Hồ sơ nhân viên <span className="font-bold text-slate-900">{selectedStaffForDelete.firstName} {selectedStaffForDelete.lastName}</span> sẽ bị gỡ khỏi hệ thống.</p><div className="flex gap-4"><button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 py-4 bg-slate-100 text-slate-700 rounded-2xl text-sm font-bold">Hủy bỏ</button><button onClick={confirmDelete} className="flex-1 py-4 bg-rose-500 text-white rounded-2xl text-sm font-bold shadow-lg shadow-rose-900/20 active:scale-95 transition-all">Xác nhận xóa</button></div></motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

