"use client";

import React, { useState, useRef, useEffect } from "react";
import { Bell, Settings, Menu, LogOut, User, Shield, HelpCircle, Check, Clock } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/shared/lib/utils";
import { useAuth } from "@/shared/components/AuthProvider";

const notifications = [
  {
    id: 1,
    title: "Cảnh báo nhiệt độ",
    description: "Chuồng A-01 vượt ngưỡng 30°C",
    time: "2 phút trước",
    type: "alert",
    read: false
  },
  {
    id: 2,
    title: "Lịch tiêm phòng",
    description: "Đàn P-2024-05 cần tiêm Vaccine FMD",
    time: "1 giờ trước",
    type: "info",
    read: false
  },
  {
    id: 3,
    title: "Báo cáo tháng",
    description: "Báo cáo doanh thu tháng 3 đã sẵn sàng",
    time: "5 giờ trước",
    type: "success",
    read: true
  }
];

export function TopBar({ onMenuClick }: { onMenuClick?: () => void }) {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="h-14 bg-white/80 backdrop-blur-md border-b border-slate-100/80 flex items-center justify-between px-6 sticky top-0 z-40 shadow-sm">
      <div className="flex items-center gap-6 flex-1">
        <div className="flex items-center gap-3">
          <button 
            onClick={onMenuClick}
            className="lg:hidden p-2 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all active:scale-95"
          >
            <Menu size={16} />
          </button>
          
          <div className="hidden lg:flex items-center gap-2">
            <div className="w-1 h-4 bg-emerald-500 rounded-full"></div>
            <h2 className="text-[13px] font-black text-slate-800 tracking-tighter uppercase">Hệ thống quản lý trang trại Mão Điền</h2>
          </div>
        </div>

      </div>

      <div className="flex items-center gap-1.5 md:gap-2">
        <div className="relative" ref={notificationRef}>
          <button 
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className={cn(
              "p-2 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all relative group active:scale-90",
              isNotificationsOpen && "bg-emerald-50 text-emerald-600 shadow-inner"
            )}
          >
            <Bell size={16} />
            <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-rose-500 rounded-full border-2 border-white pointer-events-none group-hover:scale-110 transition-transform shadow-[0_0_8px_rgba(244,63,94,0.5)] animate-pulse"></span>
          </button>

          <AnimatePresence>
            {isNotificationsOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.98 }}
                className="absolute right-0 mt-3 w-80 bg-white rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-slate-100 overflow-hidden"
              >
                <div className="px-4 py-3 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
                  <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-widest">Thông báo mới</h4>
                  <button className="text-[9px] font-black text-emerald-600 hover:text-emerald-700 uppercase tracking-tighter">Đánh dấu tất cả</button>
                </div>
                <div className="max-h-[300px] overflow-y-auto">
                  {notifications.map((n) => (
                    <div key={n.id} className={cn(
                      "p-3 flex gap-3 hover:bg-slate-50 transition-colors cursor-pointer border-b border-slate-50 last:border-0",
                      !n.read && "bg-emerald-50/20"
                    )}>
                      <div className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-sm",
                        n.type === "alert" ? "bg-rose-50 text-rose-500" : 
                        n.type === "success" ? "bg-emerald-50 text-emerald-500" : "bg-blue-50 text-blue-500"
                      )}>
                        {n.type === "alert" ? <Clock size={14} /> : n.type === "success" ? <Check size={14} /> : <Bell size={14} />}
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-[11px] font-bold text-slate-900 leading-tight">{n.title}</p>
                        <p className="text-[10px] text-slate-500 leading-tight line-clamp-1">{n.description}</p>
                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">{n.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="w-full py-2.5 text-[10px] font-black text-slate-400 hover:text-emerald-600 hover:bg-slate-50 transition-all border-t border-slate-50 uppercase tracking-widest">
                  Xem tất cả
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="h-4 w-px bg-slate-100 mx-1"></div>
        
        <div className="relative" ref={userMenuRef}>
          {user ? (
            <div 
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-2.5 pl-1 md:pl-2 group cursor-pointer"
            >
              <div className="text-right hidden sm:block">
                <p className="text-[11px] font-black text-slate-800 leading-none group-hover:text-emerald-600 transition-colors">
                  {user.name || `${user.familyName || ''} ${user.givenName || ''}`.trim() || user.username}
                </p>
                <div className="flex items-center justify-end gap-1 mt-0.5">
                   <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse"></div>
                   <p className="text-[8px] text-slate-400 uppercase tracking-widest font-black">
                     {user.role || (user.roles?.[0]?.name) || "Thành viên"}
                   </p>
                </div>
              </div>
              <div className={cn(
                "relative w-7 h-7 rounded-full overflow-hidden border shrink-0 transition-all shadow-inner flex items-center justify-center bg-slate-50",
                isUserMenuOpen ? "border-emerald-500 ring-4 ring-emerald-500/10 scale-105" : "border-slate-100 group-hover:border-emerald-400 group-hover:scale-105"
              )}>
                {user.avatarUrl ? (
                  <Image 
                    src={user.avatarUrl}
                    alt={user.name || user.username || "Avatar"}
                    fill
                    className="object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-full h-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <User size={14} />
                  </div>
                )}
              </div>
            </div>
          ) : (
            <Link 
              href="/login"
              className="px-4 py-1.5 bg-emerald-600 text-white rounded-lg text-[11px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-900/10 active:scale-95"
            >
              Đăng nhập
            </Link>
          )}

          <AnimatePresence>
            {isUserMenuOpen && user && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden"
              >
                <div className="p-4 bg-slate-50/50 border-b border-slate-100">
                  <p className="text-xs font-black text-slate-900">
                    {user.name || `${user.familyName || ''} ${user.givenName || ''}`.trim() || user.username || "Người dùng"}
                  </p>
                  <p className="text-[10px] text-slate-500 mt-0.5">{user.email}</p>
                </div>
                <div className="p-2">
                  {[
                    { label: "Hồ sơ cá nhân", icon: User, href: "/profile" },
                    { label: "Cài đặt tài khoản", icon: Settings, href: "/settings" },
                    { label: "Bảo mật", icon: Shield, href: "/settings?tab=security" },
                    { label: "Trợ giúp", icon: HelpCircle, href: "/support" },
                  ].map((item) => (
                    <Link 
                      key={item.label}
                      href={item.href}
                      onClick={() => setIsUserMenuOpen(false)}
                      className="w-full flex items-center gap-3 px-3 py-2 text-xs font-bold text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"
                    >
                      <item.icon size={16} />
                      {item.label}
                    </Link>
                  ))}
                </div>
                <div className="p-2 border-t border-slate-100">
                  <button 
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      logout();
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                  >
                    <LogOut size={16} />
                    Đăng xuất
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}

