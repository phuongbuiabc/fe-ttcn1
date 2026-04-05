"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Plus,
  Settings, 
  HelpCircle,
  ChevronRight,
  Database,
  Users,
  ShoppingCart,
  Warehouse,
  Stethoscope,
  Baby,
  PawPrint,
  Calendar,
  Truck,
  UserCheck,
  ClipboardCheck,
  CalendarX,
  Sprout
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";

const navItems = [
  { name: "Bảng điều khiển", icon: LayoutDashboard, href: "/" },
  { name: "QUẢN LÝ LỢN GIỐNG", icon: PawPrint, href: "/pigs" },
  { name: "Sinh sản", icon: Baby, href: "/reproduction" },
  { name: "Sức khỏe", icon: Stethoscope, href: "/health" },
  { name: "Chuồng nuôi", icon: Warehouse, href: "/pens" },
  { name: "Quản lý Kho", icon: Database, href: "/inventory" },
  { name: "Khách hàng", icon: UserCheck, href: "/customers" },
  { name: "Nhà cung cấp", icon: Truck, href: "/suppliers" },
  { name: "Mua bán", icon: ShoppingCart, href: "/trading" },
  { name: "Nhân sự", icon: Users, href: "/staff" },
  { name: "Lịch làm việc", icon: Calendar, href: "/staff/schedule" },
  { name: "Chấm công", icon: ClipboardCheck, href: "/staff/attendance" },
  { name: "Nghỉ phép", icon: CalendarX, href: "/staff/leave" },
];

const bottomItems = [
  { name: "Cài đặt", icon: Settings, href: "/settings" },
  { name: "Hỗ trợ", icon: HelpCircle, href: "/support" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 h-screen bg-white flex flex-col sticky top-0 border-r border-slate-200/50 z-50">
      <div className="p-8 pb-6">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 bg-gradient-to-br from-[#006c49] to-[#10b981] rounded-xl flex items-center justify-center shadow-lg shadow-emerald-900/20">
            <Sprout className="text-white" size={20} />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tighter text-emerald-800 font-headline">MDFARM</h1>
        </div>
        <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mt-0.5">QUẢN LÝ LỢN GIỐNG v2.0</p>
      </div>

      <nav className="flex-1 px-4 space-y-1 overflow-y-auto no-scrollbar">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200",
                isActive 
                  ? "bg-emerald-50 text-emerald-700 font-bold" 
                  : "text-slate-500 hover:bg-slate-100 hover:text-emerald-600"
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon size={20} className={cn("transition-colors", isActive ? "text-emerald-600" : "text-slate-400 group-hover:text-emerald-500")} />
                <span className="text-sm">{item.name}</span>
              </div>
              {isActive && (
                <motion.div layoutId="active-indicator">
                  <ChevronRight size={14} className="text-emerald-600" />
                </motion.div>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 mt-auto border-t border-slate-200/60">
        {bottomItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-emerald-600 transition-colors rounded-xl hover:bg-slate-100"
          >
            <item.icon size={20} className="text-slate-400" />
            <span className="text-sm font-medium">{item.name}</span>
          </Link>
        ))}
      </div>
    </aside>
  );
}
