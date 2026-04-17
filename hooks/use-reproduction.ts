import { useState, useEffect, useCallback } from "react";
import { SowRecord, ReproductionStats } from "@/types";
import { reproductionService } from "@/services/reproduction.service";

export function useReproduction() {
  const [sows, setSows] = useState<SowRecord[]>([]);
  const [stats, setStats] = useState<ReproductionStats>({
    totalSows: 0,
    pregnantSows: 0,
    farrowingSoon: 0,
    monthlyLitters: 0,
    conceptionRate: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReproductionData = useCallback(async () => {
    setLoading(true);
    try {
      const [sowsRes, statsRes] = await Promise.all([
        reproductionService.getSows(),
        reproductionService.getStats(),
      ]);

      if (sowsRes.success) {
        setSows(sowsRes.data);
      }
      if (statsRes.success) {
        setStats(statsRes.data);
      }
    } catch (err) {
      setError("Không thể tải dữ liệu sinh sản.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReproductionData();
  }, [fetchReproductionData]);

  const updateStatus = async (id: string, status: string) => {
    try {
      const res = await reproductionService.updateSowStatus(id, status);
      if (res.success) {
        setSows(prev => prev.map(s => s.id === id ? res.data : s));
        return true;
      }
    } catch (err) {
      console.error("Lỗi cập nhật trạng thái:", err);
    }
    return false;
  };

  return {
    sows,
    stats,
    loading,
    error,
    refresh: fetchReproductionData,
    updateStatus,
  };
}
