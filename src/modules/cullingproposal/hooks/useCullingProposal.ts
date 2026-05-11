import { useEffect, useState, useMemo } from "react";
import { cullingProposalService } from "@/modules/cullingproposal/api/CullingProposal.service";
import { CullingProposalResponse } from "@/modules/cullingproposal/model/CullingProposal.model";
import { CullingProposalStatus } from "@/shared/enums/cullingproposal.enum";

export const useCullingProposal = () => {
  const [data, setData] = useState<CullingProposalResponse[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [allRes, processedRes] = await Promise.all([
        cullingProposalService.getAll(),
        cullingProposalService.getProcessed(),
      ]);

      const merged = [...(allRes.data ?? []), ...(processedRes.data ?? [])];
      const uniqueById = Array.from(new Map(merged.map((item) => [item.id, item])).values());

      setData(uniqueById);
    } finally {
      setLoading(false);
    }
  };

  const fetchProcessed = async () => {
    setLoading(true);
    try {
      const res = await cullingProposalService.getProcessed();
      setData(res.data);
    } finally {
      setLoading(false);
    }
  };

  const fetchByType = async (proposalType: string) => {
    setLoading(true);
    try {
      const res = await cullingProposalService.getByType(proposalType);
      setData(res.data);
    } finally {
      setLoading(false);
    }
  };

  const create = async (payload: any) => {
    await cullingProposalService.create(payload);
    await fetchAll();
  };

  const update = async (id: string, payload: any) => {
    await cullingProposalService.update(id, payload);
    await fetchAll();
  };

  const remove = async (id: string) => {
    await cullingProposalService.delete(id);
    setData(prev => prev.filter(i => i.id !== id));
  };

  const review = async (id: string, status: CullingProposalStatus) => {
    await cullingProposalService.review(id, status);
    await fetchAll();
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const disposeList = useMemo(
    () => data.filter(i => i.proposalType === "CULLING" && i.status === CullingProposalStatus.PENDING),
    [data]
  );

  const sellOffList = useMemo(
    () => data.filter(i => i.proposalType === "SELL_OFF" && i.status === CullingProposalStatus.PENDING),
    [data]
  );

  const approvedList = useMemo(
    () => data.filter(i => i.status === CullingProposalStatus.APPROVED),
    [data]
  );

  return {
    data,
    disposeList,
    sellOffList,
    approvedList,
    loading,
    fetchAll,
    create,
    update,
    remove,
    review,
    fetchProcessed,
    fetchByType,
  };
};
