// hooks/use-pigs.ts
import { useState, useEffect, useCallback } from 'react';
import { pigService } from '@/entities/pig/api/pig.service';
import { Pig } from '@/shared/types';
import { mapApiPigToUI } from '@/entities/pig/utils/mappers';

export function usePigs() {
  const [pigs, setPigs] = useState<Pig[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const stats = {
    total: pigs.length,
    healthy: pigs.filter(p => p.healthStatus === 'HEALTHY' || p.healthStatus === 'Khỏe mạnh').length,
    sick: pigs.filter(p => p.healthStatus === 'SICK' || p.healthStatus === 'Bệnh').length,
    treating: pigs.filter(p => p.healthStatus === 'TREATING' || p.healthStatus === 'Đang điều trị').length,
    growthRate: 12, // Dummy for now
  };

  const fetchPigs = useCallback(async () => {
    try {
      setLoading(true);
      const response = await pigService.getAll();
      if (response.success) {
        const mappedPigs = (response.data || []).map(mapApiPigToUI);
        setPigs(mappedPigs);
      } else {
        setError(response.message || 'Failed to fetch pigs');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch pigs');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPigs();
  }, [fetchPigs]);

  const addPig = async (data: Partial<Pig>) => {
    const response = await pigService.create(data);
    if (response.success) {
      setPigs(prev => [response.data, ...prev]);
      return response.data;
    }
    throw new Error(response.message || 'Failed to create pig');
  };

  const removePig = async (id: string) => {
    const response = await pigService.delete(id);
    if (response.success) {
      setPigs(prev => prev.filter(p => p.id !== id));
    } else {
      throw new Error(response.message || 'Failed to delete pig');
    }
  };

  return { pigs, stats, loading, error, refresh: fetchPigs, addPig, removePig };
}
