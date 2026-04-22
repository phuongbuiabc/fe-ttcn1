"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/shared/lib/utils";
import { useModuleStore } from "@/shared/store/useModeulStore";

export function TopBar({ onMenuClick }: { onMenuClick?: () => void }) {
  const pathname = usePathname();
  const { tabs, activeModule } = useModuleStore();

  return (
    <header className="h-14 bg-white border-b flex items-center px-4">
      <div className="flex items-center gap-2">
        <div className="w-1 h-4 bg-emerald-500 rounded" />

        {tabs.length === 0 ? (
          <span className="font-bold text-sm uppercase">
            {activeModule}
          </span>
        ) : (
          tabs.map((tab) => {
            const active = pathname === tab.href;

            return (
              <Link
                key={tab.name}
                href={tab.href || "#"}
                className={cn(
                  "px-3 py-1 text-xs font-bold uppercase rounded",
                  active
                    ? "bg-emerald-600 text-white"
                    : "text-slate-600 hover:bg-slate-100"
                )}
              >
                {tab.name}
              </Link>
            );
          })
        )}
      </div>
    </header>
  );
}