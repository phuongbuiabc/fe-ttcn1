"use client";

import React, { useState } from "react";
import { cn } from "@/shared/utils/utils";
import { MonthlyLiveBirthsChart } from "@/modules/dashboard/ui/Charts/MonthlyLiveBirthsChart";
import { FeedConsumptionChart } from "@/modules/dashboard/ui/Charts/FeedConsumptionChart";
import { SurvivalRateChart } from "@/modules/dashboard/ui/Charts/SurvivalRateChart";
import { WeightDistributionChart } from "@/modules/dashboard/ui/Charts/WeightDistributionChart";
import { MatingSuccessRateChart } from "@/modules/dashboard/ui/Charts/MatingSuccessRateChart";
import { MonthlyRevenueChart } from "@/modules/dashboard/ui/Charts/MonthlyRevenueChart";
import { MonthlyImportCostChart } from "@/modules/dashboard/ui/Charts/MonthlyImportCostChart";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<"farm" | "revenue">("farm");

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4">
        <div className="min-w-0 space-y-4">
          <div className="bg-white p-2 rounded-2xl border border-slate-100 shadow-sm inline-flex gap-2">
            <button
              onClick={() => setActiveTab("farm")}
              className={cn(
                "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                activeTab === "farm"
                  ? "bg-[#00a67d] text-white shadow-lg shadow-emerald-900/10"
                  : "text-slate-500 hover:bg-slate-50"
              )}
            >
              Trang trại
            </button>

            <button
              onClick={() => setActiveTab("revenue")}
              className={cn(
                "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                activeTab === "revenue"
                  ? "bg-blue-50 text-blue-700"
                  : "text-slate-500 hover:bg-slate-50"
              )}
            >
              Doanh thu
            </button>
          </div>

          {activeTab === "farm" ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <MonthlyLiveBirthsChart />
                <FeedConsumptionChart />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <SurvivalRateChart />
                <WeightDistributionChart />
                <MatingSuccessRateChart />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <MonthlyRevenueChart />
              <MonthlyImportCostChart />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
