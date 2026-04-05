"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Plus,
  Settings, 
  HelpCircle,
  ChevronRight,
  ChevronDown,
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
  Sprout,
  User,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";

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
  { 
    name: "Nhân sự", 
    icon: Users, 
    href: "/staff",
    children: [
      { name: "Nhân viên", icon: User, href: "/staff" },
      { name: "Lịch làm việc", icon: Calendar, href: "/staff/schedule" },
      { name: "Chấm công", icon: ClipboardCheck, href: "/staff/attendance" },
      { name: "Nghỉ phép", icon: CalendarX, href: "/staff/leave" },
    ]
  },
];

const bottomItems = [
  { name: "Cài đặt", icon: Settings, href: "/settings" },
  { name: "Hỗ trợ", icon: HelpCircle, href: "/support" },
];

export function Sidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  const [isStaffExpanded, setIsStaffExpanded] = useState(pathname.startsWith("/staff"));

  return (
    <aside className="w-64 h-screen bg-[#0f172a] flex flex-col border-r border-white/5 z-50">
      <div className="p-8 pb-6 flex items-center justify-between">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 bg-gradient-to-br from-[#006c49] to-[#10b981] rounded-xl flex items-center justify-center shadow-lg shadow-emerald-900/40">
            <Sprout className="text-white" size={20} />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tighter text-white font-headline">MDFARM</h1>
        </div>
        <button 
          onClick={onClose}
          className="lg:hidden p-2 text-slate-400 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>
      </div>
      <div className="px-8 mb-6 lg:block hidden">
        <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mt-0.5">QUẢN LÝ LỢN GIỐNG v2.0</p>
      </div>

      <nav className="flex-1 px-4 space-y-1 overflow-y-auto no-scrollbar">
        {navItems.map((item) => {
          const hasChildren = !!item.children;
          const isActive = pathname === item.href || (hasChildren && pathname.startsWith(item.href));
          
          if (hasChildren) {
            return (
              <div key={item.name} className="space-y-1">
                <button
                  onClick={() => setIsStaffExpanded(!isStaffExpanded)}
                  className={cn(
                    "w-full group flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200",
                    isActive && !isStaffExpanded
                      ? "bg-emerald-600 text-white font-bold shadow-lg shadow-emerald-900/20" 
                      : "text-slate-400 hover:bg-white/5 hover:text-white"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <item.icon size={20} className={cn("transition-colors", isActive && !isStaffExpanded ? "text-white" : "text-slate-500 group-hover:text-emerald-400")} />
                    <span className="text-sm">{item.name}</span>
                  </div>
                  <motion.div
                    animate={{ rotate: isStaffExpanded ? 90 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronRight size={14} className={cn(isActive && !isStaffExpanded ? "text-white" : "text-slate-600")} />
                  </motion.div>
                </button>
                
                <AnimatePresence initial={false}>
                  {isStaffExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2, ease: "easeInOut" }}
                      className="overflow-hidden pl-4 space-y-1"
                    >
                      {item.children?.map((child) => {
                        const isChildActive = pathname === child.href;
                        return (
                          <Link
                            key={child.href}
                            href={child.href}
                            className={cn(
                              "flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200",
                              isChildActive 
                                ? "text-white font-bold bg-white/10" 
                                : "text-slate-500 hover:text-emerald-400 hover:bg-white/5"
                            )}
                          >
                            <child.icon size={18} className={cn(isChildActive ? "text-emerald-400" : "text-slate-600")} />
                            <span className="text-xs">{child.name}</span>
                          </Link>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200",
                isActive 
                  ? "bg-emerald-600 text-white font-bold shadow-lg shadow-emerald-900/20" 
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon size={20} className={cn("transition-colors", isActive ? "text-white" : "text-slate-500 group-hover:text-emerald-400")} />
                <span className="text-sm">{item.name}</span>
              </div>
              {isActive && (
                <motion.div layoutId="active-indicator">
                  <ChevronRight size={14} className="text-white" />
                </motion.div>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 mt-auto border-t border-white/5">
        {bottomItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-emerald-400 transition-colors rounded-xl hover:bg-white/5"
          >
            <item.icon size={20} className="text-slate-600" />
            <span className="text-sm font-medium">{item.name}</span>
          </Link>
        ))}
      </div>
    </aside>
  );
}
