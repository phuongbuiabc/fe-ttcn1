import { useState, useCallback } from 'react';
import { penService } from '../api/pen.service';
import {
  PenResponse,
  PenDetailResponse,
  CreatePenRequest,
  UpdatePenRequest,
} from '../model/pen.model';

export function usePen() {
  const [pens, setPens] = useState<PenResponse[]>([]);
  const [penDetail, setPenDetail] = useState<PenDetailResponse | null>(null);

  const [loadingList, setLoadingList] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const fetchPens = useCallback(async () => {
    setLoadingList(true);
    try {
      const res = await penService.getAll();
      if (res.success) {
        setPens(res.data || []);
      }
    } finally {
      setLoadingList(false);
    }
  }, []);

  const fetchPenDetail = useCallback(async (id: string) => {
    setLoadingDetail(true);
    try {
      const res = await penService.getDetail(id);
      if (res.success) {
        setPenDetail(res.data);
      }
    } finally {
      setLoadingDetail(false);
    }
  }, []);

  const createPen = async (data: CreatePenRequest) => {
    const res = await penService.create(data);
    if (res.success) {
      await fetchPens();
    }
    return res;
  };

  const updatePen = async (id: string, data: UpdatePenRequest) => {
    const res = await penService.update(id, data);
    if (res.success) {
      await fetchPens();
    }
    return res;
  };

  const deletePen = async (id: string) => {
    const res = await penService.delete(id);
    if (res.success) {
      setPens(prev => prev.filter(p => p.id !== id));
    }
    return res;
  };

  return {
    pens,
    penDetail,
    loadingList,
    loadingDetail,
    fetchPens,
    fetchPenDetail,
    createPen,
    updatePen,
    deletePen,
  };
}