// usePigletHerdGrowth.ts

import { useState, useCallback } from 'react';
import { pigletHerdGrowthService } from '../api/pigletherdgrowth.service';
import { PigletHerdGrowth } from '../model/pigletherdgrowth.model';

export function usePigletHerdGrowth() {
  const [growths, setGrowths] = useState<PigletHerdGrowth[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchGrowths = useCallback(async () => {
    setLoading(true);
    try {
      const res = await pigletHerdGrowthService.getAll();
      setGrowths(res.data|| []);
    } finally {
      setLoading(false);
    }
  }, []);

  const createGrowth = async (data: any) => {
    await pigletHerdGrowthService.create(data);
    await fetchGrowths();
  };

  const updateGrowth = async (id: string, data: any) => {
    await pigletHerdGrowthService.update(id, data);
    await fetchGrowths();
  };

  const deleteGrowth = async (id: string) => {
    await pigletHerdGrowthService.delete(id);
    await fetchGrowths();
  };

  return {
    growths,
    loading,
    fetchGrowths,
    createGrowth,
    updateGrowth,
    deleteGrowth,
  };
}