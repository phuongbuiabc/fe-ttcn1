'use client';

import React, { useEffect, useState } from 'react';
import { PlusCircle, RefreshCw } from 'lucide-react';

import { useBreed } from '@/modules/breed/hooks/useBreed';
import { BreedTable } from '@/modules/breed/ui/BreedTable';
import { CreateBreedRequest } from '@/modules/breed/model/breed.model';
import { BreedFormModal } from '@/modules/breed/ui/BreedFormCreate';

export default function BreedPage() {
  const {
    breeds,
    loading,
    fetchBreeds,
    createBreed,
  } = useBreed();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState<CreateBreedRequest>({
    name: '',
    characteristics: '',
  });

  useEffect(() => {
    fetchBreeds();
  }, [fetchBreeds]);

  const handleCreate = async (data: CreateBreedRequest) => {
    await createBreed(data);
    setIsModalOpen(false);
    setFormData({ name: '', characteristics: '' });
  };

  return (
    <div className="space-y-4 pb-20 bg-[#fbfcfd] min-h-screen -m-4 p-4">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-extrabold uppercase">
          Danh mục giống
        </h1>

        <div className="flex gap-2">

          <button
            onClick={fetchBreeds}
            className="px-4 py-2 bg-white rounded-xl text-xs flex items-center gap-2"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            Làm mới
          </button>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-5 py-2 bg-emerald-600 text-white rounded-full flex items-center gap-2"
          >
            <PlusCircle size={14} />
            Thêm giống
          </button>

        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl overflow-hidden">
        <BreedTable breeds={breeds} />
      </div>

      {/* MODAL */}
      <BreedFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleCreate}
        formData={formData}
        setFormData={setFormData}
        loading={loading}
      />

    </div>
  );
}