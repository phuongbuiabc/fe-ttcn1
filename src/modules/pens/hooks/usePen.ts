import { useState, useCallback } from 'react';
import { penService } from '../api/pen.service';
import { tokenStorage } from '@/modules/auth/utils/tokenStorage';
import {
  PenResponse,
  PenDetailResponse,
  CreatePenRequest,
  UpdatePenRequest,
} from '../model/pen.model';

export function usePen() {
  const [pens, setPens] = useState<PenResponse[]>([]);
  const [penDetail, setPenDetail] = useState<PenDetailResponse | null>(null);
  const [detailEndpointBlocked, setDetailEndpointBlocked] = useState(false);

  const [loadingList, setLoadingList] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const fetchPens = useCallback(async () => {
    if (!tokenStorage.getAccessToken()) {
      setPens([]);
      return;
    }

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
    if (!tokenStorage.getAccessToken()) {
      setPenDetail(null);
      return;
    }

    const toFallbackDetail = (pen: PenResponse): PenDetailResponse => ({
      id: pen.id,
      name: pen.name,
      areaId: pen.areaId,
      area: pen.area,
      pigCount: 0,
      pigletCount: 0,
      latestAverageIntake: 0,
      pigs: [],
      pigletHerds: [],
    });

    setLoadingDetail(true);
    try {
      if (!detailEndpointBlocked) {
        const res = await penService.getDetail(id);
        if (res.success) {
          setPenDetail(res.data);
          return;
        }

        const errorText = String((res as any)?.message || '');
        if (/401|unauthorized/i.test(errorText)) {
          setDetailEndpointBlocked(true);
        }
      }

      const fallback = await penService.getById(id);
      if (fallback.success && fallback.data) {
        setPenDetail(toFallbackDetail(fallback.data));
      } else {
        setPenDetail(null);
      }
    } finally {
      setLoadingDetail(false);
    }
  }, [detailEndpointBlocked]);

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