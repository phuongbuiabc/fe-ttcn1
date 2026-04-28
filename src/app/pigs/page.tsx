'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { PlusCircle, RefreshCw, Search } from 'lucide-react';

import { usePig } from '@/modules/pig/hooks/usePig';
import { useBreed } from '@/modules/breed/hooks/useBreed';
import { PigTable } from '@/modules/pig/ui/PigTable';
import { PigStats } from '@/modules/pig/ui/PigStats';
import { PigFormModal } from '@/modules/pig/ui/PigFormModal';
import { ActionConfirmModal } from '@/modules/pig/ui/ActionConfirmModal';
import { PigDetail } from '@/modules/pig/ui/PigDetail';

import { PigType, PigStatus } from '@/shared/enums/pig.enum';
import {
  PigResponse,
  CreatePigRequest,
} from '@/modules/pig/model/pig.model';

import { ActionType } from '@/modules/pig/constants/action-confirm';
import { usePathname } from 'next/navigation';
import { getPageTitle } from '@/shared/utils/getPageTitle';

interface ConfirmModalState {
  isOpen: boolean;
  type?: ActionType;
  targetId?: string;
  targetName?: string;
}

export default function PigPage() {
  const {
    pigs,
    pigDetail,
    loadingList,
    loadingDetail,
    fetchPigs,
    fetchPigDetail,
    createPig,
    updatePig,
    deletePig,
  } = usePig();

  const {
    options: breedOptions,
    loading: isLoadingBreeds,
    fetchBreeds,
  } = useBreed();

  const pathname = usePathname();
  const title = getPageTitle(pathname);

  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [editingPig, setEditingPig] = useState<PigResponse | null>(null);
  const [selectedPigId, setSelectedPigId] = useState<string | null>(null);
  const [isDetailMode, setIsDetailMode] = useState(false);

  const [confirmModal, setConfirmModal] = useState<ConfirmModalState>({
    isOpen: false,
  });

  const [formData, setFormData] = useState<CreatePigRequest>({
    type: PigType.NAI,
    status: PigStatus.ACTIVE,
  });

  // ✅ FIX: chỉ load 1 lần (không phụ thuộc function)
  useEffect(() => {
    fetchPigs();
    fetchBreeds();
  }, []);

  const filteredPigs = useMemo(() => {
    return pigs.filter((p) =>
      [p.pigCode, p.earTag, p.species, p.type]
        .join(' ')
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  }, [pigs, searchTerm]);

  const openAddModal = () => {
    setEditingPig(null);
    setIsDetailMode(false);

    setFormData({
      type: PigType.NAI,
      status: PigStatus.ACTIVE,
    });

    setIsModalOpen(true);
  };

  const handleSave = async (data: CreatePigRequest) => {
    if (editingPig) {
      await updatePig(editingPig.id, data);
    } else {
      await createPig(data);
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

      {/* HEADER */}
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

      {/* STATS */}
      <PigStats pigs={pigs} />

      {/* SEARCH */}
      <div className="bg-white p-4 rounded-xl">
        <div className="relative max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2" size={14} />
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo mã, tai, giống..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 rounded-xl text-sm"
          />
        </div>
      </div>

      {/* MAIN */}
      <div className={`grid gap-4 ${isDetailMode ? 'grid-cols-1 lg:grid-cols-10' : 'grid-cols-1'}`}>

        {/* TABLE */}
        <div className={isDetailMode ? 'bg-white rounded-xl overflow-hidden lg:col-span-6' : 'bg-white rounded-xl overflow-hidden'}>
          <PigTable
            pigs={filteredPigs}
            loading={loadingList}
            onView={async (pig) => {
              if (pig.id === selectedPigId && isDetailMode) return;

              setSelectedPigId(pig.id);
              setIsDetailMode(true);
              await fetchPigDetail(pig.id);
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

        {/* DETAIL */}
        {isDetailMode && (
            <div className="bg-white rounded-xl p-4 overflow-y-auto max-h-[80vh] lg:col-span-4">
            <PigDetail
              data={pigDetail}
              loading={loadingDetail}
              onClose={() => setIsDetailMode(false)}
            />
          </div>
        )}
      </div>

      {/* MODAL */}
      <PigFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        editingPig={editingPig}
        formData={formData}
        setFormData={setFormData}
        breedOptions={breedOptions}
        isLoadingBreeds={isLoadingBreeds}
      />

      {/* CONFIRM */}
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