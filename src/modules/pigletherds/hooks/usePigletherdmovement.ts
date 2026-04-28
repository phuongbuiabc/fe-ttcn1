// usePigletHerdMovement.ts

import { useState, useCallback } from 'react';
import { pigletHerdMovementService } from '../api/pigletherdmovement.service';
import { PigletHerdMovement } from '../model/pigletherdmovement.model';

export function usePigletHerdMovement() {
  const [movements, setMovements] = useState<PigletHerdMovement[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchMovements = useCallback(async () => {
    setLoading(true);
    try {
      const res = await pigletHerdMovementService.getAll();
      setMovements(res.data || []);
    } finally {
      setLoading(false);
    }
  }, []);

  const createMovement = async (data: any) => {
    await pigletHerdMovementService.create(data);
    await fetchMovements();
  };

  const updateMovement = async (id: string, data: any) => {
    await pigletHerdMovementService.update(id, data);
    await fetchMovements();
  };

  const deleteMovement = async (id: string) => {
    await pigletHerdMovementService.delete(id);
    await fetchMovements();
  };

  return {
    movements,
    loading,
    fetchMovements,
    createMovement,
    updateMovement,
    deleteMovement,
  };
}