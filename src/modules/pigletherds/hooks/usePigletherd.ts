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

  return {
    herds,
    loading,
    fetchHerds,
    createHerd,
    updateHerd,
    deleteHerd
  };
}