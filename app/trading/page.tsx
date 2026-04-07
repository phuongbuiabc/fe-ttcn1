"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function TradingPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/trading/import");
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="animate-pulse text-slate-400 font-medium">Đang chuyển hướng...</div>
    </div>
  );
}
