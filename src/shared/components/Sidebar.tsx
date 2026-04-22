"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Settings,
  HelpCircle,
  Database,
  Users,
  ShoppingCart,
  Warehouse,
  Stethoscope,
  Baby,
  PawPrint,
  Calendar,
  Truck,
  User,
  ArrowDownLeft,
  ArrowUpRight,
  Sprout,
  X,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { motion, AnimatePresence } from "motion/react";
import { useModuleStore } from "@/shared/store/useModeulStore";

const navItems = [
  { name: "Bảng điều khiển", icon: LayoutDashboard, href: "/" },

  {
    name: "Quản lý lợn",
    icon: PawPrint,
    href: "/pigs",
    children: [
      { name: "Danh sách lợn", icon: PawPrint, href: "/pigs" },
      { name: "Đàn con", icon: Baby, href: "/litter" },
      { name: "Giống", icon: Database, href: "/breed" },
    ],
  },

  {
    name: "Sinh sản",
    icon: Baby,
    href: "/reproduction",
    children: [
      { name: "Phối giống", icon: Baby, href: "/reproduction/mating" },
      { name: "Đẻ", icon: Calendar, href: "/reproduction/birth" },
    ],
  },

  { name: "Sức khỏe", icon: Stethoscope, href: "/health" },
  { name: "Chuồng nuôi", icon: Warehouse, href: "/pens" },

  {
    name: "Mua bán",
    icon: ShoppingCart,
    href: "/trading",
    children: [
      { name: "Nhập hàng", icon: ArrowDownLeft, href: "/trading/import" },
      { name: "Bán hàng", icon: ArrowUpRight, href: "/trading/export" },
    ],
  },

  { name: "Nhà cung cấp", icon: Truck, href: "/suppliers" },

  {
    name: "Nhân sự",
    icon: Users,
    href: "/staff",
    children: [
      { name: "Nhân viên", icon: User, href: "/staff" },
      { name: "Lịch làm việc", icon: Calendar, href: "/staff/schedule" },
    ],
  },
];

export function Sidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  const { setModule } = useModuleStore();

  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpand = (name: string) => {
    setExpandedItems((prev) =>
      prev.includes(name) ? prev.filter((i) => i !== name) : [...prev, name]
    );
  };

  return (
    <aside className="w-56 h-screen bg-[#0f172a] flex flex-col">
      <div className="p-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Sprout className="text-white" size={18} />
          <span className="text-white font-black">MDFARM</span>
        </Link>

        <button onClick={onClose} className="lg:hidden text-white">
          <X size={18} />
        </button>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {navItems.map((item) => {
          const hasChildren = !!item.children;
          const isActive = pathname === item.href;

          if (hasChildren) {
            const isExpanded = expandedItems.includes(item.name);

            return (
              <div key={item.name}>
                <button
                  onClick={() => {
                    toggleExpand(item.name);
                    setModule(item.name, item.children ?? []);
                  }}
                  className="flex items-center justify-between w-full px-3 py-2 text-slate-300 hover:text-white"
                >
                  <div className="flex items-center gap-2">
                    <item.icon size={16} />
                    {item.name}
                  </div>
                  <ChevronRight size={14} />
                </button>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div className="pl-6">
                      {item.children?.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={() =>
                            setModule(item.name, item.children ?? [])
                          }
                          className="block py-1 text-sm text-slate-400 hover:text-white"
                        >
                          {child.name}
                        </Link>
                      ))}
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
              onClick={() => setModule(item.name, [])}
              className={cn(
                "flex items-center gap-2 px-3 py-2",
                isActive ? "text-white bg-emerald-600" : "text-slate-400"
              )}
            >
              <item.icon size={16} />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}