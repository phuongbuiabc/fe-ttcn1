import { useState, useCallback } from "react";
import { pigletHerdService } from "@/modules/pigletherds/api/pigletherd.service";
import {
  PigletHerdResponse,
  CreatePigletHerdRequest,
  UpdatePigletHerdRequest
} from "../model/pigletherd.model";

export function usePigletHerd() {
  const [herds, setHerds] = useState<PigletHerdResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [herdDetail, setHerdDetail] = useState<any | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  // GET ALL
  const fetchHerds = useCallback(async () => {
    setLoading(true);
    try {
      const res = await pigletHerdService.getAll();
      setHerds(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // CREATE
  const createHerd = async (data: CreatePigletHerdRequest) => {
    try {
      await pigletHerdService.create(data);
      await fetchHerds();
    } catch (err) {
      console.error(err);
    }
  };

  // UPDATE
  const updateHerd = async (id: string, data: UpdatePigletHerdRequest) => {
    try {
      await pigletHerdService.update(id, data);
      await fetchHerds();
    } catch (err) {
      console.error(err);
    }
  };

  // DELETE
  const deleteHerd = async (id: string) => {
    try {
      await pigletHerdService.delete(id);
      await fetchHerds();
    } catch (err) {
      console.error(err);
    }
  };

  // SPLIT
  const splitHerd = async (id: string, data: any) => {
    try {
      await pigletHerdService.split(id, data);
      await fetchHerds();
    } catch (err) {
      console.error(err);
    }
  };

  // FETCH DETAIL
  const fetchHerdDetail = useCallback(async (id: string) => {
    setLoadingDetail(true);
    try {
      const res = await pigletHerdService.getDetail(id);
      if (res.success) {
        setHerdDetail(res.data || null);
        return res.data;
      }
      setHerdDetail(null);
      return null;
    } catch (err) {
      console.error(err);
      setHerdDetail(null);
      return null;
    } finally {
      setLoadingDetail(false);
    }
  }, []);

  return {
    herds,
    herdDetail,
    loading,
    loadingDetail,
    fetchHerds,
    createHerd,
    updateHerd,
    deleteHerd,
    splitHerd,
    fetchHerdDetail
  };
}