"use client";

import React from "react";
import { Plus } from "lucide-react";
import { StatCards } from "@/modules/dashboard/ui/StatCards";
import { MainCharts } from "@/modules/dashboard/ui/MainCharts";
import { AlertsSection } from "@/modules/dashboard/ui/AlertsSection";
import { RecentActivity } from "@/modules/dashboard/ui/RecentActivity";

export default function Dashboard() {
  return (
    <div className="space-y-4">
      {/* Hero Statistics Cards */}
      <StatCards />

      {/* Main Content Grid */}
      <div className="grid grid-cols-12 gap-6 items-start">
        {/* Left Column: Charts Area */}
        <MainCharts />

        {/* Right Column: Alerts & Activity */}
        <div className="col-span-12 lg:col-span-4 h-full">
          <div className="sticky top-20 flex flex-col gap-4 bg-slate-100/50 p-4 rounded-2xl border border-slate-200/50 h-[calc(100vh-104px)]">
            <AlertsSection />
            <RecentActivity />
          </div>
        </div>
      </div>

      {/* FAB */}
      <button className="fixed bottom-8 right-8 w-14 h-14 bg-[#006c49] text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all z-50">
        <Plus size={32} />
      </button>
    </div>
  );
}
