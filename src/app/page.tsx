"use client";

import React from "react";
import { SummarySection } from "@/modules/dashboard/ui/KPISection";
import DashboardPage from "@/modules/dashboard/ui/DashboardPage";

export default function Home() {
  return (
    <div className="space-y-4 pb-20 bg-[#fbfcfd] min-h-screen -m-4 p-4">
      <SummarySection />

      <DashboardPage />
    </div>
  );
}
