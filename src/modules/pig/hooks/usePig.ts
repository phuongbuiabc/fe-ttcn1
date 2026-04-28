import { useState, useCallback } from 'react';
import { pigService } from '../api/pig.service';
import {
  PigResponse,
  PigDetailResponse,
  CreatePigRequest,
  UpdatePigRequest,
} from '../model/pig.model';

export function usePig() {
  const [pigs, setPigs] = useState<PigResponse[]>([]);
  const [pigDetail, setPigDetail] = useState<PigDetailResponse | null>(null);

  const [loadingList, setLoadingList] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);

  // ===== FETCH LIST =====
  const fetchPigs = useCallback(async () => {
    setLoadingList(true);
    try {
      const res = await pigService.getAll();
      if (res.success) {
        setPigs(res.data || []);
      }
    } finally {
      setLoadingList(false);
    }
  }, []);

  // ===== FETCH DETAIL=====
  const fetchPigDetail = useCallback(async (id: string) => {
    setLoadingDetail(true);
    try {
      const res = await pigService.getPigDetail(id);
      if (res.success) {
        setPigDetail(res.data);
      }
    } finally {
      setLoadingDetail(false);
    }
  }, []);

  // ===== CREATE =====
  const createPig = async (data: CreatePigRequest) => {
    const res = await pigService.create(data);
    if (res.success) {
      await fetchPigs();
    }
    return res;
  };

  // ===== UPDATE =====
  const updatePig = async (id: string, data: UpdatePigRequest) => {
    const res = await pigService.update(id, data);
    if (res.success) {
      await fetchPigs();
    }
    return res;
  };

  // ===== DELETE =====
  const deletePig = async (id: string) => {
    const res = await pigService.delete(id);
    if (res.success) {
      setPigs((prev) => prev.filter((p) => p.id !== id));
    }
    return res;
  };

  return {
    pigs,
    pigDetail,

    loadingList,
    loadingDetail,

    fetchPigs,
    fetchPigDetail,

    createPig,
    updatePig,
    deletePig,
  };
}