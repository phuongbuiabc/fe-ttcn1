"use client";

import React from "react";
import { 
  X, User, Mail, Phone, MapPin, Briefcase, 
  Calendar, Key, ShieldCheck, UserCircle, 
  IdCard, Landmark, Receipt, Eye, EyeOff
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/shared/utils/utils";

interface StaffFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (e: React.FormEvent) => void;
  editingMember: any | null;
  formData: any;
  setFormData: (data: any) => void;
}

// Move InputGroup OUTSIDE to prevent re-mounting on every keystroke
const InputGroup = ({ label, icon: Icon, children, className = "" }: any) => (
  <div className={cn("space-y-1.5", className)}>
    <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest flex items-center gap-1.5">
      <Icon size={12} className="text-slate-300" />
      {label}
    </label>
    <div className="relative group">
      {children}
    </div>
  </div>
);

const inputClasses = "w-full px-5 py-4 bg-slate-50/50 border-2 border-transparent rounded-2xl text-sm font-bold text-slate-700 outline-none transition-all focus:border-emerald-500/20 focus:bg-white focus:ring-4 focus:ring-emerald-500/5 placeholder:text-slate-300";

export function StaffFormModal({ 
  isOpen, 
  onClose, 
  onSave, 
  editingMember, 
  formData, 
  setFormData 
}: StaffFormModalProps) {
  const [showPassword, setShowPassword] = React.useState(false);
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [passError, setPassError] = React.useState("");

  const handleSaveWrapper = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMember && formData.password !== confirmPassword) {
      setPassError("Mật khẩu nhập lại không khớp!");
      return;
    }
    setPassError("");
    onSave(e);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-hidden">
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }} 
          onClick={onClose} 
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" 
        />
        
        <motion.div 
          initial={{ y: 20, scale: 0.95, opacity: 0 }} 
          animate={{ y: 0, scale: 1, opacity: 1 }} 
          exit={{ y: 20, scale: 0.95, opacity: 0 }} 
          className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl flex flex-col max-h-[95vh] overflow-hidden"
        >
          {/* Header */}
          <div className="p-8 border-b border-slate-50 flex items-center justify-between shrink-0 bg-white/80 backdrop-blur-xl sticky top-0 z-10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 shadow-inner">
                <UserPlusIcon size={24} />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight leading-none">
                  {editingMember ? "Cập nhật nhân sự" : "Thêm nhân sự mới"}
                </h3>
                <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">Quản lý hồ sơ nhân viên trang trại</p>
              </div>
            </div>
            <button 
              type="button"
              onClick={onClose} 
              className="p-3 hover:bg-slate-50 text-slate-400 hover:text-slate-800 rounded-2xl transition-all active:scale-90"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSaveWrapper} className="flex flex-col flex-1 overflow-hidden">
            <div className="p-8 overflow-y-auto flex-1 space-y-8 scrollbar-thin scrollbar-thumb-slate-100 scrollbar-track-transparent">
              
              {/* Section 1: Account Setup (Only for new members) */}
              {!editingMember && (
                <div className="p-6 bg-slate-900 rounded-[2rem] text-white shadow-xl shadow-slate-900/10 space-y-5 relative overflow-hidden group">
                   <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                      <ShieldCheck size={120} />
                   </div>
                   
                   <div className="flex items-center gap-3 relative z-10">
                      <div className="w-8 h-8 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                        <Key size={16} className="text-white" />
                      </div>
                      <h4 className="text-xs font-black uppercase tracking-widest">Thiết lập Tài khoản mới</h4>
                   </div>

                  <div className="grid grid-cols-2 gap-4 relative z-10">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Mật khẩu đăng nhập</label>
                      <div className="relative group">
                        <input 
                          type={showPassword ? "text" : "password"} required 
                          value={formData.password || ""} 
                          onChange={e => setFormData({...formData, password: e.target.value})} 
                          className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-sm font-bold text-white outline-none focus:bg-white/10 focus:ring-4 focus:ring-emerald-500/10 placeholder:text-slate-600" 
                          placeholder="Mật khẩu"
                        />
                        <button 
                          type="button" 
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Nhập lại mật khẩu</label>
                      <input 
                        type={showPassword ? "text" : "password"} required 
                        value={confirmPassword} 
                        onChange={e => setConfirmPassword(e.target.value)} 
                        className={cn(
                          "w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-sm font-bold text-white outline-none focus:bg-white/10 focus:ring-4 focus:ring-emerald-500/10 placeholder:text-slate-600",
                          passError && "ring-2 ring-rose-500/50 bg-rose-500/5 border-rose-500/20"
                        )} 
                        placeholder="Xác nhận lại"
                      />
                    </div>

                    {passError && (
                      <motion.p 
                        initial={{ opacity: 0, y: -10 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        className="col-span-2 text-[10px] font-bold text-rose-400 uppercase tracking-wider ml-1"
                      >
                        {passError}
                      </motion.p>
                    )}
                  </div>
                </div>
              )}

              {/* Section 2: Personal Information */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 ml-1">
                  <div className="w-1.5 h-6 bg-emerald-500 rounded-full" />
                  <h4 className="text-[11px] font-black text-slate-800 uppercase tracking-[0.2em]">Thông tin cá nhân</h4>
                </div>
                
                <div className="grid grid-cols-2 gap-5">
                  <InputGroup label="Họ nhân viên" icon={User}>
                    <input type="text" required value={formData.lastName || ""} onChange={e => setFormData({...formData, lastName: e.target.value})} className={inputClasses} placeholder="Nguyễn" />
                  </InputGroup>
                  
                  <InputGroup label="Tên nhân viên" icon={User}>
                    <input type="text" required value={formData.firstName || ""} onChange={e => setFormData({...formData, firstName: e.target.value})} className={inputClasses} placeholder="Văn An" />
                  </InputGroup>

                  <InputGroup label="Giới tính" icon={UserCircle}>
                    <select value={formData.gender || "MALE"} onChange={e => setFormData({...formData, gender: e.target.value})} className={cn(inputClasses, "appearance-none cursor-pointer")}>
                      <option value="MALE">Nam giới</option>
                      <option value="FEMALE">Nữ giới</option>
                    </select>
                  </InputGroup>

                  <InputGroup label="Ngày sinh" icon={Calendar}>
                    <input type="date" required value={formData.dateOfBirth || ""} onChange={e => setFormData({...formData, dateOfBirth: e.target.value})} className={inputClasses} />
                  </InputGroup>

                  <InputGroup label="Số điện thoại" icon={Phone}>
                    <input type="text" required value={formData.phone || ""} onChange={e => setFormData({...formData, phone: e.target.value})} className={inputClasses} placeholder="09xx xxx xxx" />
                  </InputGroup>

                  <InputGroup label="Chức vụ" icon={Briefcase}>
                    <select value={formData.position || "Công nhân"} onChange={e => setFormData({...formData, position: e.target.value})} className={cn(inputClasses, "appearance-none cursor-pointer")}>
                      <option value="Quản trị viên">Quản trị viên</option>
                      <option value="Kỹ thuật viên">Kỹ thuật viên</option>
                      <option value="Công nhân">Công nhân</option>
                      <option value="Kế toán">Kế toán</option>
                    </select>
                  </InputGroup>

                  <InputGroup label="Email liên hệ" icon={Mail} className="col-span-2">
                    <input type="email" required value={formData.email || ""} onChange={e => setFormData({...formData, email: e.target.value})} className={inputClasses} placeholder="example@gmail.com" />
                  </InputGroup>

                  <InputGroup label="Địa chỉ hiện tại" icon={MapPin} className="col-span-2">
                    <input type="text" required value={formData.currentAddress || ""} onChange={e => setFormData({...formData, currentAddress: e.target.value})} className={inputClasses} placeholder="Số nhà, đường, phường/xã..." />
                  </InputGroup>
                </div>
              </div>
            </div>

            {/* Footer inside Form */}
            <div className="p-8 border-t border-slate-50 bg-slate-50/50 shrink-0">
              <button 
                type="submit" 
                className="w-full py-5 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white rounded-2xl text-[13px] font-black uppercase tracking-[0.2em] shadow-xl shadow-emerald-500/20 active:scale-[0.98] transition-all hover:shadow-emerald-500/30 hover:brightness-105"
              >
                {editingMember ? "Cập nhật hồ sơ" : "Lưu hồ sơ nhân viên"}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

function UserPlusIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <line x1="19" y1="8" x2="19" y2="14" />
      <line x1="16" y1="11" x2="22" y2="11" />
    </svg>
  );
}
