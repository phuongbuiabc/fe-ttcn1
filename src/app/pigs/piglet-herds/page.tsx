'use client';

import React, { useEffect, useState } from 'react';
import { PlusCircle } from 'lucide-react';

import { PigletHerdTable } from '@/modules/pigletherds/ui/PigletHerdTable';
import { PigletHerdForm } from '@/modules/pigletherds/ui/PigletHerdForm';
import { PigletHerdDetail } from '@/modules/pigletherds/ui/PigletHerdDetail';
import { usePigletHerd } from '@/modules/pigletherds/hooks/usePigletherd';

export default function PigletHerdPage() {
  const {
    herds,
    herdDetail,
    loading,
    loadingDetail,
    fetchHerds,
    fetchHerdDetail,
    createHerd,
    updateHerd,
    deleteHerd
  } = usePigletHerd();

  const [isDetailMode, setIsDetailMode] = useState(false);
  const [selectedHerdId, setSelectedHerdId] = useState<string | null>(null);

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
    const confirmed = window.confirm('Bạn có chắc muốn xóa đàn con này không?');
    if (!confirmed) return;

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
          className="px-5 py-2 bg-emerald-600 text-white rounded-full flex items-center gap-2"
        >
          <PlusCircle size={14} /> Thêm đàn
        </button>
      </div>

      <div className={`grid gap-4 ${isDetailMode ? 'grid-cols-1 lg:grid-cols-10' : 'grid-cols-1'}`}>
        <div className={isDetailMode ? 'bg-white rounded-xl overflow-hidden lg:col-span-6' : 'bg-white rounded-xl overflow-hidden'}>
          <PigletHerdTable
            data={herds}
            loading={loading}
            onView={async (item) => {
              if (item.id === selectedHerdId && isDetailMode) return;

              setSelectedHerdId(item.id);
              setIsDetailMode(true);

              await fetchHerdDetail(item.id);
            }}
            onEdit={(item) => {
              setEditing(item);
              setOpenForm(true);
            }}
            onDelete={remove}
          />
        </div>

        {isDetailMode && (
          <div className="bg-white rounded-xl p-4 overflow-y-auto max-h-[80vh] lg:col-span-4">
            <PigletHerdDetail
              data={herdDetail}
              loading={loadingDetail}
              onClose={() => setIsDetailMode(false)}
            />
          </div>
        )}
      </div>

      {/* FORM MODAL SIMPLE */}
      {openForm && (
        <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl w-[400px] shadow-xl overflow-hidden max-h-[90vh] overflow-y-auto">
            <PigletHerdForm
              initialData={editing}
              onSubmit={editing ? handleUpdate : handleCreate}
              onClose={() => {
                setOpenForm(false);
                setEditing(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
