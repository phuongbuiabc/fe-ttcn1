import { useState, useCallback, useMemo } from 'react';
import { breedService } from '@/modules/breed/api/breed.service';
import {
  BreedResponse,
  CreateBreedRequest,
  UpdateBreedRequest,
} from '@/modules/breed/model/breed.model';

export function useBreed() {
  const [breeds, setBreeds] = useState<BreedResponse[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchBreeds = useCallback(async () => {
    setLoading(true);
    try {
      const res = await breedService.getAll();

      if (res.success) {
        setBreeds(res.data);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const createBreed = async (data: CreateBreedRequest) => {
    const res = await breedService.create(data);
    if (res.success) {
      await fetchBreeds();
    }
    return res;
  };

  const updateBreed = async (id: string, data: UpdateBreedRequest) => {
    const res = await breedService.update(id, data);
    if (res.success) {
      await fetchBreeds();
    }
    return res;
  };

  const deleteBreed = async (id: string) => {
    const res = await breedService.delete(id);
    if (res.success) {
      setBreeds(prev => prev.filter(b => b.id !== id));
    }
    return res;
  };

  const options = useMemo(() => {
    return breeds.map((b) => ({
      label: b.name,
      value: b.id,
    }));
  }, [breeds]);

  return {
    breeds,
    options,
    loading,
    fetchBreeds,
    createBreed,
    updateBreed,
    deleteBreed,
  };
}