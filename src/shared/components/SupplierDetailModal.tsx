"use client";

import React from "react";
import { 
  X, 
  Building2, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase, 
  History,
  Calendar,
  DollarSign,
  Package,
  ExternalLink,
  ShieldCheck
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/shared/lib/utils";

interface SupplierDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  supplier: any;
}

// Mock purchase history data
const mockHistory = [
  { id: "ORD-001", date: "02/04/2024", item: "Thức ăn hỗn hợp heo con", quantity: "50 bao", total: "25,000,000 đ", status: "Đã giao" },
  { id: "ORD-002", date: "15/03/2024", item: "Thức ăn nái nuôi con", quantity: "100 bao", total: "52,000,000 đ", status: "Đã giao" },
  { id: "ORD-003", date: "28/02/2024", item: "Premix khoáng vi lượng", quantity: "20 bao", total: "15,500,000 đ", status: "Đã giao" },
  { id: "ORD-004", date: "10/02/2024", item: "Thức ăn vỗ béo", quantity: "200 bao", total: "110,000,000 đ", status: "Đã giao" },
];

export function SupplierDetailModal({ isOpen, onClose, supplier }: SupplierDetailModalProps) {
  if (!isOpen || !supplier) return null;

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
          className="relative w-full max-w-4xl bg-white rounded-[3rem] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        >
          {/* Header */}
          <div className="p-10 pb-6 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-700 rounded-3xl flex items-center justify-center shadow-inner">
                <Building2 size={32} />
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="text-3xl font-extrabold text-gray-900 font-manrope tracking-tight">
                    {supplier.name}
                  </h3>
                  <span className={cn(
                    "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                    supplier.status === "Tin cậy" ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-blue-700"
                  )}>
                    {supplier.status}
                  </span>
                </div>
                <p className="text-sm text-gray-500 font-medium mt-1">Mã nhà cung cấp: SUP-{supplier.id.padStart(4, '0')}</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-3 bg-gray-50 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-2xl transition-all"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-10 space-y-12 no-scrollbar">
            {/* Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-6">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <User size={14} className="text-emerald-600" />
                  Thông tin liên hệ
                </h4>
                <div className="space-y-4">
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Người đại diện</p>
                    <p className="text-sm font-bold text-gray-900">{supplier.contact}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Email</p>
                    <p className="text-sm font-medium text-emerald-700 underline decoration-emerald-200 underline-offset-4">{supplier.email}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Số điện thoại</p>
                    <p className="text-sm font-bold text-gray-900">{supplier.phone}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <MapPin size={14} className="text-emerald-600" />
                  Địa chỉ & Lĩnh vực
                </h4>
                <div className="space-y-4">
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Địa chỉ đầy đủ</p>
                    <p className="text-sm font-medium text-gray-700 leading-relaxed">{supplier.address}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Lĩnh vực cung ứng</p>
                    <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-[10px] font-bold uppercase tracking-wider">
                      {supplier.category}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <ShieldCheck size={14} className="text-emerald-600" />
                  Thống kê giao dịch
                </h4>
                <div className="bg-emerald-50/50 rounded-3xl p-6 border border-emerald-100">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <p className="text-[10px] font-bold text-emerald-700 uppercase">Tổng giá trị mua</p>
                      <p className="text-lg font-extrabold text-emerald-900">{supplier.totalPurchased}</p>
                    </div>
                    <div className="h-px bg-emerald-100 w-full" />
                    <div className="flex justify-between items-center">
                      <p className="text-[10px] font-bold text-emerald-700 uppercase">Đơn cuối cùng</p>
                      <p className="text-sm font-bold text-emerald-800">{supplier.lastOrder}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Purchase History */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <History size={14} className="text-emerald-600" />
                  Lịch sử mua hàng gần đây
                </h4>
                <button className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider hover:underline flex items-center gap-1">
                  Xem tất cả hóa đơn
                  <ExternalLink size={10} />
                </button>
              </div>
              
              <div className="bg-gray-50 rounded-[2rem] overflow-hidden border border-gray-100">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-100/50">
                      <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Mã Đơn</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Ngày đặt</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Sản phẩm</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Số lượng</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Thành tiền</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {mockHistory.map((order) => (
                      <tr key={order.id} className="hover:bg-white transition-colors">
                        <td className="px-6 py-4">
                          <span className="text-xs font-bold text-gray-900">{order.id}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Calendar size={12} className="text-emerald-600" />
                            {order.date}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-xs font-bold text-gray-700">{order.item}</p>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Package size={12} />
                            {order.quantity}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <p className="text-xs font-bold text-emerald-700">{order.total}</p>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-10 pt-6 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-4">
            <button 
              onClick={onClose}
              className="px-8 py-4 bg-white border border-gray-200 text-gray-700 rounded-2xl text-sm font-bold hover:bg-gray-50 transition-all shadow-sm"
            >
              Đóng cửa sổ
            </button>
            <button className="px-8 py-4 bg-[#006c49] text-white rounded-2xl text-sm font-bold hover:bg-emerald-800 transition-all shadow-lg shadow-emerald-900/20 flex items-center gap-2">
              <DollarSign size={18} />
              Tạo đơn hàng mới
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
