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
  Clock,
  Upload
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/shared/utils/utils";
import Image from "next/image";
import { useAuth } from "@/shared/components/AuthProvider";
import { staffService } from "@/modules/staff/api/staff.service";
import { Employee } from "@/shared/types";
import { BaseModal } from "@/shared/components/ui/BaseModal";

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

const PRESET_AVATARS = [
  // Cute Piggy
  `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100%" height="100%" rx="30" fill="%23FFE4E6"/><circle cx="50" cy="50" r="30" fill="%23FDA4AF"/><circle cx="40" cy="45" r="4" fill="%23475569"/><circle cx="60" cy="45" r="4" fill="%23475569"/><ellipse cx="50" cy="56" rx="12" ry="8" fill="%23F43F5E"/><circle cx="46" cy="56" r="2.5" fill="%23BE123C"/><circle cx="54" cy="56" r="2.5" fill="%23BE123C"/><path d="M26 34 C 22 20 34 22 36 28" stroke="%23FDA4AF" stroke-width="5" stroke-linecap="round" fill="none"/><path d="M74 34 C 78 20 66 22 64 28" stroke="%23FDA4AF" stroke-width="5" stroke-linecap="round" fill="none"/></svg>`,
  // Farmer Man
  `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100%" height="100%" rx="30" fill="%23ECFDF5"/><circle cx="50" cy="48" r="20" fill="%23FDBA74"/><path d="M30 68 C 30 55 40 55 50 55 C 60 55 70 55 70 68 Z" fill="%23059669"/><ellipse cx="50" cy="38" rx="24" ry="6" fill="%23EAB308"/><path d="M35 38 C 35 24 65 24 65 38" fill="%23CA8A04"/><circle cx="44" cy="48" r="2.5" fill="%231E293B"/><circle cx="56" cy="48" r="2.5" fill="%231E293B"/><path d="M46 56 Q 50 59 54 56" stroke="%231E293B" stroke-width="2" stroke-linecap="round" fill="none"/></svg>`,
  // Vet Woman
  `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100%" height="100%" rx="30" fill="%23F0FDF4"/><circle cx="50" cy="46" r="20" fill="%23FFD8A8"/><path d="M30 72 C 30 58 40 58 50 58 C 60 58 70 72 70 72 Z" fill="%230D9488"/><path d="M34 32 C 34 22 66 22 66 32 C 66 38 34 38 34 32 Z" fill="%23115E59"/><circle cx="43" cy="46" r="2" fill="%231E293B"/><circle cx="57" cy="46" r="2" fill="%231E293B"/><path d="M46 54 Q 50 57 54 54" stroke="%231E293B" stroke-width="1.5" stroke-linecap="round" fill="none"/><path d="M38 58 C 38 68 62 68 62 58" stroke="%23E2E8F0" stroke-width="3.5" fill="none"/></svg>`,
  // Vet Man
  `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100%" height="100%" rx="30" fill="%23EEF2F6"/><circle cx="50" cy="46" r="20" fill="%23FED7AA"/><path d="M30 72 C 30 60 40 60 50 60 C 60 60 70 72 70 72 Z" fill="%234F46E5"/><path d="M35 35 C 35 24 65 24 65 35 Z" fill="%23312E81"/><circle cx="44" cy="46" r="2" fill="%231E293B"/><circle cx="56" cy="46" r="2" fill="%231E293B"/><path d="M46 54 Q 50 57 54 54" stroke="%231E293B" stroke-width="1.5" stroke-linecap="round" fill="none"/></svg>`,
  // Manager Woman
  `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100%" height="100%" rx="30" fill="%23FDF4FF"/><circle cx="50" cy="48" r="20" fill="%23FDBA74"/><path d="M30 72 C 30 60 40 60 50 60 C 60 60 70 72 70 72 Z" fill="%237C3AED"/><path d="M32 32 C 32 18 68 18 68 32 Z" fill="%234C1D95"/><circle cx="44" cy="48" r="2" fill="%231E293B"/><circle cx="56" cy="48" r="2" fill="%231E293B"/><path d="M46 56 Q 50 59 54 56" stroke="%231E293B" stroke-width="1.5" stroke-linecap="round" fill="none"/></svg>`,
  // Tech Farmer
  `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100%" height="100%" rx="30" fill="%23F0F9FF"/><circle cx="50" cy="46" r="20" fill="%23FDBA74"/><path d="M30 70 C 30 58 40 58 50 58 C 60 58 70 70 70 70 Z" fill="%230284C7"/><path d="M26 40 C 26 26 74 26 74 40" stroke="%230F172A" stroke-width="4" fill="none" stroke-linecap="round"/><rect x="23" y="38" width="6" height="12" rx="2" fill="%230F172A"/><rect x="71" y="38" width="6" height="12" rx="2" fill="%230F172A"/><circle cx="44" cy="46" r="2" fill="%231E293B"/><circle cx="56" cy="46" r="2" fill="%231E293B"/><path d="M47 54 Q 50 57 53 54" stroke="%231E293B" stroke-width="1.5" stroke-linecap="round" fill="none"/></svg>`,
  // Cute Cow
  `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100%" height="100%" rx="30" fill="%23FEF3C7"/><ellipse cx="50" cy="52" rx="25" ry="22" fill="%23FFFFFF"/><ellipse cx="50" cy="62" rx="16" ry="10" fill="%23F3F4F6"/><circle cx="40" cy="48" r="3" fill="%231E293B"/><circle cx="60" cy="48" r="3" fill="%231E293B"/><circle cx="44" cy="62" r="2" fill="%239CA3AF"/><circle cx="56" cy="62" r="2" fill="%239CA3AF"/><ellipse cx="25" cy="38" rx="8" ry="12" fill="%23F3F4F6" transform="rotate(-30, 25, 38)"/><ellipse cx="75" cy="38" rx="8" ry="12" fill="%23F3F4F6" transform="rotate(30, 75, 38)"/></svg>`,
  // Cute Rooster
  `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100%" height="100%" rx="30" fill="%23FFF7ED"/><circle cx="50" cy="54" r="26" fill="%23FDBA74"/><path d="M50 20 Q 50 32 40 32 Q 50 32 60 32 Z" fill="%23EF4444"/><polygon points="44,56 56,56 50,68" fill="%23F97316"/><circle cx="42" cy="48" r="3.5" fill="%231E293B"/><circle cx="58" cy="48" r="3.5" fill="%231E293B"/></svg>`
];

function SettingsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout, updateLocalAvatar } = useAuth();
  const tabParam = searchParams.get("tab");

  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [profile, setProfile] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);

  // Avatar Modal State
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [tempSelectedAvatar, setTempSelectedAvatar] = useState<string>("");
  const [uploadError, setUploadError] = useState<string>("");

  const handleOpenAvatarModal = () => {
    setTempSelectedAvatar(user?.avatarUrl || "");
    setUploadError("");
    setIsAvatarModalOpen(true);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setUploadError("Kích thước ảnh không được vượt quá 2MB. Vui lòng chọn ảnh nhỏ hơn.");
      return;
    }

    if (!file.type.startsWith("image/")) {
      setUploadError("Vui lòng tải lên một tệp tin hình ảnh hợp lệ (PNG, JPG, JPEG, v.v.)");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        setTempSelectedAvatar(reader.result);
        setUploadError("");
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveAvatar = () => {
    if (tempSelectedAvatar) {
      updateLocalAvatar(tempSelectedAvatar);
      addActivityLog("Thay đổi ảnh đại diện cá nhân");
    }
    setIsAvatarModalOpen(false);
  };

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
                      <div 
                        className="relative group cursor-pointer"
                        onClick={handleOpenAvatarModal}
                        title="Click để đổi ảnh đại diện"
                      >
                        <div className="w-40 h-40 rounded-[2.5rem] overflow-hidden border-4 border-slate-100 shadow-xl relative bg-white flex items-center justify-center transition-all group-hover:scale-98">
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
                          <div className="absolute inset-0 bg-slate-900/10 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center text-white">
                            <span className="text-xs font-black uppercase tracking-widest bg-slate-900/60 px-3 py-1.5 rounded-xl backdrop-blur-sm">Thay đổi</span>
                          </div>
                        </div>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenAvatarModal();
                          }}
                          className="absolute -bottom-2 -right-2 p-3 bg-emerald-600 text-white rounded-2xl shadow-xl hover:scale-110 transition-all border-4 border-white"
                        >
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

      <BaseModal
        isOpen={isAvatarModalOpen}
        onClose={() => setIsAvatarModalOpen(false)}
        title="Thay đổi ảnh đại diện"
        subtitle="Chọn mẫu có sẵn hoặc tải ảnh lên từ máy tính của bạn"
        className="max-w-lg"
      >
        <div className="space-y-8">
          {/* Preview section */}
          <div className="flex flex-col items-center gap-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Xem trước</label>
            <div className="w-32 h-32 rounded-[2rem] overflow-hidden border-4 border-slate-100 shadow-xl relative bg-white flex items-center justify-center transition-all">
              {tempSelectedAvatar ? (
                <Image
                  src={tempSelectedAvatar}
                  alt="Avatar Preview"
                  fill
                  className="object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-full h-full bg-emerald-500 flex items-center justify-center text-3xl font-black text-white">
                  {profile?.firstName?.charAt(0) || user?.givenName?.charAt(0) || "U"}
                </div>
              )}
            </div>
          </div>

          {/* Preset list */}
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Chọn mẫu có sẵn</label>
            <div className="grid grid-cols-4 gap-4 p-4 bg-slate-50 rounded-3xl border border-slate-100/50">
              {PRESET_AVATARS.map((avatar, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setTempSelectedAvatar(avatar);
                    setUploadError("");
                  }}
                  className={cn(
                    "w-full aspect-square rounded-2xl overflow-hidden border-2 transition-all relative cursor-pointer hover:scale-105 active:scale-95",
                    tempSelectedAvatar === avatar
                      ? "border-emerald-600 ring-4 ring-emerald-500/10 scale-102"
                      : "border-transparent hover:border-slate-300"
                  )}
                >
                  <Image
                    src={avatar}
                    alt={`Preset ${idx + 1}`}
                    fill
                    className="object-cover"
                  />
                  {tempSelectedAvatar === avatar && (
                    <div className="absolute right-1.5 bottom-1.5 bg-emerald-600 text-white rounded-full p-0.5 shadow-sm z-10">
                      <Check size={10} className="stroke-[3]" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Upload Custom Image */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Hoặc tải lên ảnh từ thiết bị</label>
            <input
              type="file"
              id="avatar-file-input"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />
            <button
              onClick={() => document.getElementById("avatar-file-input")?.click()}
              className="flex items-center justify-center gap-2 w-full py-3 bg-white border-2 border-dashed border-slate-200 rounded-2xl text-slate-600 font-bold hover:bg-slate-50 hover:border-emerald-500/50 hover:text-emerald-700 transition-all cursor-pointer shadow-sm active:scale-98"
            >
              <Upload size={18} />
              <span>Tải ảnh lên từ máy</span>
            </button>
            {uploadError && (
              <p className="text-xs text-rose-500 font-medium text-center mt-1">{uploadError}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-4 border-t border-slate-100">
            <button
              onClick={() => setIsAvatarModalOpen(false)}
              className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl font-black uppercase tracking-widest text-xs transition-all active:scale-95"
            >
              Hủy
            </button>
            <button
              onClick={handleSaveAvatar}
              className="flex-1 py-3 bg-emerald-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/25 active:scale-95 flex items-center justify-center gap-2"
            >
              Lưu thay đổi
            </button>
          </div>
        </div>
      </BaseModal>
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

