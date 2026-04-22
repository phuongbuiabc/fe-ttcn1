import { useEffect, useState } from 'react';
import { areaService } from '@/modules/area/api/area.service';
import { Area } from '@/modules/area/model/area.model';

export function useAreaList() {
  const [areas, setAreas] = useState<Area[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    areaService.getAll()
      .then(res => {
        setAreas(res.data || []);
      })
      .catch(err => setError(err?.message || 'Lỗi khi tải khu vực'))
      .finally(() => setLoading(false));
  }, []);

  return { areas, loading, error };
}
