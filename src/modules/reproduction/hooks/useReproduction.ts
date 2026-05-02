import { useState, useEffect, useCallback } from "react";
import { SowRecord, ReproductionStats } from '../model/reproduction.model';
import { pigService } from "@/modules/pig/api/pig.service";
import { PigType } from "@/shared/enums/pig.enum";
import type { PigResponse } from "@/modules/pig/model/pig.model";

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

  const mapPigToSow = (pig: PigResponse, penName?: string): SowRecord => ({
    id: pig.pigCode,
    earTag: pig.earTag ?? pig.pigCode,
    breed: pig.species || pig.origin || pig.earTag || pig.pigCode,
    pen: penName || pig.herdEntryDate || "Chưa có",
    status: pig.status === "SOLD" ? "WEANED" : "OPEN",
    matingDate: pig.herdEntryDate,
    progress: 0,
  });

  const fetchReproductionData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const pigsResult = await pigService.getAll();

      if (pigsResult.success) {
        const pigsRes = pigsResult;
        const sowCandidates = (pigsRes.data || []).filter(
          (pig) => pig.type === PigType.NAI
        );

        const sowRows = await Promise.all(
          sowCandidates.map(async (pig) => {
            try {
              const detailRes = await pigService.getPigDetail(pig.id);
              if (detailRes.success) {
                return mapPigToSow(
                  detailRes.data.pig,
                  detailRes.data.currentPenName
                );
              }
            } catch (detailError) {
              console.error("Không thể tải chi tiết lợn:", detailError);
            }

            return mapPigToSow(pig);
          })
        );

        setSows(sowRows);
        setStats((prev) => ({
          ...prev,
          totalSows: sowRows.length,
        }));
      } else {
        setSows([]);
        setError("Không thể tải danh sách lợn nái.");
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

  return { sows, stats, loading, error, refresh: fetchReproductionData };
}
