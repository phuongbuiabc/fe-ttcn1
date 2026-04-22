// modules/disease/hooks/useDisease.ts

import { useEffect, useState } from 'react';
import { diseaseService } from '../api/disease.service';

import {
  DiseaseResponse,
  CreateDiseaseRequest,
  UpdateDiseaseRequest,
} from '../model/disease.model';

export function useDisease() {
  const [diseases, setDiseases] = useState<DiseaseResponse[]>([]);
  const [loading, setLoading] = useState(false);

  // 📥 fetch list
  const fetchDiseases = async () => {
    setLoading(true);
    try {
      const res = await diseaseService.getAll();
      if (res.success) {
        setDiseases(res.data || []);
      }
    } finally {
      setLoading(false);
    }
  };

  // ➕ create
  const createDisease = async (data: CreateDiseaseRequest) => {
    const res = await diseaseService.create(data);
    if (res.success) {
      await fetchDiseases();
    }
    return res;
  };

  // ✏️ update
  const updateDisease = async (id: string, data: UpdateDiseaseRequest) => {
    const res = await diseaseService.update(id, data);
    if (res.success) {
      await fetchDiseases();
    }
    return res;
  };

  // ❌ delete
  const deleteDisease = async (id: string) => {
    const res = await diseaseService.delete(id);
    if (res.success) {
      setDiseases((prev) => prev.filter((d) => d.id !== id));
    }
    return res;
  };

  useEffect(() => {
    fetchDiseases();
  }, []);

  return {
    diseases,
    loading,
    fetchDiseases,
    createDisease,
    updateDisease,
    deleteDisease,
  };
}