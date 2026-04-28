import { useState, useCallback } from "react";
import { penPigService } from "@/modules/penpig/api/penpig.service";
import { PenPigResponse, CreatePenPigRequest } from "@/modules/penpig/model/penpig.model";

export function usePenPig() {
  const [penPigs, setPenPigs] = useState<PenPigResponse[]>([]);
  const [loading, setLoading] = useState(false);

  // GET ALL
  const fetchPenPigs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await penPigService.getAll();
      setPenPigs(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const assignPig = async (data: CreatePenPigRequest) => {
    try {
      await penPigService.create(data);
      await fetchPenPigs();
    } catch (err) {
      console.error(err);
    }
  };

  // UPDATE
  const updatePenPig = async (id: string, data: any) => {
    try {
      await penPigService.update(id, data);
      await fetchPenPigs();
    } catch (err) {
      console.error(err);
    }
  };

  const removePig = async (id: string) => {
    try {
      await penPigService.delete(id);
      await fetchPenPigs();
    } catch (err) {
      console.error(err);
    }
  };

  return {
    penPigs,
    loading,
    fetchPenPigs,
    assignPig,
    updatePenPig,
    removePig
  };
}