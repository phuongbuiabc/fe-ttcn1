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
import { useEffect } from "react";
import { staffService } from "@/entities/staff/api/staff.service";
import { Employee, ApiResponse } from "@/shared/types";


export default function StaffPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [members, setMembers] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Employee | null>(null);

  // Form State
  const [formData, setFormData] = useState<any>({
    employeeCode: "",
    firstName: "",
    lastName: "",
    gender: "MALE",
    dateOfBirth: "",
    permanentAddress: "",
    currentAddress: "",
    email: "",
    phone: "",
    position: "Công nhân",
  });

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const response = await staffService.getEmployees();
      if (response.success) {
        setMembers(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch staff:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const openAddModal = () => {
    setEditingMember(null);
    setFormData({
      employeeCode: `NV${Math.floor(100 + Math.random() * 900)}`,
      firstName: "",
      lastName: "",
      gender: "MALE",
      dateOfBirth: "",
      permanentAddress: "",
      currentAddress: "",
      email: "",
      phone: "",
      position: "Công nhân",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (member: Employee) => {
    setEditingMember(member);
    setFormData({
      employeeCode: member.employeeCode,
      firstName: member.firstName,
      lastName: member.lastName,
      gender: member.gender,
      dateOfBirth: member.dateOfBirth,
      permanentAddress: member.permanentAddress,
      currentAddress: member.currentAddress,
      email: member.email,
      phone: member.phone,
      position: member.position,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa nhân viên này không?")) {
      try {
        await staffService.deleteEmployee(id);
        setMembers(members.filter(m => m.id !== id));
      } catch (error) {
        alert("Xóa nhân viên thất bại!");
      }
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingMember) {
        const response = await staffService.updateEmployee(editingMember.id, formData);
        if (response.success) {
          setMembers(members.map(m => m.id === editingMember.id ? response.data : m));
        }
      } else {
        const response = await staffService.createEmployee(formData);
        if (response.success) {
          setMembers([response.data, ...members]);
        }
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error("Save failed:", error);
      alert("Lưu thông tin thất bại!");
    }
  };

  const filteredMembers = members.filter(m =>
    (m.fullName || `${m.lastName} ${m.firstName}`).toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.employeeCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            <h3 className="text-4xl font-headline font-black text-slate-900">{members.length}</h3>
            <span className="text-emerald-600 text-xs font-bold">Thực tế</span>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <p className="text-slate-400 text-[10px] uppercase font-bold tracking-widest mb-2">Chức danh</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-4xl font-headline font-black text-amber-600">{new Set(members.map(m => m.position)).size}</h3>
            <span className="text-slate-400 text-xs font-bold">Vị trí</span>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <p className="text-slate-400 text-[10px] uppercase font-bold tracking-widest mb-2">Hiệu suất TB</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-4xl font-headline font-black text-slate-900">--%</h3>
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
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Giới tính</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Chức vụ</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Liên hệ</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Trình độ</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Ngày sinh</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-slate-400">Đang tải dữ liệu...</td>
                </tr>
              ) : filteredMembers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-slate-400">Không tìm thấy nhân viên nào.</td>
                </tr>
              ) : filteredMembers.map((staff) => (
                <tr key={staff.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm flex items-center justify-center bg-emerald-50 text-emerald-600 font-bold text-xs uppercase">
                        {staff.firstName.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 text-sm">{staff.fullName || `${staff.lastName} ${staff.firstName}`}</p>
                        <p className="text-[10px] text-slate-400 font-medium">ID: {staff.employeeCode}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-xs text-slate-600">{staff.gender}</td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                      <div className={cn(
                        "w-2 h-2 rounded-full",
                        staff.position.includes("Quản trị") ? "bg-rose-500" :
                          staff.position.includes("Kỹ thuật") ? "bg-blue-500" :
                            staff.position.includes("Kế toán") ? "bg-amber-500" : "bg-slate-400"
                      )} />
                      <span className="text-xs font-bold text-slate-700">{staff.position}</span>
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
                    <span className="text-xs text-slate-600 truncate max-w-[150px] block" title={staff.currentAddress}>{staff.currentAddress}</span>
                  </td>
                  <td className="px-6 py-5 text-xs text-slate-500 font-medium">{staff.dateOfBirth}</td>
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
          <p className="text-xs text-slate-400 font-medium">
            Hiển thị {filteredMembers.length} trong số {members.length} nhân sự
          </p>
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
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400">Họ</label>
                    <input
                      type="text"
                      required
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      placeholder="Nguyễn Văn"
                      className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-emerald-500/20 outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400">Tên</label>
                    <input
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      placeholder="An"
                      className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-emerald-500/20 outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400">Giới tính</label>
                    <select
                      className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-emerald-500/20 outline-none"
                      value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    >
                      <option value="MALE">Nam</option>
                      <option value="FEMALE">Nữ</option>
                      <option value="OTHER">Khác</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400">Ngày sinh</label>
                    <input
                      type="date"
                      required
                      value={formData.dateOfBirth}
                      onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-emerald-500/20 outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400">Mã nhân viên</label>
                    <input
                      type="text"
                      required
                      value={formData.employeeCode}
                      onChange={(e) => setFormData({ ...formData, employeeCode: e.target.value })}
                      placeholder="NV001"
                      className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-emerald-500/20 outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400">Email</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="email@gmail.com"
                      className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-emerald-500/20 outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400">Số điện thoại</label>
                    <input
                      type="text"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="09xx xxx xxx"
                      className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-emerald-500/20 outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400">Chức danh</label>
                    <input
                      type="text"
                      required
                      value={formData.position}
                      onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                      placeholder="Kỹ thuật viên"
                      className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-emerald-500/20 outline-none"
                    />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400">Địa chỉ thường trú</label>
                    <input
                      type="text"
                      required
                      value={formData.permanentAddress}
                      onChange={(e) => setFormData({ ...formData, permanentAddress: e.target.value, currentAddress: e.target.value })}
                      placeholder="Hà Nội"
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
