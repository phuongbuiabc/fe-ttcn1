import { useEffect, useState, useMemo } from "react";
import { cullingProposalService } from "@/modules/cullingproposal/api/CullingProposal.service";
import { CullingProposal } from "@/modules/cullingproposal/model/CullingProposal.model";

export const useCullingProposal = () => {
  const [data, setData] = useState<CullingProposal[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const res = await cullingProposalService.getAll();
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

  useEffect(() => {
    fetchAll();
  }, []);

  const disposeList = useMemo(
    () => data.filter(i => i.proposalType === "CULLING"),
    [data]
  );

  const sellOffList = useMemo(
    () => data.filter(i => i.proposalType === "SELL_OFF"),
    [data]
  );

  return {
    data,
    disposeList,
    sellOffList,
    loading,
    fetchAll,
    create,
    update,
    remove,
  };
};