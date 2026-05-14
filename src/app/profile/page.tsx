"use client";

import React from "react";
import { 
  User, Mail, Phone, MapPin, Calendar, 
  Shield, Briefcase, Camera, LogOut, CheckCircle,
  ShieldCheck, UserCircle
} from "lucide-react";
import { cn } from "@/shared/utils/utils";
import { staffService } from "@/modules/staff/api/staff.service";
import { Employee } from "@/shared/types";
import { motion } from "motion/react";
import { useAuth } from "@/modules/auth/hooks/useAuth";

export default function ProfilePage() {
  const { user, logout } = useAuth();

  const [profile, setProfile] = React.useState<Employee | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await staffService.getMe();
        if (res.success && res.data) {
          setProfile(res.data);
        } else if (user && (user.role === 'ADMIN' || user.role === 'OWNER')) {
          // Fallback cho Admin/Owner nếu chưa liên kết với Employee record
          setProfile({
            id: user.id,
            firstName: user.givenName || "",
            lastName: user.familyName || "Admin",
            email: user.email,
            phone: "Chưa cập nhật",
            dateOfBirth: "Chưa cập nhật",
            gender: "N/A",
            currentAddress: "Hệ thống Quản trị",
            position: user.role === 'ADMIN' ? "Quản trị viên" : "Chủ trang trại",
          });
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-2xl mx-auto mt-20 text-center p-12 bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50">
        <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <Shield size={40} />
        </div>
        <h2 className="text-2xl font-black text-slate-800 uppercase mb-4">Hồ sơ chưa sẵn sàng</h2>
        <p className="text-slate-500 font-medium">Tài khoản này chưa được liên kết với dữ liệu nhân sự của trang trại.</p>
      </div>
    );
  }

  const isAdmin = profile.position?.toLowerCase().includes("quản trị") || profile.position?.toLowerCase().includes("admin");

  const InfoItem = ({ label, value, icon: Icon }: any) => (
    <div className={cn(
      "flex items-center gap-4 p-4 bg-white rounded-2xl border-2 transition-all group",
      isAdmin ? "border-indigo-50 hover:border-amber-400/50" : "border-slate-100 hover:border-emerald-500"
    )}>
      <div className={cn(
        "w-10 h-10 rounded-xl flex items-center justify-center transition-all shrink-0 shadow-inner",
        isAdmin ? "bg-indigo-50 text-indigo-500 group-hover:bg-amber-500 group-hover:text-white" : "bg-slate-50 text-slate-500 group-hover:bg-emerald-500 group-hover:text-white"
      )}>
        <Icon size={18} />
      </div>
      <div className="flex-1">
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5 leading-relaxed">{label}</p>
        <p className="text-sm font-black text-slate-800 leading-tight">{value || "Chưa cập nhật"}</p>
      </div>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12 px-4">
      {/* Dynamic Header based on Role */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          "relative rounded-[2rem] p-8 shadow-2xl overflow-hidden",
          isAdmin ? "bg-slate-950 shadow-indigo-900/20" : "bg-slate-900 shadow-slate-900/10"
        )}
      >
        {/* Background Accents */}
        <div className={cn(
          "absolute top-0 right-0 w-[400px] h-[400px] rounded-full blur-[80px] -mr-48 -mt-48 opacity-20",
          isAdmin ? "bg-amber-500" : "bg-emerald-500"
        )} />
        
        <div className="relative flex flex-col md:flex-row items-center gap-8">
          <div className="relative">
            <div className={cn(
              "w-32 h-32 rounded-[1.5rem] overflow-hidden p-1 border shadow-xl transition-all",
              isAdmin ? "bg-amber-500/10 border-amber-500/30 rotate-1" : "bg-white/10 border-white/20"
            )}>
              <div className={cn(
                "w-full h-full rounded-[1.25rem] flex items-center justify-center text-5xl font-black text-white shadow-inner",
                isAdmin ? "bg-gradient-to-br from-amber-500 to-orange-600" : "bg-emerald-500"
              )}>
                {profile.firstName.charAt(0)}
              </div>
            </div>
            <button className={cn(
              "absolute -bottom-1 -right-1 w-10 h-10 rounded-xl flex items-center justify-center shadow-xl transition-all border-[3px]",
              isAdmin ? "bg-white text-indigo-900 border-slate-950" : "bg-white text-slate-900 border-slate-900"
            )}>
              <Camera size={16} />
            </button>
          </div>

          <div className="flex-1 text-center md:text-left space-y-2">
            <div className={cn(
              "inline-flex items-center gap-2 px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded-lg shadow-lg",
              isAdmin ? "bg-amber-500 text-slate-950 shadow-amber-500/20" : "bg-emerald-500 text-white shadow-emerald-500/20"
            )}>
              {isAdmin ? <ShieldCheck size={10} /> : <CheckCircle size={10} />}
              {isAdmin ? "Hệ thống Quản trị viên" : "Nhân viên chính thức"}
            </div>
            
            <h1 className="text-3xl font-black text-white tracking-tight leading-none flex items-center justify-center md:justify-start gap-3">
              {profile.firstName} <span className={isAdmin ? "text-amber-400" : "text-emerald-400"}>{profile.lastName}</span>
              {isAdmin && <span className="p-1.5 bg-white/5 rounded-lg border border-white/10 text-amber-500"><Shield size={16} /></span>}
            </h1>
            
            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">
              {isAdmin ? "Toàn quyền quản lý hệ thống MDFarm Digital" : "Thành viên thuộc hệ thống MDFarm Digital"}
            </p>
          </div>

          <div className="shrink-0 flex gap-3">
             <button 
               onClick={logout}
               className="px-8 py-4 bg-white text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg hover:scale-105 transition-all active:scale-95"
             >
                <LogOut size={14} className="inline mr-2" /> Đăng xuất
             </button>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center gap-3 ml-2">
            <div className={cn("w-1.5 h-6 rounded-full", isAdmin ? "bg-indigo-500" : "bg-emerald-500")} />
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Hồ sơ cá nhân</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <InfoItem label="Họ và tên đầy đủ" value={`${profile.lastName} ${profile.firstName}`} icon={User} />
            </div>
            <InfoItem label="Giới tính" value={profile.gender === "MALE" ? "Nam giới" : "Nữ giới"} icon={UserCircle} />
            <InfoItem label="Ngày sinh" value={profile.dateOfBirth} icon={Calendar} />
            <InfoItem label="Email quản trị" value={profile.email} icon={Mail} />
            <InfoItem label="Số điện thoại" value={profile.phone} icon={Phone} />
            <div className="md:col-span-2">
              <InfoItem label="Địa chỉ liên hệ" value={profile.currentAddress} icon={MapPin} />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-3 ml-2">
            <div className={cn("w-1.5 h-6 rounded-full", isAdmin ? "bg-amber-500" : "bg-slate-900")} />
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">
              {isAdmin ? "Bảng điều khiển" : "Hệ thống"}
            </h2>
          </div>

          <div className={cn(
            "border-2 rounded-[2rem] p-6 space-y-5",
            isAdmin ? "bg-indigo-50/30 border-indigo-100" : "bg-slate-50 border-slate-100"
          )}>
            <div className="space-y-1.5">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-relaxed">Quyền hạn</p>
              <div className="flex items-center gap-2.5">
                <div className={cn("w-3 h-3 rounded-full animate-pulse shadow-lg", isAdmin ? "bg-indigo-500 shadow-indigo-500/50" : "bg-emerald-500")} />
                <p className="text-base font-black text-slate-800">{isAdmin ? "Full Access Admin" : "Standard Employee"}</p>
              </div>
            </div>

            <div className="pt-2 space-y-2">
              <button className={cn(
                "w-full py-3.5 border-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                isAdmin ? "bg-white border-indigo-100 text-indigo-600 hover:bg-indigo-600 hover:text-white" : "bg-white border-slate-200 text-slate-700 hover:border-emerald-500"
              )}>
                {isAdmin ? "Cài đặt hệ thống" : "Đổi mật khẩu"}
              </button>
              <button className={cn(
                "w-full py-3.5 border-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                isAdmin ? "bg-white border-indigo-100 text-indigo-600 hover:bg-slate-900 hover:text-white" : "bg-white border-slate-200 text-slate-700 hover:border-slate-900"
              )}>
                {isAdmin ? "Nhật ký truy cập" : "Lịch sử hoạt động"}
              </button>
            </div>
          </div>

          {isAdmin ? (
            <div className="bg-slate-900 rounded-[2rem] p-6 text-white shadow-2xl shadow-indigo-900/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-20 text-amber-500">
                 <ShieldCheck size={80} />
              </div>
              <h3 className="text-lg font-black uppercase mb-2 relative z-10 text-amber-500">Security Mode</h3>
              <p className="text-slate-400 text-xs font-bold leading-relaxed mb-4 relative z-10">
                Tài khoản của bạn được bảo mật lớp 2 (2FA) và có quyền thay đổi cấu hình lõi của hệ thống.
              </p>
              <div className="px-3 py-1.5 bg-amber-500 text-slate-950 rounded-lg inline-block text-[9px] font-black uppercase tracking-widest relative z-10">
                Super User Verified
              </div>
            </div>
          ) : (
            <div className="bg-emerald-600 rounded-[2rem] p-6 text-white shadow-xl shadow-emerald-600/10 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                 <Shield size={80} />
              </div>
              <h3 className="text-lg font-black uppercase mb-2 relative z-10">Độ tin cậy</h3>
              <p className="text-emerald-100 text-xs font-bold leading-relaxed mb-4 relative z-10">
                Hồ sơ đã được Admin xác thực bảo mật 100%.
              </p>
              <div className="px-3 py-1.5 bg-white/20 backdrop-blur-md rounded-lg inline-block text-[9px] font-black uppercase tracking-widest relative z-10 border border-white/10">
                Verified Profile
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
