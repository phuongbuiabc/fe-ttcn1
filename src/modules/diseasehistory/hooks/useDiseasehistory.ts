import { useState, useCallback } from 'react';
import { diseaseHistoryService } from '../api/diseasehistory.service';

import {
  DiseaseHistoryResponse,
  CreateDiseaseHistoryRequest,
  UpdateDiseaseHistoryRequest,
} from '../model/diseasehistory.model';

export function useDiseaseHistory() {
  const [data, setData] = useState<DiseaseHistoryResponse[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const res = await diseaseHistoryService.getAll();
      if (res.success) {
        setData(res.data || []);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const create = async (payload: CreateDiseaseHistoryRequest) => {
    const res = await diseaseHistoryService.create(payload);
    if (res.success) {
      await fetchAll();
    }
    return res;
  };

  const update = async (
    id: string,
    payload: UpdateDiseaseHistoryRequest
  ) => {
    const res = await diseaseHistoryService.update(id, payload);
    if (res.success) {
      await fetchAll();
    }
    return res;
  };

  const remove = async (id: string) => {
    const res = await diseaseHistoryService.delete(id);
    if (res.success) {
      setData((prev) => prev.filter((i) => i.id !== id));
    }
    return res;
  };

  return {
    data,
    loading,
    fetchAll,
    create,
    update,
    remove,
  };
}