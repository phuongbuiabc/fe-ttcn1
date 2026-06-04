'use client';

import React, { useEffect, useState } from 'react';
import { PlusCircle } from 'lucide-react';

import { PigletHerdTable } from '@/modules/pigletherds/ui/PigletHerdTable';
import { PigletHerdForm } from '@/modules/pigletherds/ui/PigletHerdForm';
import { PigletHerdDetail } from '@/modules/pigletherds/ui/PigletHerdDetail';
import { SplitForm } from '@/modules/pigletherds/ui/SplitForm';
import TransferPigletHerdForm from '@/modules/pigletherds/ui/TransferForm';

import { usePigletHerd } from '@/modules/pigletherds/hooks/usePigletherd';
import { PigletHerdResponse } from '@/modules/pigletherds/model/pigletherd.model';

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
    deleteHerd,
  } = usePigletHerd();

   const [isDetailMode, setIsDetailMode] = useState(false);
   const [selectedHerdId, setSelectedHerdId] = useState<string | null>(null);

   const [openForm, setOpenForm] = useState(false);
   const [editing, setEditing] = useState<any>(null);

   const [splitOpen, setSplitOpen] = useState(false);
   const [splitItem, setSplitItem] = useState<PigletHerdResponse | null>(null);

   const [transferOpen, setTransferOpen] = useState(false);
   const [transferHerd, setTransferHerd] = useState<PigletHerdResponse | null>(null);

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

  const handleSplit = (item: PigletHerdResponse) => {
    setSplitItem(item);
    setSplitOpen(true);
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

      {/* TABLE + DETAIL */}
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
             onTransfer={(item) => {
               setTransferHerd(item);
               setTransferOpen(true);
             }}
             onDelete={remove}
             onSplit={handleSplit}
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

      {/* CREATE / EDIT FORM */}
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

       {/* SPLIT FORM */}
       {splitOpen && splitItem && (
         <SplitForm
           isOpen={splitOpen}
           sourceHerdId={splitItem.id}
           onClose={() => {
             setSplitOpen(false);
             setSplitItem(null);
           }}
           onSave={async (data) => {
             console.log('Split payload:', data);

             setSplitOpen(false);
             setSplitItem(null);
             await fetchHerds();
           }}
         />
       )}

       {/* TRANSFER FORM */}
       {transferOpen && transferHerd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-xl overflow-hidden">
            <TransferPigletHerdForm
              herdId={transferHerd.id}
              currentPenId={transferHerd.penId}
              onSuccess={() => {
                setTransferOpen(false);
                setTransferHerd(null);
                fetchHerds();
              }}
              onClose={() => {
                setTransferOpen(false);
                setTransferHerd(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}