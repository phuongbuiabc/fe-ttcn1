"use client";

import React from "react";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Shield, 
  Award, 
  Clock, 
  Edit3, 
  Camera,
  Briefcase,
  Building2,
  CheckCircle2,
  Zap
} from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export default function ProfilePage() {
  const stats = [
    { label: "Ngày tham gia", value: "12/05/2023", icon: Calendar, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Vai trò", value: "Quản trị viên", icon: Shield, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Trạng thái", value: "Đang hoạt động", icon: CheckCircle2, color: "text-amber-600", bg: "bg-amber-50" },
  ];

  const activities = [
    { action: "Đã cập nhật trạng thái đàn P-102", time: "10 phút trước", icon: Clock, type: "update" },
    { action: "Đã phê duyệt đơn nhập cám #IM-992", time: "2 giờ trước", icon: CheckCircle2, type: "approval" },
    { action: "Đã thay đổi lịch tiêm phòng chuồng B", time: "Hôm qua", icon: Calendar, type: "schedule" },
  ];

  const skills = [
    "Quản lý trang trại", "Thú y cơ bản", "Phân tích dữ liệu", "Vận hành máy móc", "Quản lý nhân sự"
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      {/* Profile Header Card */}
      <div className="relative bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="h-48 bg-gradient-to-r from-emerald-700 via-emerald-600 to-teal-500 relative">
          <div className="absolute inset-0 opacity-30 pointer-events-none">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-from)_0%,_transparent_70%)]" />
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20" />
          </div>
        </div>
        
        <div className="px-10 pb-10">
          <div className="relative flex flex-col md:flex-row items-end gap-8 -mt-20 mb-8">
            <div className="relative group">
              <div className="w-40 h-40 rounded-[2.5rem] overflow-hidden border-8 border-white shadow-2xl relative bg-white transition-transform duration-500 group-hover:scale-[1.02]">
                <Image 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCU8H1s-kjjlI2NWZ__-jyblSSG7AHeOmfBWSF8MxnkOItZRulZPOyAz2qjUhh1OL64lfdFM3kKVyoIqsyWJn5zjUx7eLL_HW8pI7vf7kinoqASkg8UI3plURqUft8OU90He4GSu8H6s1eeSLihn2CxkXvzfLfGOt1_K0f_R5CcwU5SWhzTWWSwqDfcNCrJcqrvpPZbGJ421OUkC2tzipzeMZWNrpeeEb8uqSfmGHmEmiduDR15CCVyTYCHUQc6re0vxz3nNLuM4UFJ"
                  alt="Marcus Thorne"
                  fill
                  className="object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <button className="absolute bottom-2 right-2 p-3 bg-emerald-600 text-white rounded-2xl shadow-xl hover:bg-emerald-700 hover:scale-110 transition-all border-4 border-white">
                <Camera size={18} />
              </button>
            </div>
            
            <div className="flex-1 space-y-2 mb-4">
              <div className="flex items-center gap-4">
                <h1 className="text-4xl font-black text-slate-900 font-headline tracking-tight">Marcus Thorne</h1>
                <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest rounded-full border border-emerald-100">
                  <Shield size={10} /> Verified Expert
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-slate-500 font-bold">
                <p className="flex items-center gap-2 text-sm">
                  <Briefcase size={16} className="text-emerald-500" /> Quản lý Trang trại cấp cao
                </p>
                <p className="flex items-center gap-2 text-sm">
                  <Building2 size={16} className="text-emerald-500" /> AgriIntel Global HQ
                </p>
                <p className="flex items-center gap-2 text-sm">
                  <MapPin size={16} className="text-emerald-500" /> Hà Nội, Việt Nam
                </p>
              </div>
            </div>

            <div className="flex gap-3 mb-4">
              <button className="px-8 py-3 bg-emerald-600 text-white rounded-2xl text-sm font-bold shadow-xl shadow-emerald-900/20 hover:bg-emerald-700 hover:-translate-y-0.5 transition-all flex items-center gap-2 active:scale-95">
                <Edit3 size={18} /> Chỉnh sửa hồ sơ
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, idx) => (
              <div key={idx} className="flex items-center gap-4 p-5 bg-slate-50/50 rounded-[2rem] border border-slate-100/50 hover:bg-white hover:shadow-md transition-all group">
                <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110", stat.bg, stat.color)}>
                  <stat.icon size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">{stat.label}</p>
                  <p className="text-base font-black text-slate-800">{stat.value}</p>
                </div>
              </div>
            ))}
            <div className="flex items-center gap-4 p-5 bg-emerald-600 rounded-[2rem] text-white shadow-lg shadow-emerald-900/20">
              <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
                <Award size={24} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-emerald-200 mb-0.5">Điểm uy tín</p>
                <p className="text-base font-black">2,840 XP</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left Column: Info & Skills */}
        <div className="space-y-8">
          <section className="space-y-4">
            <h2 className="text-2xl font-black text-slate-900 font-headline flex items-center gap-3">
              <User size={24} className="text-emerald-600" /> Giới thiệu
            </h2>
            <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm">
              <p className="text-sm text-slate-500 leading-relaxed font-medium">
                Với hơn 10 năm kinh nghiệm trong lĩnh vực nông nghiệp công nghệ cao, tôi chuyên về tối ưu hóa quy trình chăn nuôi và quản lý đàn lợn quy mô lớn. Đam mê ứng dụng dữ liệu vào việc ra quyết định để nâng cao năng suất và phúc lợi động vật.
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-black text-slate-900 font-headline flex items-center gap-3">
              <Zap size={24} className="text-emerald-600" /> Kỹ năng chuyên môn
            </h2>
            <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm">
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span key={skill} className="px-4 py-2 bg-slate-50 text-slate-600 text-xs font-bold rounded-xl border border-slate-100 hover:border-emerald-200 hover:text-emerald-600 transition-all cursor-default">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-black text-slate-900 font-headline flex items-center gap-3">
              <Mail size={24} className="text-emerald-600" /> Liên hệ
            </h2>
            <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 space-y-6 shadow-sm">
              {[
                { label: "Email", value: "marcus@agriintel.vn", icon: Mail, color: "text-blue-500" },
                { label: "Số điện thoại", value: "+84 901 234 567", icon: Phone, color: "text-emerald-500" },
                { label: "Địa chỉ", value: "Thường Tín, Hà Nội", icon: MapPin, color: "text-rose-500" },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-5 group">
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center group-hover:bg-white group-hover:shadow-md transition-all">
                    <item.icon size={20} className={item.color} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">{item.label}</p>
                    <p className="text-sm font-black text-slate-700">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column: Activity & Performance */}
        <div className="lg:col-span-2 space-y-8">
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black text-slate-900 font-headline flex items-center gap-3">
                <Clock size={24} className="text-emerald-600" /> Hoạt động gần đây
              </h2>
              <button className="text-sm font-bold text-emerald-600 hover:underline">Xem tất cả</button>
            </div>
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
              <div className="divide-y divide-slate-50">
                {activities.map((activity, idx) => (
                  <div key={idx} className="p-8 flex items-start gap-6 hover:bg-slate-50/50 transition-colors group">
                    <div className={cn(
                      "w-14 h-14 rounded-[1.25rem] flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 shadow-sm",
                      activity.type === "update" ? "bg-blue-50 text-blue-600" : 
                      activity.type === "approval" ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                    )}>
                      <activity.icon size={24} />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <p className="text-base font-black text-slate-800">{activity.action}</p>
                        <span className="text-xs font-bold text-slate-400">{activity.time}</span>
                      </div>
                      <p className="text-sm text-slate-500 font-medium">Thực hiện bởi Marcus Thorne tại Phân khu A</p>
                      <div className="pt-3 flex gap-2">
                        <button className="px-4 py-1.5 bg-slate-100 hover:bg-emerald-100 hover:text-emerald-700 text-slate-600 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all">
                          Chi tiết
                        </button>
                        <button className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all">
                          Báo cáo
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-black text-slate-900 font-headline flex items-center gap-3">
              <Shield size={24} className="text-emerald-600" /> Bảo mật & Quyền hạn
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Shield size={28} />
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-slate-900 font-headline">Xác thực 2 lớp</h4>
                    <p className="text-xs text-slate-400 font-bold mt-1 leading-relaxed">Tài khoản của bạn đang được bảo vệ bởi 2FA qua Google Authenticator.</p>
                  </div>
                </div>
                <button className="mt-6 w-full py-3 bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-black uppercase tracking-widest rounded-xl border border-slate-100 transition-all">
                  Quản lý thiết bị
                </button>
              </div>
              
              <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-[2.5rem] p-8 text-white relative overflow-hidden flex flex-col justify-between">
                <div className="absolute top-0 right-0 p-6 opacity-10">
                  <Zap size={100} />
                </div>
                <div className="space-y-4 relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center">
                    <Award size={28} className="text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="text-lg font-black font-headline">Quyền hạn Admin</h4>
                    <p className="text-xs text-slate-400 font-bold mt-1 leading-relaxed">Bạn có toàn quyền truy cập vào tất cả các phân khu và báo cáo tài chính.</p>
                  </div>
                </div>
                <button className="mt-6 w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black uppercase tracking-widest rounded-xl shadow-lg shadow-emerald-900/40 transition-all relative z-10">
                  Xem nhật ký quyền
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
