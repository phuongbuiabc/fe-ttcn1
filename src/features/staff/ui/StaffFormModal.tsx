"use client";

import React from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface StaffFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (e: React.FormEvent) => void;
  editingMember: any | null;
  formData: any;
  setFormData: (data: any) => void;
}

export function StaffFormModal({ 
  isOpen, 
  onClose, 
  onSave, 
  editingMember, 
  formData, 
  setFormData 
}: StaffFormModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }} 
          onClick={onClose} 
          className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" 
        />
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }} 
          animate={{ scale: 1, opacity: 1 }} 
          exit={{ scale: 0.95, opacity: 0 }} 
          className="relative w-full max-w-2xl bg-white rounded-[1.75rem] shadow-2xl overflow-hidden shadow-[#00a67d]/5"
        >
          <div className="p-8 border-b border-slate-50 flex items-center justify-between">
            <h3 className="text-2xl font-extrabold text-slate-800 uppercase tracking-tight">
              {editingMember ? "Cập nhật nhân viên" : "Nhân viên mới"}
            </h3>
            <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-xl transition-all">
              <X />
            </button>
          </div>
          <form onSubmit={onSave} className="p-10 space-y-6 max-h-[70vh] overflow-y-auto scrollbar-none">
            <div className="grid grid-cols-2 gap-6">
              <div className="col-span-2 space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Mã nhân viên (ID)</label>
                <input 
                  type="text" required 
                  value={formData.employee_id} 
                  onChange={e => setFormData({...formData, employee_id: e.target.value})} 
                  className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-[#00a67d]/10" 
                />
              </div>
              <div className="col-span-2 space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Họ và tên</label>
                <input 
                  type="text" required 
                  value={formData.full_name} 
                  onChange={e => setFormData({...formData, full_name: e.target.value})} 
                  className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-[#00a67d]/10" 
                  placeholder="Nguyễn Văn An" 
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Giới tính</label>
                <select 
                  value={formData.gender} 
                  onChange={e => setFormData({...formData, gender: e.target.value})} 
                  className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold outline-none"
                >
                  <option>Nam</option>
                  <option>Nữ</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Ngày sinh</label>
                <input 
                  type="date" required 
                  value={formData.birth_date} 
                  onChange={e => setFormData({...formData, birth_date: e.target.value})} 
                  className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-[#00a67d]/10" 
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Chức danh</label>
                <input 
                  type="text" required 
                  value={formData.position} 
                  onChange={e => setFormData({...formData, position: e.target.value})} 
                  className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-[#00a67d]/10" 
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Số điện thoại</label>
                <input 
                  type="text" required 
                  value={formData.phone} 
                  onChange={e => setFormData({...formData, phone: e.target.value})} 
                  className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-[#00a67d]/10" 
                />
              </div>
              <div className="col-span-2 space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Email</label>
                <input 
                  type="email" required 
                  value={formData.email} 
                  onChange={e => setFormData({...formData, email: e.target.value})} 
                  className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-[#00a67d]/10" 
                />
              </div>
              <div className="col-span-2 space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Trình độ</label>
                <input 
                  type="text" 
                  value={formData.qualification} 
                  onChange={e => setFormData({...formData, qualification: e.target.value})} 
                  className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-[#00a67d]/10" 
                  placeholder="Đại học, Cao đẳng..." 
                />
              </div>
              <div className="col-span-2 space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Địa chỉ thường trú</label>
                <input 
                  type="text" required 
                  value={formData.address} 
                  onChange={e => setFormData({...formData, address: e.target.value})} 
                  className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-[#00a67d]/10" 
                />
              </div>
            </div>
            <button 
              type="submit" 
              className="w-full py-5 bg-[#00a67d] text-white rounded-2xl text-xs font-black uppercase tracking-[0.2em] shadow-xl active:scale-[0.98] transition-all"
            >
              Lưu hồ sơ nhân viên
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

