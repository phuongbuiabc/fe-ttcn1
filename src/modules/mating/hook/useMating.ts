import { useState, useCallback } from "react";
import { matingService } from "../api/mating.service";
import {
  MatingResponse,
  CreateMatingRequest,
  UpdateMatingRequest
} from "../model/mating.model";

export function useMating() {
  const [matings, setMatings] = useState<MatingResponse[]>([]);
  const [loading, setLoading] = useState(false);

  // GET ALL
  const fetchMatings = useCallback(async () => {
    setLoading(true);
    try {
      const res = await matingService.getMatings();
      if (res.success) {
        setMatings(Array.isArray(res.data) ? res.data : []);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // GET BY ID
  const getMatingById = useCallback(async (id: string) => {
    try {
      const res = await matingService.getMatingById(id);
      return res;
    } catch (err) {
      console.error(err);
      return null;
    }
  }, []);

  // CREATE
  const createMating = async (data: CreateMatingRequest) => {
    try {
      const res = await matingService.createMating(data);
      if (res.success) {
        await fetchMatings();
      }
      return res;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  // UPDATE
  const updateMating = async (id: string, data: UpdateMatingRequest) => {
    try {
      const res = await matingService.updateMating(id, data);
      if (res.success) {
        await fetchMatings();
      }
      return res;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  // DELETE
  const deleteMating = async (id: string) => {
    try {
      const res = await matingService.deleteMating(id);
      if (res.success) {
        setMatings((prev) => prev.filter((i) => i.id !== id));
      }
      return res;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  return {
    matings,
    loading,
    fetchMatings,
    getMatingById,
    createMating,
    updateMating,
    deleteMating,
  };
}

export default useMating;
