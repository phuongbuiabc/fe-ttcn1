import { useState, useCallback, useMemo } from "react";
import { semenService } from "@/modules/semen/api/semen.service";
import { SemenResponse, CreateSemenRequest, UpdateSemenRequest } from "@/modules/semen/model/semen.model";

export function useSemen() {
  const [semens, setSemens] = useState<SemenResponse[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchSemens = useCallback(async () => {
    setLoading(true);
    try {
      const res: any = await semenService.getSemens();
      if (res?.success) {
        setSemens(res.data || []);
      } else if (Array.isArray(res?.data)) {
        setSemens(res.data);
      } else if (Array.isArray(res)) {
        setSemens(res);
      } else {
        setSemens([]);
      }
    } catch (err) {
      console.error("useSemen.fetchSemens", err);
      setSemens([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const createSemen = async (data: CreateSemenRequest) => {
    const res = await semenService.createSemen(data);
    if (res?.success) {
      await fetchSemens();
    }
    return res;
  };

  const updateSemen = async (id: string, data: UpdateSemenRequest) => {
    const res = await semenService.updateSemen(id, data);
    if (res?.success) {
      await fetchSemens();
    }
    return res;
  };

  const deleteSemen = async (id: string) => {
    const res = await semenService.deleteSemen(id);
    if (res?.success) {
      setSemens((prev) => prev.filter((s) => s.id !== id));
    }
    return res;
  };

  const options = useMemo(() => semens.map((s) => ({ label: s.boarPigEarTag || s.id, value: s.id })), [semens]);

  return {
    semens,
    loading,
    fetchSemens,
    createSemen,
    updateSemen,
    deleteSemen,
    options,
  };
}

export default useSemen;
