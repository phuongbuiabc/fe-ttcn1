import { useState, useCallback } from 'react';
import { pigService } from '../api/pig.service';
import {
  PigResponse,
  PigDetailResponse,
  SowResponse,
  PigCurrentResponse,
  PregnantResponse,
  PigHistoryFarrowingResponse,
  CreatePigRequest,
  UpdatePigRequest,
} from '../model/pig.model';

export function usePig() {
  const [pigs, setPigs] = useState<PigResponse[]>([]);
  const [sows, setSows] = useState<SowResponse[]>([]);
  const [pigCurrent, setPigCurrent] = useState<PigCurrentResponse[]>([]);
  const [pigDetail, setPigDetail] = useState<PigDetailResponse | null>(null);
  const [pregnantPigs, setPregnantPigs] = useState<PregnantResponse[]>([]);
  const [pigHistoryFarrowing, setPigHistoryFarrowing] = useState<PigHistoryFarrowingResponse[]>([]);

  const [loadingList, setLoadingList] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);

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

  const fetchPigCurrent = useCallback(async (type?: string) => {
    setLoadingList(true);
    try {
      const res = await pigService.getPigCurrent(type);
      if (res.success) {
        const normalized = (res.data || []).map((item: any): PigCurrentResponse => {
          const latestGrowth = item.latestGrowth || {};

          return {
            id: item.id || item.pigId || item.pig?.id || '',
            earTag: item.earTag || item.pigEarTag || item.pig?.earTag || '',
            type: item.type || item.pig?.type,
            species: item.species || item.pig?.species,
            status: item.status || item.pig?.status,
            latestTrackingDate:
              item.latestTrackingDate || item.trackingDate || latestGrowth.trackingDate,
            weight: item.weight ?? item.weigth ?? latestGrowth.weight ?? latestGrowth.weigth,
            litterLength:
              item.litterLength ?? item.litterLegth ?? latestGrowth.litterLength ?? latestGrowth.litterLegth,
            chestGirth: item.chestGirth ?? latestGrowth.chestGirth,
            adg: item.adg ?? latestGrowth.adg,
            fcr: item.fcr ?? latestGrowth.fcr,
          };
        });

        setPigCurrent(normalized);
      }
    } finally {
      setLoadingList(false);
    }
  }, []);

  const fetchPregnantPigs = useCallback(async () => {
    setLoadingList(true);
    try {
      const res = await pigService.getPregnantPigs();
      if (res.success) {
        setPregnantPigs(res.data || []);
      }
    } finally {
      setLoadingList(false);
    }
  }, []);

  const fetchPigHistoryFarrowing = useCallback(async (id: string) => {
    setLoadingHistory(true);
    try {
      const res = await pigService.getPigHistoryFarrowing(id);
      if (res.success) {
        setPigHistoryFarrowing(res.data || []);
        return res.data || [];
      }

      setPigHistoryFarrowing([]);
      return [];
    } finally {
      setLoadingHistory(false);
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
    pregnantPigs,
    pigHistoryFarrowing,
    loadingList,
    loadingDetail,
    loadingHistory,

    fetchPigs,
    fetchSows,
    fetchPigDetail,
    fetchPigCurrent,
    fetchPregnantPigs,
    fetchPigHistoryFarrowing,
    createPig,
    updatePig,
    deletePig,
  };
}