'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { PlusCircle, RefreshCw, PawPrint, Venus, Mars } from 'lucide-react';
import { usePathname } from 'next/navigation';

import { useArea } from '@/modules/area/hooks/useArea';
import { penService } from '@/modules/pens/api/pen.service';
import { usePen } from '@/modules/pens/hooks/usePen';
import { usePenPig } from '@/modules/penpig/hooks/usePenpig';
import { usePig } from '@/modules/pig/hooks/usePig';
import { useBreed } from '@/modules/breed/hooks/useBreed';
import { PigTable } from '@/modules/pig/ui/PigTable';
import { PigFormModal } from '@/modules/pig/ui/PigFormModal';
import { ActionConfirmModal } from '@/modules/pig/ui/ActionConfirmModal';
import { PigDetail } from '@/modules/pig/ui/PigDetail';
import KPICard from '@/shared/components/KPICard';

import { PigType, PigStatus } from '@/shared/enums/pig.enum';
import { PigResponse, CreatePigRequest } from '@/modules/pig/model/pig.model';
import { CreatePenPigRequest } from '@/modules/penpig/model/penpig.model';

import { ActionType } from '@/modules/pig/constants/action-confirm';
import { getPageTitle } from '@/shared/utils/getPageTitle';

interface ConfirmModalState {
  isOpen: boolean;
  type?: ActionType;
  targetId?: string;
  targetName?: string;
}

const getToday = () => new Date().toISOString().slice(0, 10);

