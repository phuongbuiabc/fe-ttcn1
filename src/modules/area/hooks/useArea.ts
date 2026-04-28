import { useState, useCallback } from 'react';
import { areaService } from '../api/area.service';
import {
  AreaResponse,
  CreateAreaRequest,
  UpdateAreaRequest,
} from '../model/area.model';

export function useArea() {
  const [areas, setAreas] = useState<AreaResponse[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchAreas = useCallback(async () => {
    setLoading(true);
    try {
      const res = await areaService.getAll();
      if (res.success) {
        setAreas(res.data || []);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const createArea = async (data: CreateAreaRequest) => {
    const res = await areaService.create(data);
    if (res.success) {
      await fetchAreas();
    }
    return res;
  };

  const updateArea = async (id: string, data: UpdateAreaRequest) => {
    const res = await areaService.update(id, data);
    if (res.success) {
      await fetchAreas();
    }
    return res;
  };

  const deleteArea = async (id: string) => {
    const res = await areaService.delete(id);
    if (res.success) {
      setAreas(prev => prev.filter(a => a.id !== id));
    }
    return res;
  };

  return {
    areas,
    loading,
    fetchAreas,
    createArea,
    updateArea,
    deleteArea,
  };
}