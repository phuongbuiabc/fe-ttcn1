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
  const [loading, setLoading] = useState(false);

  const fetchPigs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await pigService.getAll();
      if (res.success) {
        setPigs(res.data);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPigDetail = useCallback(async (id: string) => {
    setLoading(true);
    try {
      const res = await pigService.getById(id);
      if (res.success) {
        setPigDetail(res.data);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const createPig = async (data: CreatePigRequest) => {
    const res = await pigService.create(data);
    if (res.success) {
      await fetchPigs();
    }
    return res;
  };

  const updatePig = async (id: string, data: UpdatePigRequest) => {
    const res = await pigService.update(id, data);
    if (res.success) {
      await fetchPigs();
    }
    return res;
  };

  const deletePig = async (id: string) => {
    const res = await pigService.delete(id);
    if (res.success) {
      setPigs(prev => prev.filter(p => p.id !== id));
    }
    return res;
  };

  return {
    pigs,
    pigDetail,
    loading,
    fetchPigs,
    fetchPigDetail,
    createPig,
    updatePig,
    deletePig,
  };
}