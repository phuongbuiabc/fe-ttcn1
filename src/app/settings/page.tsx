"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
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
  X,
  Clock
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/shared/utils/utils";
import Image from "next/image";
import { useAuth } from "@/modules/auth/hooks/useAuth";
import { staffService } from "@/modules/staff/api/staff.service";
import { Employee } from "@/shared/types";

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

function SettingsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const tabParam = searchParams.get("tab");

  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [profile, setProfile] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);

  const [activityLogs, setActivityLogs] = useState<any[]>([]);
  const [systemNotifications, setSystemNotifications] = useState<any[]>([]);

  const addActivityLog = (action: string) => {
    const savedLogs = localStorage.getItem("mdfarm_activity_logs");
    let logs = [];
    if (savedLogs) {
      try {
        logs = JSON.parse(savedLogs);
      } catch (e) {
        console.error("Failed to parse activity logs", e);
      }
    }
    const newLog = {
      id: Math.random().toString(36).substring(2, 11),
      action,
      ip: "113.190.233.45",
      device: "Chrome / Windows 11",
      time: new Date().toLocaleDateString("vi-VN") + " " + new Date().toLocaleTimeString("vi-VN", { hour: '2-digit', minute: '2-digit' }),
      status: "Thành công"
    };
    const updatedLogs = [newLog, ...logs];
    localStorage.setItem("mdfarm_activity_logs", JSON.stringify(updatedLogs));
    setActivityLogs(updatedLogs);
  };

  const handleClearNotification = (id: string) => {
    const updated = systemNotifications.filter(n => n.id !== id);
    setSystemNotifications(updated);
    localStorage.setItem("mdfarm_system_notifications", JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent("mdfarm-notifications-updated"));
  };

  const handleToggleReadStatus = (id: string) => {
    const updated = systemNotifications.map(n => n.id === id ? { ...n, read: !n.read } : n);
    setSystemNotifications(updated);
    localStorage.setItem("mdfarm_system_notifications", JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent("mdfarm-notifications-updated"));
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await staffService.getMe();
        if (res.success && res.data) {
          setProfile(res.data);
        } else if (user) {
          // Fallback if no employee record
          setProfile({
            id: user.id,
            firstName: user.givenName || "",
            lastName: user.familyName || "",
            email: user.email,
            phone: "",
            dateOfBirth: "",
            gender: "N/A",
            currentAddress: "",
            position: user.role === 'ADMIN' ? "Quản trị viên" : "Nhân viên",
          });
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();

    // Load activity logs
    const savedLogs = localStorage.getItem("mdfarm_activity_logs");
    if (savedLogs) {
      try {
        setActivityLogs(JSON.parse(savedLogs));
      } catch (e) {
        console.error(e);
      }
    } else {
      const defaultLogs = [
        { id: "log-1", action: "Đăng nhập hệ thống", ip: "113.190.233.45", device: "Chrome / Windows 11", time: new Date().toLocaleDateString("vi-VN") + " 10:20", status: "Thành công" },
        { id: "log-2", action: "Đổi mật khẩu tài khoản", ip: "113.190.233.45", device: "Chrome / Windows 11", time: new Date().toLocaleDateString("vi-VN") + " 09:15", status: "Thành công" },
        { id: "log-3", action: "Cập nhật cấu hình bảo mật", ip: "113.190.233.45", device: "Chrome / Windows 11", time: new Date().toLocaleDateString("vi-VN") + " 08:30", status: "Thành công" },
      ];
      localStorage.setItem("mdfarm_activity_logs", JSON.stringify(defaultLogs));
      setActivityLogs(defaultLogs);
    }

    // Load system notifications
    const loadNotifs = () => {
      const saved = localStorage.getItem("mdfarm_system_notifications");
      if (saved) {
        try {
          setSystemNotifications(JSON.parse(saved));
        } catch (e) {
          console.error(e);
        }
      }
    };
    loadNotifs();

    const handleUpdate = () => {
      loadNotifs();
    };
    window.addEventListener("mdfarm-notifications-updated", handleUpdate);

    // Load farm settings from localStorage
    const savedSettings = localStorage.getItem("farm_settings");
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (e) {
        console.error("Failed to parse saved settings", e);
      }
    }

    return () => {
      window.removeEventListener("mdfarm-notifications-updated", handleUpdate);
    };
  }, [user]);

  const isFarmManager = user?.role === 'ADMIN' || user?.role === 'OWNER' || profile?.position === "Quản lý trang trại" || profile?.position === "Quản trị viên" || profile?.position?.toLowerCase().includes("admin");
  const activeTab = tabParam || (loading ? "account" : (isFarmManager ? "general" : "account"));

  useEffect(() => {
    if (!loading && !isFarmManager && activeTab === "general") {
      router.push(`${pathname}?tab=account`);
    }
  }, [isFarmManager, activeTab, loading, router, pathname]);

  const handleTabChange = (tabId: string) => {
    router.push(`${pathname}?tab=${tabId}`);
  };

  const [settings, setSettings] = useState<FarmSettings>({
    farmName: "MDFARM - Chăn nuôi lợn giống",
    ownerName: "Nguyễn Viết Trọng ",
    email: "contact@mdfarm.vn",
    phone: "19001234",
    address: "Mão Điền, Bắc Ninh",
    language: "Tiếng Việt",
    currency: "VND",
    timezone: "GMT+7 (Hanoi)",
    notifications: {
      email: true,
      push: true,
      sms: false
    }
  });

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (activeTab === "account" && profile) {
        const res = await staffService.updateEmployee(profile.id, {
          firstName: profile.firstName,
          lastName: profile.lastName,
          phone: profile.phone,
          currentAddress: profile.currentAddress,
        });

        if (res.success) {
          setShowSuccess(true);
          addActivityLog("Cập nhật hồ sơ cá nhân");
          setTimeout(() => setShowSuccess(false), 3000);
        } else {
          alert(res.message || "Không thể cập nhật hồ sơ");
        }
      } else if (activeTab === "general" || activeTab === "notifications") {
        // Lưu vào localStorage cho General và Notifications
        localStorage.setItem("farm_settings", JSON.stringify(settings));
        await new Promise(resolve => setTimeout(resolve, 800));
        setShowSuccess(true);
        addActivityLog(activeTab === "general" ? "Cập nhật cấu hình trang trại" : "Cập nhật cài đặt nhận thông báo");
        setTimeout(() => setShowSuccess(false), 3000);
      } else {
        // Mock save cho Security
        await new Promise(resolve => setTimeout(resolve, 1000));
        setShowSuccess(true);
        addActivityLog("Cập nhật thông tin bảo mật");
        setTimeout(() => setShowSuccess(false), 3000);
      }
    } catch (error) {
      console.error("Save error:", error);
      alert("Đã xảy ra lỗi khi lưu thông tin");
    } finally {
      setIsSaving(false);
    }
  };

  const tabs = [
    ...(isFarmManager ? [{ id: "general", label: "Cài đặt chung", icon: Home }] : []),
    { id: "account", label: "Tài khoản", icon: User },
    { id: "notifications", label: "Thông báo", icon: Bell },
    { id: "security", label: "Bảo mật", icon: Shield },
    { id: "activity", label: "Lịch sử hoạt động", icon: Database },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

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
              onClick={() => handleTabChange(tab.id)}
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
            <button
              onClick={logout}
              className="w-full flex items-center gap-3 px-6 py-4 rounded-2xl text-sm font-bold text-rose-600 hover:bg-rose-50 transition-all"
            >
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
                            onChange={(e) => setSettings({ ...settings, farmName: e.target.value })}
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
                            onChange={(e) => setSettings({ ...settings, ownerName: e.target.value })}
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
                            onChange={(e) => setSettings({ ...settings, email: e.target.value })}
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
                            onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
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
                            onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                            className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-emerald-500/20 outline-none"
                          />
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
                  className="p-8 space-y-6"
                >
                  <div>
                    <h3 className="text-xl font-black text-slate-900 font-headline mb-6">Thông tin Cá nhân</h3>
                    <div className="flex flex-col md:flex-row items-center gap-10 mb-10">
                      <div className="relative group">
                        <div className="w-40 h-40 rounded-[2.5rem] overflow-hidden border-4 border-slate-100 shadow-xl relative bg-white flex items-center justify-center">
                          {user?.avatarUrl ? (
                            <Image
                              src={user.avatarUrl}
                              alt="Avatar"
                              fill
                              className="object-cover"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <div className="w-full h-full bg-emerald-500 flex items-center justify-center text-4xl font-black text-white">
                              {profile?.firstName?.charAt(0) || user?.givenName?.charAt(0) || "U"}
                            </div>
                          )}
                        </div>
                        <button className="absolute -bottom-2 -right-2 p-3 bg-emerald-600 text-white rounded-2xl shadow-xl hover:scale-110 transition-all border-4 border-white">
                          <Camera size={20} />
                        </button>
                      </div>
                      <div className="flex-1 space-y-4 w-full">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Họ</label>
                            <input
                              type="text"
                              value={profile?.lastName || ""}
                              onChange={(e) => setProfile(prev => prev ? { ...prev, lastName: e.target.value } : null)}
                              className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-emerald-500/20 outline-none"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Tên</label>
                            <input
                              type="text"
                              value={profile?.firstName || ""}
                              onChange={(e) => setProfile(prev => prev ? { ...prev, firstName: e.target.value } : null)}
                              className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-emerald-500/20 outline-none"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Số điện thoại</label>
                            <input
                              type="text"
                              value={profile?.phone || ""}
                              onChange={(e) => setProfile(prev => prev ? { ...prev, phone: e.target.value } : null)}
                              className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-emerald-500/20 outline-none"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Chức vụ</label>
                            <input
                              type="text"
                              value={profile?.position || ""}
                              readOnly
                              className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-emerald-500/20 outline-none opacity-70 cursor-not-allowed"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Địa chỉ hiện tại</label>
                          <input
                            type="text"
                            value={profile?.currentAddress || ""}
                            onChange={(e) => setProfile(prev => prev ? { ...prev, currentAddress: e.target.value } : null)}
                            className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-emerald-500/20 outline-none"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Email quản trị</label>
                          <input
                            type="email"
                            value={profile?.email || ""}
                            readOnly
                            className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-emerald-500/20 outline-none opacity-70 cursor-not-allowed"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-10 border-t border-slate-50">
                    <h3 className="text-xl font-black text-slate-900 font-headline mb-6">Liên kết Tài khoản</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl border border-slate-100">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-sm">
                            <Globe size={24} className="text-blue-600" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-900">Google Account</p>
                            <p className="text-xs text-slate-400 font-medium">marcus.thorne@gmail.com</p>
                          </div>
                        </div>
                        <span className="px-4 py-1.5 bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-widest rounded-full">Đã kết nối</span>
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
                      <div key={item.id} className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl border border-slate-100 group hover:border-emerald-200 transition-all">
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
                            "absolute top-1 w-4 h-4 bg-white rounded-full transition-all shadow-sm",
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
                  className="p-8 space-y-6"
                >
                  <div>
                    <h3 className="text-xl font-black text-slate-900 font-headline mb-6">Mật khẩu & Truy cập</h3>
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Mật khẩu hiện tại</label>
                          <input type="password" placeholder="••••••••" className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-emerald-500/20 outline-none" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Mật khẩu mới</label>
                          <input type="password" placeholder="••••••••" className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-emerald-500/20 outline-none" />
                        </div>
                      </div>
                      <button className="px-6 py-2.5 bg-slate-900 text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-slate-800 transition-all">
                        Cập nhật mật khẩu
                      </button>
                    </div>
                  </div>

                  <div className="pt-10 border-t border-slate-50">
                    <h3 className="text-xl font-black text-slate-900 font-headline mb-6">Bảo mật nâng cao</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 flex flex-col justify-between">
                        <div className="space-y-4">
                          <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center shadow-sm">
                            <Shield size={28} />
                          </div>
                          <div>
                            <p className="text-base font-black text-slate-900">Xác thực 2 yếu tố (2FA)</p>
                            <p className="text-xs text-slate-400 font-bold mt-1 leading-relaxed">Tăng cường bảo mật bằng cách yêu cầu mã xác thực từ điện thoại.</p>
                          </div>
                        </div>
                        <div className="mt-8 flex items-center justify-between">
                          <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Đang bật</span>
                          <button className="px-4 py-2 bg-white text-slate-600 text-[10px] font-black uppercase tracking-widest rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors">
                            Cấu hình
                          </button>
                        </div>
                      </div>
                      <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 flex flex-col justify-between">
                        <div className="space-y-4">
                          <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center shadow-sm">
                            <Database size={28} />
                          </div>
                          <div>
                            <p className="text-base font-black text-slate-900">Sao lưu dữ liệu</p>
                            <p className="text-xs text-slate-400 font-bold mt-1 leading-relaxed">Tự động sao lưu dữ liệu trang trại hàng ngày vào đám mây.</p>
                          </div>
                        </div>
                        <div className="mt-8 flex items-center justify-between">
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Lần cuối: 2h trước</span>
                          <button className="px-4 py-2 bg-white text-slate-600 text-[10px] font-black uppercase tracking-widest rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors">
                            Tải về
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "activity" && (
                <motion.div
                  key="activity"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-8 space-y-8"
                >
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                    {/* Left side: Account Activity Logs */}
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-xl font-black text-slate-900 font-headline">Nhật ký hoạt động tài khoản</h3>
                        <p className="text-xs text-slate-400 font-medium mt-1">Lịch sử đăng nhập và các hành động quan trọng thực hiện bởi tài khoản này.</p>
                      </div>

                      <div className="space-y-4 max-h-[480px] overflow-y-auto pr-1 scrollbar-thin">
                        {activityLogs.map((log) => (
                          <div key={log.id} className="p-5 bg-slate-50 border border-slate-100 rounded-3xl flex items-start justify-between gap-4 text-left">
                            <div className="space-y-1">
                              <p className="text-sm font-bold text-slate-900">{log.action}</p>
                              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] font-bold text-slate-400">
                                <span>IP: {log.ip}</span>
                                <span>•</span>
                                <span>Thiết bị: {log.device}</span>
                                <span>•</span>
                                <span className="text-slate-500">{log.time}</span>
                              </div>
                            </div>
                            <span className="shrink-0 px-2.5 py-0.5 rounded text-[8px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-600 border border-emerald-100/50">
                              {log.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Right side: System Notifications & Alerts */}
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-xl font-black text-slate-900 font-headline">Thông báo & Cảnh báo hoạt động</h3>
                        <p className="text-xs text-slate-400 font-medium mt-1">Danh sách cảnh báo kỹ thuật và thông báo vận hành hệ thống.</p>
                      </div>

                      <div className="space-y-4 max-h-[480px] overflow-y-auto pr-1 scrollbar-thin">
                        {systemNotifications.length === 0 ? (
                          <div className="p-12 text-center text-slate-400 font-bold bg-slate-50 rounded-[2rem] border border-slate-100/50">
                            Không có thông báo hoặc cảnh báo nào.
                          </div>
                        ) : (
                          systemNotifications.map((n) => (
                            <div key={n.id} className={cn(
                              "p-5 border rounded-3xl flex items-start justify-between gap-4 text-left transition-all",
                              n.read ? "bg-slate-50 border-slate-100" : "bg-emerald-50/10 border-emerald-100/60 shadow-sm"
                            )}>
                              <div className="flex gap-4">
                                <div className={cn(
                                  "w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-sm",
                                  n.type === "alert" ? "bg-rose-50 text-rose-500" :
                                    n.type === "warning" ? "bg-amber-50 text-amber-500" :
                                      n.type === "success" ? "bg-emerald-50 text-emerald-500" : "bg-blue-50 text-blue-500"
                                )}>
                                  {n.type === "alert" ? <Clock size={16} /> : n.type === "success" ? <Check size={16} /> : <Bell size={16} />}
                                </div>
                                <div className="space-y-1">
                                  <p className="text-sm font-bold text-slate-900 leading-snug">{n.title}</p>
                                  <p className="text-xs text-slate-500 leading-normal font-medium">{n.description}</p>
                                  <div className="flex items-center gap-2 pt-1">
                                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">{n.time}</span>
                                    <span className="text-slate-300">•</span>
                                    <button
                                      onClick={() => handleToggleReadStatus(n.id)}
                                      className="text-[9px] font-bold text-emerald-600 hover:text-emerald-700 underline"
                                    >
                                      {n.read ? "Đánh dấu chưa đọc" : "Đánh dấu đã đọc"}
                                    </button>
                                  </div>
                                </div>
                              </div>
                              <button
                                onClick={() => handleClearNotification(n.id)}
                                className="text-slate-300 hover:text-rose-500 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                                title="Xóa thông báo"
                              >
                                <X size={14} />
                              </button>
                            </div>
                          ))
                        )}
                      </div>
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

export default function SettingsPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading settings...</div>}>
      <SettingsContent />
    </Suspense>
  );
}

