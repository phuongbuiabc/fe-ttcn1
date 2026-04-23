'use client';

import React, { useEffect, useState } from 'react';
import { PlusCircle, RefreshCw } from 'lucide-react';

import { useDisease } from '@/modules/disease/hooks/useDisease';
import { DiseaseTable } from '@/modules/disease/ui/DiseaseTable';
import { DiseaseFormCreate } from '@/modules/disease/ui/DiseaseFormCreate';
import { DiseaseFormUpdate } from '@/modules/disease/ui/DiseaseFormUpdate';

import {
  DiseaseResponse,
  CreateDiseaseRequest,
  UpdateDiseaseRequest,
} from '@/modules/disease/model/disease.model';

export default function DiseasePage() {
  const {
    diseases,
    loading,
    fetchDiseases,
    createDisease,
    updateDisease,
    deleteDisease,
  } = useDisease();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);

  const [selected, setSelected] = useState<DiseaseResponse | null>(null);

  const [createForm, setCreateForm] = useState<CreateDiseaseRequest>({
    name: '',
    diseaseType: '',
    symptoms: '',
  });

  const [updateForm, setUpdateForm] = useState<UpdateDiseaseRequest>({});

  useEffect(() => {
    fetchDiseases();
  }, [fetchDiseases]);

  const handleCreate = async (data: CreateDiseaseRequest) => {
    await createDisease(data);
    setIsCreateOpen(false);
    setCreateForm({ name: '', diseaseType: '', symptoms: '' });
  };

  const handleUpdate = async (id: string, data: UpdateDiseaseRequest) => {
    await updateDisease(id, data);
    setIsUpdateOpen(false);
  };

  const handleEdit = (d: DiseaseResponse) => {
    setSelected(d);
    setUpdateForm({
      name: d.name,
      diseaseType: d.diseaseType,
      symptoms: d.symptoms,
    });
    setIsUpdateOpen(true);
  };

  return (
    <div className="space-y-4 p-4 min-h-screen bg-[#fbfcfd]">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="font-bold uppercase">Danh mục bệnh</h1>

        <div className="flex gap-2">
          <button
            onClick={fetchDiseases}
            className="px-3 py-1 bg-white rounded flex items-center gap-2"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            Làm mới
          </button>

          <button
            onClick={() => setIsCreateOpen(true)}
            className="px-4 py-1 bg-emerald-600 text-white rounded flex items-center gap-2"
          >
            <PlusCircle size={14} />
            Thêm bệnh
          </button>
        </div>
      </div>

      {/* TABLE */}
      <DiseaseTable
        diseases={diseases}
        loading={loading}
        onEdit={handleEdit}
        onDelete={deleteDisease}
      />

      {/* CREATE */}
      <DiseaseFormCreate
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSave={handleCreate}
        formData={createForm}
        setFormData={setCreateForm}
        loading={loading}
      />

      {/* UPDATE */}
      <DiseaseFormUpdate
        isOpen={isUpdateOpen}
        onClose={() => setIsUpdateOpen(false)}
        onSave={handleUpdate}
        disease={selected}
        formData={updateForm}
        setFormData={setUpdateForm}
      />
    </div>
  );
}