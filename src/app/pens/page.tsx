'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Plus, ArrowRightLeft, Warehouse, DoorOpen, Wrench } from 'lucide-react';
import { usePathname } from 'next/navigation';

import { PenDetail } from '@/modules/pens/ui/PenDetail';
import { getPageTitle } from '@/shared/utils/getPageTitle';

import { TransferPigModal } from '@/modules/pens/ui/TransferPigModal';
import { PenTable } from '@/modules/pens/ui/PenTable';
import { PenForm } from '@/modules/pens/ui/PenForm';
import KPICard from '@/shared/components/KPICard';

import { useArea } from '@/modules/area/hooks/useArea';
import { usePen } from '@/modules/pens/hooks/usePen';

import { PenStatus } from '@/shared/enums/pen.enum';
import { PenResponse } from '@/modules/pens/model/pen.model';

export default function PenPage() {
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);

  const [openForm, setOpenForm] = useState(false);
  const [editingPen, setEditingPen] = useState<PenResponse | null>(null);
  const [selectedPenId, setSelectedPenId] = useState<string | null>(null);
  const [isDetailMode, setIsDetailMode] = useState(false);

  const {
    pens,
    penDetail,
    loadingList,
    loadingDetail,
    fetchPens,
    fetchPenDetail,
    deletePen,
    createPen,
    updatePen,
  } = usePen();

  const {
    areas,
    loading: areaLoading,
    fetchAreas,
  } = useArea();

  const pathname = usePathname();
  const title = getPageTitle(pathname);

  useEffect(() => {
    fetchPens();
    fetchAreas();
  }, [fetchPens, fetchAreas]);

  const penKpis = useMemo(() => {
    return {
      inUse: pens.filter((item) => item.status === PenStatus.IN_USE).length,
      empty: pens.filter((item) => item.status === PenStatus.EMPTY).length,
      maintenance: pens.filter((item) => item.status === PenStatus.MAINTENANCE).length,
    };
  }, [pens]);

  const handleEdit = (pen: PenResponse) => {
    setEditingPen(pen);
    setOpenForm(true);
  };

  const handleDelete = async (id: string) => {
    await deletePen(id);
  };

  const handleCreate = async (data: any) => {
    await createPen(data);
    setOpenForm(false);
  };

  const handleUpdate = async (data: any) => {
    if (!editingPen) return;
    await updatePen(editingPen.id, data);
    setEditingPen(null);
    setOpenForm(false);
  };

  return (
    <div className="space-y-4 pb-20 bg-[#fbfcfd] min-h-screen -m-4 p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-extrabold uppercase">{title}</h1>

        <div className="flex gap-2">
          <button
            onClick={() => {
              setEditingPen(null);
              setOpenForm(true);
            }}
            className="px-4 py-2 bg-white border rounded-xl text-xs flex items-center gap-2"
          >
            <Plus size={14} /> Thêm chuồng
          </button>

          <button
            onClick={() => setIsTransferModalOpen(true)}
            className="px-5 py-2 bg-emerald-600 text-white rounded-full flex items-center gap-2"
          >
            <ArrowRightLeft size={14} /> Điều chuyển
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <KPICard
          label="Đang sử dụng"
          value={penKpis.inUse}
          icon={Warehouse}
          tone="emerald"
        />
        <KPICard
          label="Trống"
          value={penKpis.empty}
          icon={DoorOpen}
          tone="blue"
        />
        <KPICard
          label="Bảo trì"
          value={penKpis.maintenance}
          icon={Wrench}
          tone="amber"
        />
      </div>

      <div className={`grid gap-4 ${isDetailMode ? 'grid-cols-1 lg:grid-cols-10' : 'grid-cols-1'}`}>
        <div className={isDetailMode ? 'bg-white rounded-xl overflow-hidden lg:col-span-6' : 'bg-white rounded-xl overflow-hidden'}>
          <PenTable
            pens={pens}
            areas={areas}
            loading={loadingList}
            onView={async (p) => {
              if (p.id === selectedPenId && isDetailMode) return;
              setSelectedPenId(p.id);
              setIsDetailMode(true);
              await fetchPenDetail(p.id);
            }}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>

        {isDetailMode && (
          <div className="bg-white rounded-xl p-4 overflow-y-auto max-h-[80vh] lg:col-span-4">
            <PenDetail
              pen={penDetail}
              loading={loadingDetail}
              onClose={() => setIsDetailMode(false)}
            />
          </div>
        )}
      </div>

      <PenForm
        open={openForm}
        onClose={() => {
          setOpenForm(false);
          setEditingPen(null);
        }}
        onSubmit={editingPen ? handleUpdate : handleCreate}
        initialData={editingPen}
      />

      <TransferPigModal
        isOpen={isTransferModalOpen}
        onClose={() => setIsTransferModalOpen(false)}
        pens={pens}
        areas={areas}
        onTransferred={async (sourcePenId) => {
          await fetchPens();

          if (selectedPenId === sourcePenId) {
            await fetchPenDetail(sourcePenId);
          }
        }}
      />
    </div>
  );
}