export default function PigPage() {
  const {
    pigs,
    pigCurrent,
    pigDetail,
    pigHistoryFarrowing,
    loadingList,
    loadingDetail,
    loadingHistory,
    fetchPigs,
    fetchPigCurrent,
    fetchPigDetail,
    fetchPigHistoryFarrowing,
    createPig,
    updatePig,
    deletePig,
  } = usePig();

  const { options: breedOptions, loading: isLoadingBreeds, fetchBreeds } = useBreed();
  const { areas, fetchAreas } = useArea();
  const { pens, fetchPens } = usePen();
  const { assignPig, loading: isAssigningPig } = usePenPig();

  const pathname = usePathname();
  const title = getPageTitle(pathname);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPig, setEditingPig] = useState<PigResponse | null>(null);
  const [selectedPigId, setSelectedPigId] = useState<string | null>(null);
  const [isDetailMode, setIsDetailMode] = useState(false);
  const [penPigCountMap, setPenPigCountMap] = useState<Record<string, number>>({});
  const [confirmModal, setConfirmModal] = useState<ConfirmModalState>({ isOpen: false });

  const [formData, setFormData] = useState<CreatePigRequest>({
    type: PigType.NAI,
    status: PigStatus.ACTIVE,
  });

  useEffect(() => {
    fetchPigs();
    fetchPigCurrent();
    fetchBreeds();
    fetchAreas();
    fetchPens();
  }, [fetchPigs, fetchPigCurrent, fetchBreeds, fetchAreas, fetchPens]);

  useEffect(() => {
    const loadPenCounts = async () => {
      const entries = await Promise.all(
        pens.map(async (pen) => {
          try {
            const res = await penService.getDetail(pen.id);
            return [pen.id, res.success ? res.data?.pigCount ?? 0 : 0] as const;
          } catch {
            return [pen.id, 0] as const;
          }
        })
      );

      setPenPigCountMap(Object.fromEntries(entries));
    };

    if (pens.length > 0) {
      loadPenCounts();
    } else {
      setPenPigCountMap({});
    }
  }, [pens]);



  const emptyPens = useMemo(() => {
    return pens.filter((pen) => (penPigCountMap[pen.id] ?? 0) === 0);
  }, [pens, penPigCountMap]);

  const pigKpis = useMemo(() => {
    return {
      totalPigs: pigs.length,
      totalSows: pigs.filter((pig) => pig.type === PigType.NAI).length,
      totalBoars: pigs.filter((pig) => pig.type === PigType.NOC).length,
    };
  }, [pigs]);

  const openAddModal = () => {
    setEditingPig(null);
    setIsDetailMode(false);
    setFormData({
      type: PigType.NAI,
      status: PigStatus.ACTIVE,
      herdEntryDate: getToday(),
    });
    setIsModalOpen(true);
  };

  const handleSave = async (data: CreatePigRequest & { penId?: string }) => {
    const { penId, ...pigData } = data;
    const entryDate = pigData.herdEntryDate || getToday();

    if (editingPig) {
      await updatePig(editingPig.id, pigData);
    } else {
      const res = await createPig(pigData);
      const createdPigId = res?.data?.id;

      if (penId && createdPigId) {
        const payload: CreatePenPigRequest = {
          penId,
          pigId: createdPigId,
          entryDate,
        };

        await assignPig(payload);
        await fetchPens();
      }
    }

    setIsModalOpen(false);
  };

  const handleDelete = async () => {
    if (!confirmModal.targetId) return;

    await deletePig(confirmModal.targetId);
    setConfirmModal({ isOpen: false });
  };

  return (
    <div className="space-y-4 pb-20 bg-[#fbfcfd] min-h-screen -m-4 p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-extrabold uppercase">{title}</h1>

        <div className="flex gap-2">
          <button
            onClick={fetchPigs}
            className="px-4 py-2 bg-white rounded-xl text-xs flex items-center gap-2"
          >
            <RefreshCw size={14} className={loadingList ? 'animate-spin' : ''} />
            Làm mới
          </button>

          <button
            onClick={openAddModal}
            className="px-5 py-2 bg-emerald-600 text-white rounded-full flex items-center gap-2"
          >
            <PlusCircle size={14} />
            Thêm lợn
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <KPICard
          label="Tổng số lợn"
          value={pigKpis.totalPigs}
          icon={PawPrint}
          tone="emerald"
        />
        <KPICard
          label="Số nái"
          value={pigKpis.totalSows}
          icon={Venus}
          tone="rose"
        />
        <KPICard
          label="Số nọc"
          value={pigKpis.totalBoars}
          icon={Mars}
          tone="blue"
        />
      </div>

      <div className={`grid gap-4 ${isDetailMode ? 'grid-cols-1 lg:grid-cols-10' : 'grid-cols-1'}`}>
        <div className={isDetailMode ? 'bg-white rounded-xl overflow-hidden lg:col-span-6' : 'bg-white rounded-xl overflow-hidden'}>
          <PigTable
            pigs={pigs}
            loading={loadingList}
            onView={async (pig) => {
              if (pig.id === selectedPigId && isDetailMode) return;

              setSelectedPigId(pig.id);
              setIsDetailMode(true);

              const detail = await fetchPigDetail(pig.id);

              if (detail?.pig.type === PigType.NAI) {
                await fetchPigHistoryFarrowing(pig.id);
              }
            }}
            onEdit={(pig) => {
              setEditingPig(pig);
              setIsDetailMode(false);
              setFormData({
                earTag: pig.earTag,
                birthWeight: pig.birthWeight,
                birthDate: pig.birthDate,
                type: pig.type,
                origin: pig.origin,
                species: pig.species,
                nippleCount: pig.nippleCount,
                herdEntryDate: pig.herdEntryDate,
                status: pig.status,
              });
              setIsModalOpen(true);
            }}
            onDelete={(id) =>
              setConfirmModal({
                isOpen: true,
                type: 'delete-pig',
                targetId: id,
                targetName: id,
              })
            }
          />
        </div>

        {isDetailMode && (
          <div className="bg-white rounded-xl p-4 overflow-y-auto max-h-[80vh] lg:col-span-4">
            <PigDetail
              data={pigDetail}
              loading={loadingDetail}
              pigCurrent={pigCurrent.find((item) => item.id === pigDetail?.pig.id) ?? null}
              farrowingHistory={pigDetail?.pig.type === PigType.NAI ? pigHistoryFarrowing : []}
              farrowingLoading={loadingHistory}
              onClose={() => setIsDetailMode(false)}
            />
          </div>
        )}
      </div>

      <PigFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        editingPig={editingPig}
        formData={formData}
        setFormData={setFormData}
        breedOptions={breedOptions}
        isLoadingBreeds={isLoadingBreeds}
        areas={areas}
        pens={editingPig ? pens : emptyPens}
        isLoadingPens={isAssigningPig}
      />

      {confirmModal.type && (
        <ActionConfirmModal
          isOpen={confirmModal.isOpen}
          type={confirmModal.type}
          targetName={confirmModal.targetName}
          onClose={() => setConfirmModal({ isOpen: false })}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}