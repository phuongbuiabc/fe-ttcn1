"use client";

import React from "react";
import { X, Save } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface SupplierFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (e: React.FormEvent) => void;
  editingSupplier: any | null;
  formData: any;
  setFormData: (data: any) => void;
}

export function SupplierFormModal({
  isOpen,
  onClose,
  onSave,
  editingSupplier,
  formData,
  setFormData
}: SupplierFormModalProps) {
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
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-white rounded-[1.75rem] shadow-2xl overflow-hidden"
        >
          <form onSubmit={onSave} className="p-8">
            <div className="flex items-center justify-between mb-8 text-emerald-600 font-headline">
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase">
                  {editingSupplier ? "Cập nhật Nhà cung cấp" : "Thêm Nhà cung cấp mới"}
                </h2>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Vui lòng nhập đầy đủ thông tin đối tác.</p>
              </div>
              <button 
                type="button"
                onClick={onClose}
                className="p-4 bg-slate-50 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-2xl transition-all"
              >
                <X size={20} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Mã nhà cung cấp</label>
                <input 
                  type="text"
                  required
                  value={formData.supplierCode}
                  onChange={(e) => setFormData({...formData, supplierCode: e.target.value})}
                  placeholder="NCC001"
                  className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all placeholder:text-slate-300"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Loại nhà cung cấp</label>
                <select 
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                  className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-emerald-500/20 outline-none appearance-none"
                >
                  <option>Thức ăn</option>
                  <option>Thuốc thú y</option>
                  <option>Dụng cụ</option>
                  <option>Con giống</option>
                </select>
              </div>
              <div className="col-span-2 space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Tên nhà cung cấp</label>
                <input 
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Công ty CP Việt Nam"
                  className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all placeholder:text-slate-300"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Số điện thoại</label>
                <input 
                  type="text"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  placeholder="024 123 456"
                  className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all placeholder:text-slate-300"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email liên hệ</label>
                <input 
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="info@ncc.vn"
                  className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all placeholder:text-slate-300"
                />
              </div>
              <div className="col-span-2 space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Địa chỉ trụ sở</label>
                <input 
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  placeholder="KCN Đông Anh, Hà Nội"
                  className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all placeholder:text-slate-300"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <button 
                type="button"
                onClick={onClose}
                className="flex-1 py-4 bg-slate-50 text-slate-700 rounded-2xl text-xs font-black uppercase tracking-[0.2em] transition-all"
              >
                Hủy bỏ
              </button>
              <button 
                type="submit"
                className="flex-[2] py-4 bg-[#00a67d] text-white rounded-2xl text-xs font-black uppercase tracking-[0.2em] hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-emerald-900/10 flex items-center justify-center gap-2"
              >
                <Save size={18} />
                {editingSupplier ? "Cập nhật" : "Lưu đối tác"}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

