import { useState, useCallback } from 'react';
import { pigService } from '../api/pig.service';
import {
  PigResponse,
  PigDetailResponse,
  SowResponse,
  PigCurrentResponse,
  CreatePigRequest,
  UpdatePigRequest,
} from '../model/pig.model';

export function usePig() {
  const [pigs, setPigs] = useState<PigResponse[]>([]);
  const [sows, setSows] = useState<SowResponse[]>([]);
  const [pigCurrent, setPigCurrent] = useState<PigCurrentResponse[]>([]);
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
        return res.data;
      }
      return null;
    } finally {
      setLoadingDetail(false);
    }
  }, []);

  const fetchSows = useCallback(async () => {
    setLoadingList(true);
    try {
      const res = await pigService.getSow();
      if (res.success) {
        setSows(res.data || []);
      }
    } finally {
      setLoadingList(false);
    }
  }, []);

  const fetchPigCurrent = useCallback(async () => {
    setLoadingList(true);
    try {
      const res = await pigService.getPigCurrent();
      if (res.success) {
        setPigCurrent(res.data || []);
      }
    } finally {
      setLoadingList(false);
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
    sows,
    pigDetail,
    pigCurrent,
    loadingList,
    loadingDetail,

    fetchPigs,
    fetchSows,
    fetchPigDetail,
    fetchPigCurrent,

    createPig,
    updatePig,
    deletePig,
  };
}