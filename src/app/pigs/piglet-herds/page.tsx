'use client';

import React, { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';

import { PigletHerdTable } from '@/modules/pigletherds/ui/PigletHerdTable';
import { PigletHerdForm } from '@/modules/pigletherds/ui/PigletHerdForm';
import { usePigletHerd } from '@/modules/pigletherds/hooks/usePigletherd';

export default function PigletHerdPage() {
  const {
    herds,
    loading,
    fetchHerds,
    createHerd,
    updateHerd,
    deleteHerd
  } = usePigletHerd();

  const [openForm, setOpenForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);

  useEffect(() => {
    fetchHerds();
  }, [fetchHerds]);

  const handleCreate = async (form: any) => {
    await createHerd(form);
    setOpenForm(false);
    fetchHerds();
  };

  const handleUpdate = async (form: any) => {
    await updateHerd(editing.id, form);
    setEditing(null);
    setOpenForm(false);
    fetchHerds();
  };

  const remove = async (id: string) => {
    await deleteHerd(id);
    fetchHerds();
  };

  return (
    <div className="space-y-4 p-4">

      {/* HEADER */}
      <div className="flex justify-between">
        <h1 className="font-bold text-lg">Quản lý đàn con</h1>

        <button
          onClick={() => {
            setEditing(null);
            setOpenForm(true);
          }}
          className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded"
        >
          <Plus size={14} /> Thêm
        </button>
      </div>

      {/* TABLE */}
      <PigletHerdTable
        data={herds}
        loading={loading}
        onView={(item) => console.log(item)}
        onEdit={(item) => {
          setEditing(item);
          setOpenForm(true);
        }}
        onDelete={remove}
      />

      {/* FORM MODAL SIMPLE */}
      {openForm && (
        <div className="fixed inset-0 bg-black/30 flex justify-center items-center">
          <div className="bg-white rounded-xl w-[400px]">
            <PigletHerdForm
              initialData={editing}
              onSubmit={editing ? handleUpdate : handleCreate}
            />
          </div>
        </div>
      )}
    </div>
  );
}