"use client";

import React from "react";
import { 
  X, 
  User, 
  Clock, 
  Calendar, 
  MapPin, 
  CheckCircle2, 
  AlertCircle,
  Fingerprint,
  LogOut,
  MessageSquare
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/shared/lib/utils";
import Image from "next/image";

interface AttendanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  attendance: any;
}

export default function AttendanceModal({ isOpen, onClose, attendance }: AttendanceModalProps) {
  if (!attendance) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="relative h-32 bg-gradient-to-r from-[#006c49] to-[#10b981] p-8">
              <button 
                onClick={onClose}
                className="absolute top-6 right-6 p-2 bg-white/20 hover:bg-white/30 rounded-full text-white transition-all"
              >
                <X size={20} />
              </button>
              <div className="flex items-center gap-4 mt-4">
                <div className="relative w-20 h-20 rounded-2xl border-4 border-white overflow-hidden shadow-lg bg-white">
                  <Image 
                    src={attendance.avatar} 
                    alt={attendance.name} 
                    fill 
                    className="object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="text-white">
                  <h2 className="text-2xl font-black font-headline">{attendance.name}</h2>
                  <p className="text-emerald-100 text-xs font-bold uppercase tracking-widest">{attendance.id} • {attendance.role}</p>
                </div>
              </div>
            </div>

            <div className="p-8 pt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Column: Details */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-[10px] uppercase tracking-widest text-slate-400 font-black mb-4">Thông tin ca làm</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                      <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-emerald-600 shadow-sm">
                        <Calendar size={18} />
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">Ngày</p>
                        <p className="text-sm font-bold text-slate-700">Chủ Nhật, 05/04/2026</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                      <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-emerald-600 shadow-sm">
                        <Clock size={18} />
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">Ca làm việc</p>
                        <p className="text-sm font-bold text-slate-700">{attendance.shift}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                      <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-emerald-600 shadow-sm">
                        <MapPin size={18} />
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">Khu vực</p>
                        <p className="text-sm font-bold text-slate-700">Khu A - Chuồng nái</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-[10px] uppercase tracking-widest text-slate-400 font-black mb-4">Ghi chú / Phản hồi</h3>
                  <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex gap-3">
                    <MessageSquare size={18} className="text-amber-600 shrink-0 mt-0.5" />
                    <p className="text-xs text-amber-800 font-medium leading-relaxed">
                      {attendance.status === "Đi trễ" 
                        ? "Nhân viên báo hỏng xe, đã liên hệ quản lý trực tiếp lúc 08:05." 
                        : "Chấm công đúng quy trình, không có ghi chú đặc biệt."}
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column: Time & Evidence */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-[10px] uppercase tracking-widest text-slate-400 font-black mb-4">Dữ liệu Chấm công</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 text-center">
                      <Fingerprint size={20} className="text-emerald-600 mx-auto mb-2" />
                      <p className="text-[10px] text-emerald-800/60 font-bold uppercase">Giờ vào</p>
                      <p className="text-xl font-black text-emerald-700">{attendance.clockIn}</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                      <LogOut size={20} className="text-slate-400 mx-auto mb-2" />
                      <p className="text-[10px] text-slate-400 font-bold uppercase">Giờ ra</p>
                      <p className="text-xl font-black text-slate-400">{attendance.clockOut}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <button className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold text-sm hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20">
                    Chỉnh sửa bản ghi
                  </button>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={cn(
                  "w-2 h-2 rounded-full",
                  attendance.status === "Đúng giờ" ? "bg-emerald-500" : 
                  attendance.status === "Đi trễ" ? "bg-amber-500" : "bg-red-500"
                )} />
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Trạng thái: {attendance.status}</span>
              </div>
              <p className="text-[10px] text-slate-400 font-bold uppercase">ID Giao dịch: ATT-20260405-{attendance.id}</p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
