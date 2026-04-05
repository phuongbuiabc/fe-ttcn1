"use client";

import React from "react";
import { X, Building2, User, Mail, Phone, MapPin, Briefcase, Save } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

interface SupplierModalProps {
  isOpen: boolean;
  onClose: () => void;
  supplier?: any;
}

export function SupplierModal({ isOpen, onClose, supplier }: SupplierModalProps) {
  if (!isOpen) return null;

  const isEditing = !!supplier;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-white rounded-[3rem] shadow-2xl overflow-hidden"
        >
          <div className="p-10">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 font-manrope">
                  {isEditing ? "Chỉnh sửa Nhà cung cấp" : "Thêm Nhà cung cấp mới"}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {isEditing ? `Cập nhật thông tin cho ${supplier.name}` : "Điền thông tin chi tiết để tạo hồ sơ nhà cung cấp."}
                </p>
              </div>
              <button 
                onClick={onClose}
                className="p-3 bg-gray-50 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-2xl transition-all"
              >
                <X size={20} />
              </button>
            </div>

            <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Tên công ty / Nhà cung cấp</label>
                <div className="relative">
                  <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input 
                    type="text" 
                    defaultValue={supplier?.name}
                    placeholder="Công ty CP / Tập đoàn De Heus..." 
                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-emerald-500 transition-all outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Người liên hệ</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                      type="text" 
                      defaultValue={supplier?.contact}
                      placeholder="Nguyễn Văn A" 
                      className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-emerald-500 transition-all outline-none"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Lĩnh vực</label>
                  <div className="relative">
                    <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <select 
                      defaultValue={supplier?.category}
                      className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-emerald-500 transition-all outline-none appearance-none"
                    >
                      <option>Thức ăn</option>
                      <option>Thuốc</option>
                      <option>Phân bón</option>
                      <option>Hạt giống</option>
                      <option>Khác</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                      type="email" 
                      defaultValue={supplier?.email}
                      placeholder="contact@company.com" 
                      className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-emerald-500 transition-all outline-none"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Số điện thoại</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                      type="tel" 
                      defaultValue={supplier?.phone}
                      placeholder="028 3844 1122" 
                      className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-emerald-500 transition-all outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Địa chỉ</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input 
                    type="text" 
                    defaultValue={supplier?.address}
                    placeholder="Địa chỉ trụ sở / kho bãi..." 
                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-emerald-500 transition-all outline-none"
                  />
                </div>
              </div>

              <div className="pt-6 flex gap-4">
                <button 
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-4 bg-gray-50 text-gray-700 rounded-2xl text-sm font-bold hover:bg-gray-100 transition-all"
                >
                  Hủy bỏ
                </button>
                <button 
                  type="submit"
                  className="flex-[2] py-4 bg-[#006c49] text-white rounded-2xl text-sm font-bold hover:bg-emerald-800 transition-all shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-2"
                >
                  <Save size={18} />
                  {isEditing ? "Cập nhật nhà cung cấp" : "Lưu nhà cung cấp"}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
