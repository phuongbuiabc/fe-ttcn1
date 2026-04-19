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
  X,
  ArrowDownLeft,
  ArrowUpRight
} from "lucide-react";
import { cn } from "../../shared/lib/utils";
import { motion, AnimatePresence } from "motion/react";

const navItems = [
  { name: "Bảng điều khiển", icon: LayoutDashboard, href: "/" },
  { name: "Quản lý Đàn lợn", icon: PawPrint, href: "/pigs" },
  { name: "Sinh sản", icon: Baby, href: "/reproduction" },
  { name: "Sức khỏe", icon: Stethoscope, href: "/health" },
  { name: "Chuồng nuôi", icon: Warehouse, href: "/pens" },
  { name: "Vật tư", icon: Database, href: "/inventory" },
  { 
    name: "Mua bán", 
    icon: ShoppingCart, 
    href: "/trading",
    children: [
      { name: "Nhập hàng", icon: ArrowDownLeft, href: "/trading/import" },
      { name: "Bán hàng", icon: ArrowUpRight, href: "/trading/export" },
    ]
  },
  { name: "Nhà cung cấp", icon: Truck, href: "/suppliers" },
  { 
    name: "Nhân sự", 
    icon: Users, 
    href: "/staff",
    children: [
      { name: "Nhân viên", icon: User, href: "/staff" },
      { name: "Lịch làm việc", icon: Calendar, href: "/staff/schedule" },
    ]
  },
];

const bottomItems = [
  { name: "Cài đặt", icon: Settings, href: "/settings" },
  { name: "Hỗ trợ", icon: HelpCircle, href: "/support" },
];

export function Sidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<string[]>(() => {
    const expanded = [];
    if (pathname.startsWith("/staff")) expanded.push("Nhân sự");
    if (pathname.startsWith("/trading")) expanded.push("Mua bán");
    return expanded;
  });

  const toggleExpand = (name: string) => {
    setExpandedItems(prev => 
      prev.includes(name) ? prev.filter(i => i !== name) : [...prev, name]
    );
  };

  return (
    <aside className="w-56 h-screen bg-[#0f172a] flex flex-col border-r border-white/5 z-50 shadow-2xl">
      <div className="p-4 pb-2 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group/logo">
          <div className="w-8 h-8 bg-gradient-to-br from-[#006c49] to-[#10b981] rounded flex items-center justify-center shadow-lg shadow-emerald-900/40 group-hover/logo:scale-105 transition-transform">
            <Sprout className="text-white" size={16} />
          </div>
          <h1 className="text-lg font-black tracking-tighter text-white font-headline">MDFARM</h1>
        </Link>
        <button 
          onClick={onClose}
          className="lg:hidden p-2 text-slate-400 hover:text-white transition-colors"
        >
          <X size={18} />
        </button>
      </div>

      <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto no-scrollbar pt-3">
        {navItems.map((item) => {
          const hasChildren = !!item.children;
          const isActive = pathname === item.href || (hasChildren && pathname.startsWith(item.href));
          
          if (hasChildren) {
            const isExpanded = expandedItems.includes(item.name);
            return (
              <div key={item.name} className="space-y-0.5">
                <button
                  onClick={() => toggleExpand(item.name)}
                  className={cn(
                    "w-full group flex items-center justify-between px-4 py-2 rounded-lg transition-all duration-200 relative overflow-hidden",
                    isActive && !isExpanded
                      ? "bg-emerald-600 text-white font-bold shadow-md shadow-emerald-900/40" 
                      : "text-slate-400 hover:bg-white/5 hover:text-white"
                  )}
                >
                  <div className="flex items-center gap-3 relative z-10">
                    <item.icon size={18} className={cn("transition-colors", isActive && !isExpanded ? "text-white" : "text-slate-500 group-hover:text-emerald-400")} />
                    <span className="text-sm tracking-tight">{item.name}</span>
                  </div>
                  <motion.div
                    animate={{ rotate: isExpanded ? 90 : 0 }}
                    transition={{ duration: 0.15 }}
                    className="relative z-10"
                  >
                    <ChevronRight size={14} className={cn(isActive && !isExpanded ? "text-white" : "text-slate-600")} />
                  </motion.div>
                </button>
                
                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden pl-4 space-y-0.5"
                    >
                      {item.children?.map((child) => {
                        const isChildActive = pathname === child.href;
                        return (
                          <Link
                            key={child.href}
                            href={child.href}
                            className={cn(
                              "flex items-center gap-3 px-4 py-1.5 rounded-lg transition-all group/child relative",
                              isChildActive 
                                ? "text-white font-bold bg-white/5 border border-white/5" 
                                : "text-slate-500 hover:text-emerald-400 hover:bg-white/5"
                            )}
                          >
                            <child.icon size={16} className={cn("transition-colors", isChildActive ? "text-emerald-400" : "text-slate-600 group-hover/child:text-emerald-400")} />
                            <span className="text-xs tracking-tight">{child.name}</span>
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
                "group flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 relative overflow-hidden",
                isActive 
                  ? "bg-emerald-600 text-white font-bold shadow-md shadow-emerald-900/40" 
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              )}
            >
              <item.icon size={18} className={cn("transition-colors", isActive ? "text-white" : "text-slate-500 group-hover:text-emerald-400")} />
              <span className="text-sm tracking-tight">{item.name}</span>
              {isActive && (
                <motion.div layoutId="active-indicator" className="ml-auto">
                  <div className="w-1 h-1 bg-white rounded-full shadow-[0_0_8px_white]" />
                </motion.div>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 mt-auto border-t border-white/5 space-y-0.5">
        {bottomItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-3 px-4 py-2 text-slate-500 hover:text-emerald-400 transition-colors rounded-lg hover:bg-white/5"
          >
            <item.icon size={18} className="text-slate-600" />
            <span className="text-sm font-medium">{item.name}</span>
          </Link>
        ))}
      </div>
    </aside>
  );
}

