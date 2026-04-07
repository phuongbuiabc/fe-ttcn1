"use client";

import React, { useState, useRef, useEffect } from "react";
import { Bell, Search, Settings, Menu, LogOut, User, Shield, HelpCircle, Check, Clock } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

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
    <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-4 md:px-8 sticky top-0 z-40">
      <div className="flex items-center gap-4 flex-1 max-w-md">
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-2 text-slate-600 hover:text-emerald-600 transition-colors"
        >
          <Menu size={20} />
        </button>
        <div className="relative w-full group hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors" size={16} />
          <input 
            type="text" 
            placeholder="Tìm kiếm đàn, chuồng hoặc nhật ký..." 
            className="w-full bg-slate-50 border-none rounded-full py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:bg-white transition-all placeholder:text-slate-400 outline-none text-slate-700"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <div className="relative" ref={notificationRef}>
          <button 
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className={cn(
              "p-2.5 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-full transition-all relative group active:scale-90",
              isNotificationsOpen && "bg-emerald-50 text-emerald-600"
            )}
          >
            <Bell size={20} />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white group-hover:scale-110 transition-transform"></span>
          </button>

          <AnimatePresence>
            {isNotificationsOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden"
              >
                <div className="p-4 border-b border-slate-50 flex items-center justify-between">
                  <h4 className="text-sm font-black text-slate-900 font-headline">Thông báo</h4>
                  <button className="text-[10px] font-bold text-emerald-600 hover:underline">Đánh dấu đã đọc</button>
                </div>
                <div className="max-h-[320px] overflow-y-auto">
                  {notifications.map((n) => (
                    <div key={n.id} className={cn(
                      "p-4 flex gap-3 hover:bg-slate-50 transition-colors cursor-pointer border-b border-slate-50 last:border-0",
                      !n.read && "bg-emerald-50/30"
                    )}>
                      <div className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                        n.type === "alert" ? "bg-rose-100 text-rose-600" : 
                        n.type === "success" ? "bg-emerald-100 text-emerald-600" : "bg-blue-100 text-blue-600"
                      )}>
                        {n.type === "alert" ? <Clock size={16} /> : n.type === "success" ? <Check size={16} /> : <Bell size={16} />}
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-slate-900">{n.title}</p>
                        <p className="text-[11px] text-slate-500 leading-tight">{n.description}</p>
                        <p className="text-[10px] text-slate-400 font-medium">{n.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="w-full py-3 text-xs font-bold text-slate-500 hover:text-emerald-600 hover:bg-slate-50 transition-all border-t border-slate-50">
                  Xem tất cả thông báo
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="h-6 w-px bg-slate-200 mx-1 md:mx-2"></div>
        
        <div className="relative" ref={userMenuRef}>
          <div 
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center gap-3 pl-1 md:pl-2 group cursor-pointer"
          >
            <div className="text-right hidden sm:block">
              <p className="text-xs font-black text-slate-900 leading-none font-headline group-hover:text-emerald-600 transition-colors">Marcus Thorne</p>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-1.5 font-black">Admin</p>
            </div>
            <div className={cn(
              "relative w-10 h-10 rounded-full overflow-hidden border-2 shrink-0 transition-all shadow-sm",
              isUserMenuOpen ? "border-emerald-500" : "border-emerald-100 group-hover:border-emerald-500"
            )}>
              <Image 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCU8H1s-kjjlI2NWZ__-jyblSSG7AHeOmfBWSF8MxnkOItZRulZPOyAz2qjUhh1OL64lfdFM3kKVyoIqsyWJn5zjUx7eLL_HW8pI7vf7kinoqASkg8UI3plURqUft8OU90He4GSu8H6s1eeSLihn2CxkXvzfLfGOt1_K0f_R5CcwU5SWhzTWWSwqDfcNCrJcqrvpPZbGJ421OUkC2tzipzeMZWNrpeeEb8uqSfmGHmEmiduDR15CCVyTYCHUQc6re0vxz3nNLuM4UFJ"
                alt="Marcus Thorne"
                fill
                className="object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>

          <AnimatePresence>
            {isUserMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden"
              >
                <div className="p-4 bg-slate-50/50 border-b border-slate-100">
                  <p className="text-xs font-black text-slate-900">Marcus Thorne</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">marcus@agriintel.vn</p>
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
                  <button className="w-full flex items-center gap-3 px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition-all">
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
