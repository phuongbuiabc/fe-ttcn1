import { useState, useCallback } from 'react';
import { growthService } from '../../pig/api/piggrowth.service';
import { GrowthTracking } from '../../pig/model/piggrowth.model';

export function usePiggrowth() {
  const [piggrowths, setPiggrowths] = useState<GrowthTracking[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchPiggrowths = useCallback(async () => {
    setLoading(true);
    try {
      const res = await growthService.getAll();
      setPiggrowths(res.data || []);
    } finally {
      setLoading(false);
    }
  }, []);

  const createGrowth = async (data: any) => {
    await growthService.create(data);
    await fetchPiggrowths();
  };

  const updateGrowth = async (id: string, data: any) => {
    await growthService.update(id, data);
    await fetchPiggrowths();
  };

  const deleteGrowth = async (id: string) => {
    await growthService.delete(id);
    await fetchPiggrowths();
  };

  return {
    piggrowths,
    loading,
    fetchPiggrowths,
    createGrowth,
    updateGrowth,
    deleteGrowth,
  };
}