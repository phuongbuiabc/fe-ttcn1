'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { Plus, Search } from 'lucide-react';

import { AreaTable } from '@/modules/area/ui/AreaTable';
import { AreaCreateForm } from '@/modules/area/ui/AreaCreateForm';

import { useArea } from '@/modules/area/hooks/useArea';
import { AreaResponse, CreateAreaRequest } from '@/modules/area/model/area.model';

import { getPageTitle } from '@/shared/utils/getPageTitle';
import { usePathname } from 'next/navigation';



export default function AreaPage() {
  const {
    areas,
    loading,
    fetchAreas,
    createArea,
    updateArea,
    deleteArea,
  } = useArea();

  const [search, setSearch] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState<AreaResponse | null>(null);

  useEffect(() => {
    fetchAreas();
  }, [fetchAreas]);
  
    const pathname = usePathname();
    const title = getPageTitle(pathname);

  const filtered = useMemo(() => {
    return areas.filter(a =>
      a.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [areas, search]);

  const handleSubmit = async (data: CreateAreaRequest) => {
    if (editing) {
      await updateArea(editing.id, data);
    } else {
      await createArea(data);
    }

    setIsOpen(false);
    setEditing(null);
  };

  return (
    <div className="space-y-4 p-4">

      {/* HEADER */}
      <div className="flex justify-between">
        <h1 className="text-lg font-extrabold uppercase">{title}</h1>

        <button
          onClick={() => {
            setEditing(null);
            setIsOpen(true);
          }}
          className="px-4 py-2 bg-emerald-600 text-white rounded flex gap-2"
        >
          <Plus size={14} /> Thêm
        </button>
      </div>

      {/* SEARCH */}
      <div className="bg-white p-3 rounded">
        <div className="relative max-w-xs">
          <Search size={14} className="absolute left-2 top-2" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm khu vực..."
            className="pl-7 pr-3 py-2 bg-gray-50 rounded w-full"
          />
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded">
        <AreaTable
          areas={filtered}
          loading={loading}
          onView={(a) => console.log(a)}
          onEdit={(a) => {
            setEditing(a);
            setIsOpen(true);
          }}
          onDelete={deleteArea}
        />
      </div>

      {/* FORM */}
      <AreaCreateForm
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSubmit={handleSubmit}
        initialData={editing || undefined}
      />
    </div>
  );
}