"use client";

import React, { useState } from "react";
import { 
  User, 
  Bell, 
  Shield, 
  Database, 
  Globe, 
  CreditCard,
  ChevronRight,
  LogOut,
  Save,
  Home,
  Mail,
  Phone,
  MapPin,
  Camera,
  Check,
  Languages,
  DollarSign
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import Image from "next/image";

// --- Types ---
interface FarmSettings {
  farmName: string;
  ownerName: string;
  email: string;
  phone: string;
  address: string;
  language: string;
  currency: string;
  timezone: string;
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general");
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [settings, setSettings] = useState<FarmSettings>({
    farmName: "AgriIntel Farm - Chi nhánh Miền Bắc",
    ownerName: "Nguyễn Văn An",
    email: "an.nv@agriintel.com",
    phone: "0901 234 567",
    address: "Km 15, Quốc lộ 1A, Huyện Thường Tín, Hà Nội",
    language: "Tiếng Việt",
    currency: "VND",
    timezone: "GMT+7 (Hanoi)",
    notifications: {
      email: true,
      push: true,
      sms: false
    }
  });

  const handleSave = () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 1000);
  };

  const tabs = [
    { id: "general", label: "Cài đặt chung", icon: Home },
    { id: "account", label: "Tài khoản", icon: User },
    { id: "notifications", label: "Thông báo", icon: Bell },
    { id: "security", label: "Bảo mật", icon: Shield },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight font-headline">Cài đặt hệ thống</h1>
          <p className="text-slate-500 text-sm mt-1">Quản lý cấu hình trang trại, tài khoản và các tùy chọn hệ thống.</p>
        </div>
        <div className="flex items-center gap-3">
          <AnimatePresence>
            {showSuccess && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-4 py-2 rounded-full text-xs font-bold border border-emerald-100"
              >
                <Check size={14} /> Đã lưu thành công
              </motion.div>
            )}
          </AnimatePresence>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className={cn(
              "px-8 py-2.5 bg-gradient-to-br from-[#006c49] to-[#10b981] text-white rounded-full text-sm font-bold shadow-lg shadow-emerald-900/20 flex items-center gap-2 hover:brightness-110 active:scale-95 transition-all disabled:opacity-50",
              isSaving && "animate-pulse"
            )}
          >
            <Save size={18} />
            {isSaving ? "Đang lưu..." : "Lưu thay đổi"}
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Navigation Sidebar */}
        <aside className="lg:w-1/4 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "w-full flex items-center gap-3 px-6 py-4 rounded-2xl text-sm font-bold transition-all",
                activeTab === tab.id 
                  ? "bg-emerald-600 text-white shadow-lg shadow-emerald-900/20" 
                  : "bg-white text-slate-500 hover:bg-slate-50 border border-transparent hover:border-slate-100"
              )}
            >
              <tab.icon size={20} />
              {tab.label}
            </button>
          ))}
          <div className="pt-8">
            <button className="w-full flex items-center gap-3 px-6 py-4 rounded-2xl text-sm font-bold text-rose-600 hover:bg-rose-50 transition-all">
              <LogOut size={20} />
              Đăng xuất
            </button>
          </div>
        </aside>

        {/* Content Area */}
        <main className="lg:w-3/4">
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
            <AnimatePresence mode="wait">
              {activeTab === "general" && (
                <motion.div
                  key="general"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-8 space-y-8"
                >
                  <div>
                    <h3 className="text-xl font-black text-slate-900 font-headline mb-6">Thông tin Trang trại</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Tên trang trại</label>
                        <div className="relative">
                          <Home className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                          <input 
                            type="text" 
                            value={settings.farmName}
                            onChange={(e) => setSettings({...settings, farmName: e.target.value})}
                            className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-emerald-500/20 outline-none"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Chủ sở hữu</label>
                        <div className="relative">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                          <input 
                            type="text" 
                            value={settings.ownerName}
                            onChange={(e) => setSettings({...settings, ownerName: e.target.value})}
                            className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-emerald-500/20 outline-none"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Email liên hệ</label>
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                          <input 
                            type="email" 
                            value={settings.email}
                            onChange={(e) => setSettings({...settings, email: e.target.value})}
                            className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-emerald-500/20 outline-none"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Số điện thoại</label>
                        <div className="relative">
                          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                          <input 
                            type="text" 
                            value={settings.phone}
                            onChange={(e) => setSettings({...settings, phone: e.target.value})}
                            className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-emerald-500/20 outline-none"
                          />
                        </div>
                      </div>
                      <div className="md:col-span-2 space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Địa chỉ</label>
                        <div className="relative">
                          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                          <input 
                            type="text" 
                            value={settings.address}
                            onChange={(e) => setSettings({...settings, address: e.target.value})}
                            className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-emerald-500/20 outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-8 border-t border-slate-50">
                    <h3 className="text-xl font-black text-slate-900 font-headline mb-6">Tùy chọn Hệ thống</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Ngôn ngữ</label>
                        <div className="relative">
                          <Languages className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                          <select 
                            value={settings.language}
                            onChange={(e) => setSettings({...settings, language: e.target.value})}
                            className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-emerald-500/20 outline-none appearance-none"
                          >
                            <option>Tiếng Việt</option>
                            <option>English</option>
                          </select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Tiền tệ</label>
                        <div className="relative">
                          <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                          <select 
                            value={settings.currency}
                            onChange={(e) => setSettings({...settings, currency: e.target.value})}
                            className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-emerald-500/20 outline-none appearance-none"
                          >
                            <option>VND</option>
                            <option>USD</option>
                          </select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Múi giờ</label>
                        <div className="relative">
                          <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                          <select 
                            value={settings.timezone}
                            onChange={(e) => setSettings({...settings, timezone: e.target.value})}
                            className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-emerald-500/20 outline-none appearance-none"
                          >
                            <option>GMT+7 (Hanoi)</option>
                            <option>GMT+0 (UTC)</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "account" && (
                <motion.div
                  key="account"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-8 space-y-8"
                >
                  <h3 className="text-xl font-black text-slate-900 font-headline mb-6">Thông tin Tài khoản</h3>
                  <div className="flex items-center gap-8">
                    <div className="relative group">
                      <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-slate-100 shadow-sm relative">
                        <Image 
                          src="https://picsum.photos/seed/owner/200/200" 
                          alt="Owner" 
                          fill 
                          className="object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <button className="absolute bottom-0 right-0 p-2 bg-emerald-600 text-white rounded-full shadow-lg hover:scale-110 transition-all">
                        <Camera size={16} />
                      </button>
                    </div>
                    <div className="space-y-1">
                      <p className="text-2xl font-black text-slate-900">{settings.ownerName}</p>
                      <p className="text-sm font-bold text-slate-400">{settings.email}</p>
                      <div className="flex gap-2 mt-3">
                        <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-wider rounded-full">Chủ trang trại</span>
                        <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-wider rounded-full">Gói Pro</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "notifications" && (
                <motion.div
                  key="notifications"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-8 space-y-6"
                >
                  <h3 className="text-xl font-black text-slate-900 font-headline mb-6">Cài đặt Thông báo</h3>
                  <div className="space-y-4">
                    {[
                      { id: "email", label: "Thông báo qua Email", desc: "Nhận báo cáo ngày và cảnh báo quan trọng qua email." },
                      { id: "push", label: "Thông báo đẩy (Push)", desc: "Nhận thông báo trực tiếp trên trình duyệt hoặc điện thoại." },
                      { id: "sms", label: "Thông báo qua SMS", desc: "Nhận tin nhắn khẩn cấp khi có sự cố nghiêm trọng." },
                    ].map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl border border-slate-100">
                        <div>
                          <p className="text-sm font-bold text-slate-900">{item.label}</p>
                          <p className="text-xs font-medium text-slate-400 mt-1">{item.desc}</p>
                        </div>
                        <button 
                          onClick={() => setSettings({
                            ...settings, 
                            notifications: {
                              ...settings.notifications, 
                              [item.id as keyof typeof settings.notifications]: !settings.notifications[item.id as keyof typeof settings.notifications]
                            }
                          })}
                          className={cn(
                            "w-12 h-6 rounded-full transition-all relative",
                            settings.notifications[item.id as keyof typeof settings.notifications] ? "bg-emerald-600" : "bg-slate-300"
                          )}
                        >
                          <div className={cn(
                            "absolute top-1 w-4 h-4 bg-white rounded-full transition-all",
                            settings.notifications[item.id as keyof typeof settings.notifications] ? "left-7" : "left-1"
                          )} />
                        </button>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === "security" && (
                <motion.div
                  key="security"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-8 space-y-8"
                >
                  <h3 className="text-xl font-black text-slate-900 font-headline mb-6">Bảo mật & Quyền riêng tư</h3>
                  <div className="space-y-6">
                    <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                          <Shield size={24} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">Xác thực 2 yếu tố (2FA)</p>
                          <p className="text-xs font-medium text-slate-400 mt-1">Tăng cường bảo mật cho tài khoản của bạn.</p>
                        </div>
                      </div>
                      <button className="px-4 py-2 bg-white text-slate-600 text-xs font-bold rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors">
                        Thiết lập
                      </button>
                    </div>
                    <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
                          <Database size={24} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">Sao lưu dữ liệu</p>
                          <p className="text-xs font-medium text-slate-400 mt-1">Lần cuối: 2 giờ trước.</p>
                        </div>
                      </div>
                      <button className="px-4 py-2 bg-white text-slate-600 text-xs font-bold rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors">
                        Tải bản sao lưu
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
}
