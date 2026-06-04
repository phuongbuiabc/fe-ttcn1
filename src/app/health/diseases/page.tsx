'use client';

import React, { useEffect, useState } from 'react';
import { PlusCircle, RefreshCw } from 'lucide-react';

import { useDisease } from '@/modules/disease/hooks/useDisease';
import { usePig } from '@/modules/pig/hooks/usePig';

import { DiseaseTable } from '@/modules/disease/ui/DiseaseTable';
import { DiseaseFormCreate } from '@/modules/disease/ui/DiseaseFormCreate';
import { DiseaseFormUpdate } from '@/modules/disease/ui/DiseaseFormUpdate';

import { DiseaseHistoryTable } from '@/modules/diseasehistory/ui/DiseaseHistoryTable';
import { DiseaseHistoryCreateForm } from '@/modules/diseasehistory/ui/DiseaseHistoryCreateForm';

import { useDiseaseHistory } from '@/modules/diseasehistory/hooks/useDiseasehistory';

import { usePathname } from 'next/navigation';
import { getPageTitle } from '@/shared/utils/getPageTitle';
import { useAuth } from '@/shared/components/AuthProvider';

import {
  DiseaseResponse,
  CreateDiseaseRequest,
  UpdateDiseaseRequest,
} from '@/modules/disease/model/disease.model';

import { CreateDiseaseHistoryRequest } from '@/modules/diseasehistory/model/diseasehistory.model';
import { DiseaseHistoryStatus } from '@/shared/enums/diseasehistory.enum';

export default function DiseasePage() {
  const { user } = useAuth();

  const {
    diseases,
    loading,
    fetchDiseases,
    createDisease,
    updateDisease,
    deleteDisease,
  } = useDisease();

  const {
    data: diseaseHistories,
    loading: loadingHistories,
    fetchAll: fetchDiseaseHistories,
    create: createDiseaseHistory,
  } = useDiseaseHistory();

  const { pigs, fetchPigs } = usePig();

  const pathname = usePathname();
  const title = getPageTitle(pathname);

  const [activeTab, setActiveTab] =
    useState<'DISEASE' | 'HISTORY'>('DISEASE');

  const [isCreateDiseaseOpen, setIsCreateDiseaseOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [isCreateHistoryOpen, setIsCreateHistoryOpen] = useState(false);

  const [selected, setSelected] = useState<DiseaseResponse | null>(null);

  const [createForm, setCreateForm] = useState<CreateDiseaseRequest>({
    name: '',
    diseaseType: '',
    symptoms: '',
  });

  const [updateForm, setUpdateForm] = useState<UpdateDiseaseRequest>({});

  useEffect(() => {
    if (user) {
      fetchDiseases();
      fetchDiseaseHistories();
      fetchPigs();
    }
  }, [user, fetchDiseases, fetchDiseaseHistories, fetchPigs]);

  const handleCreate = async (data: CreateDiseaseRequest) => {
    await createDisease(data);
    setIsCreateDiseaseOpen(false);
    setCreateForm({ name: '', diseaseType: '', symptoms: '' });
  };

  const handleUpdate = async (id: string, data: UpdateDiseaseRequest) => {
    await updateDisease(id, data);
    setIsUpdateOpen(false);
  };

  const handleCreateHistory = async (data: CreateDiseaseHistoryRequest) => {
    await createDiseaseHistory({
      ...data,
      status: data.status || DiseaseHistoryStatus.FOLLOWING,
    });

    setIsCreateHistoryOpen(false);
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
        <h1 className="font-bold uppercase">{title}</h1>

        <div className="flex gap-2">
          <button
            onClick={fetchDiseases}
            className="px-3 py-1 bg-white rounded flex items-center gap-2"
          >
            <RefreshCw
              size={14}
              className={loading ? 'animate-spin' : ''}
            />
            Làm mới
          </button>

          <button
            onClick={() => setIsCreateHistoryOpen(true)}
            className="px-4 py-1 bg-emerald-600 text-white rounded flex items-center gap-2"
          >
            <PlusCircle size={14} />
            Ghi nhận bệnh
          </button>
        </div>
      </div>

      {/* TABS */}
      <div className="flex gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('HISTORY')}
          className={`px-4 py-2 text-sm font-semibold border-b-2 ${
            activeTab === 'HISTORY'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500'
          }`}
        >
          Lịch sử bệnh
        </button>

        <button
          onClick={() => setActiveTab('DISEASE')}
          className={`px-4 py-2 text-sm font-semibold border-b-2 ${
            activeTab === 'DISEASE'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500'
          }`}
        >
          Danh mục bệnh
        </button>
      </div>

      {/* TABLE */}
      {activeTab === 'DISEASE' ? (
        <DiseaseTable
          diseases={diseases}
          loading={loading}
          onEdit={handleEdit}
          onDelete={deleteDisease}
          onCreate={() => setIsCreateDiseaseOpen(true)}
        />
      ) : (
        <DiseaseHistoryTable
          diseaseHistories={diseaseHistories}
          loading={loadingHistories}
        />
      )}

      {/* CREATE DISEASE */}
      <DiseaseFormCreate
        isOpen={isCreateDiseaseOpen}
        onClose={() => setIsCreateDiseaseOpen(false)}
        onSave={handleCreate}
        formData={createForm}
        setFormData={setCreateForm}
        loading={loading}
      />

      {/* UPDATE DISEASE */}
      <DiseaseFormUpdate
        isOpen={isUpdateOpen}
        onClose={() => setIsUpdateOpen(false)}
        onSave={handleUpdate}
        disease={selected}
        formData={updateForm}
        setFormData={setUpdateForm}
      />

      {/* CREATE HISTORY */}
      <DiseaseHistoryCreateForm
        open={isCreateHistoryOpen}
        onClose={() => setIsCreateHistoryOpen(false)}
        pigs={pigs}
        diseases={diseases}
        onSave={handleCreateHistory}
      />
    </div>
  );
}