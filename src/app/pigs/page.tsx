'use client';

import React, { useState, useMemo } from 'react';
import { PlusCircle, RefreshCw, Search } from 'lucide-react';
import { useEffect } from 'react';

import { usePig } from '@/modules/pig/hooks/usePig';
import { PigTable } from '@/modules/pig/ui/PigTable';
import { PigStats } from '@/modules/pig/ui/PigStats';
import { PigFormModal } from '@/modules/pig/ui/PigFormModal';
import { ActionConfirmModal } from '@/modules/pig/ui/ActionConfirmModal';

import {
  PigResponse,
  CreatePigRequest,
} from '@/modules/pig/model/pig.model';
import { ActionType } from '@/modules/pig/constants/action-confirm';

interface ConfirmModalState {
  isOpen: boolean;
  type?: ActionType;
  targetId?: string;
  targetName?: string;
}


export default function PigPage() {
  const {
    pigs,
    loading,
    fetchPigs,
    createPig,
    updatePig,
    deletePig,
  } = usePig();

  const [searchTerm, setSearchTerm] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [confirmModal, setConfirmModal] = useState<ConfirmModalState>({
    isOpen: false,
  });

  const [editingPig, setEditingPig] = useState<PigResponse | null>(null);

  const [formData, setFormData] = useState<CreatePigRequest>({
    type: 'NAI',
    status: 'ACTIVE',
  });

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
    setFormData({
      type: 'NAI',
      status: 'ACTIVE',
    });
    setIsModalOpen(true);
  };

  useEffect(() => {
    fetchPigs();
  }, [fetchPigs]);


  const handleSave = async (data: CreatePigRequest) => {
    if (editingPig) {
      await updatePig(editingPig.id, data);
    } else {
      await createPig(data);
    }

    setIsModalOpen(false);
    fetchPigs();
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
        <h1 className="text-lg font-extrabold uppercase">
          Quản lý đàn lợn
        </h1>

        <div className="flex gap-2">
          <button
            onClick={fetchPigs}
            className="px-4 py-2 bg-white rounded-xl text-xs flex items-center gap-2"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
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

      {/* TABLE */}
      <div className="bg-white rounded-xl overflow-hidden">
        <PigTable
          pigs={filteredPigs}
          loading={loading}
          onView={() => {}}
          onEdit={(pig) => {
            setEditingPig(pig);

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

      {/* FORM MODAL */}
      <PigFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        editingPig={editingPig}
        formData={formData}
        setFormData={setFormData}
      />

      {/* CONFIRM MODAL */}
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