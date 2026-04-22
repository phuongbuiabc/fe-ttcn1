import { useState, useCallback } from 'react';
import { breedService } from '../api/breed.service';
import {
  BreedResponse,
  CreateBreedRequest,
  UpdateBreedRequest,
} from '../model/breed.model';

export function useBreed() {
  const [breeds, setBreeds] = useState<BreedResponse[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchBreeds = useCallback(async () => {
    setLoading(true);
    try {
      const res = await breedService.getAll();

      console.log("BREED API:", res);

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

  return {
    breeds,
    loading,
    fetchBreeds,
    createBreed,
    updateBreed,
    deleteBreed,
  };
}