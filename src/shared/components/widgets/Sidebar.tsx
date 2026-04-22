"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  PawPrint,
  Baby,
  Stethoscope,
  Warehouse,
  Database,
  ShoppingCart,
  Truck,
  Users,
  Sprout,
} from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { useModuleStore } from "@/shared/store/useModuleStore";

const navItems = [
  { name: "Dashboard", icon: LayoutDashboard, href: "/" },

  { name: "Lợn", icon: PawPrint, href: "/pigs" },

  { name: "Đàn con", icon: Baby, href: "/litter" },

  { name: "Giống", icon: Database, href: "/breed" },

  { name: "Sinh sản", icon: Baby, href: "/reproduction" },

  { name: "Sức khỏe", icon: Stethoscope, href: "/health" },

  { name: "Chuồng", icon: Warehouse, href: "/pens" },

  { name: "Mua bán", icon: ShoppingCart, href: "/trading" },

  { name: "Nhà cung cấp", icon: Truck, href: "/suppliers" },

  { name: "Nhân sự", icon: Users, href: "/staff" },
];

export function Sidebar() {
  const pathname = usePathname();
  const { setModule } = useModuleStore();

  return (
    <aside className="w-56 h-screen bg-[#0f172a] flex flex-col">
      
      {/* LOGO */}
      <div className="p-4 flex items-center gap-2 text-white font-black">
        <Sprout size={18} />
        MDFARM
      </div>

      {/* MENU */}
      <nav className="flex-1 px-3 space-y-1">
        {navItems.map((item) => {
          const active = pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setModule(item.name, [])}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-lg transition-all",
                active
                  ? "bg-emerald-600 text-white font-bold"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
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