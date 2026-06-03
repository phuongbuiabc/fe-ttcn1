'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { X } from 'lucide-react';
import { usePig } from '@/modules/pig/hooks/usePig';
import { usePen } from '@/modules/pens/hooks/usePen';
import { PigResponse } from '@/modules/pig/model/pig.model';
import {
  CreatePigletHerdRequest,
  UpdatePigletHerdRequest,
  PigletHerdResponse,
} from '../model/pigletherd.model';
import { PigletHerdStatus } from '@/shared/enums/pigletherd.enum';

interface Props {
  initialData?: PigletHerdResponse | null;
  onSubmit: (data: CreatePigletHerdRequest | UpdatePigletHerdRequest) => void;
  onClose?: () => void;
  loading?: boolean;
}

type HerdFormState = CreatePigletHerdRequest;

const emptyForm: HerdFormState = {
  herdName: '',
  litterNumber: 0,
  penId: '',
  motherId: '',
  motherEarTag: '',
  motherBreed: '',
  fatherId: '',
  fatherEarTag: '',
  fatherBreed: '',
  quantity: 0,
  genderNote: '',
  averageBirthWeight: 0,
  birthDate: '',
  semenId: '',
  status: PigletHerdStatus.UNWEANED,
  isSold: false,
};

const statusOptions = [
  { label: 'Theo mẹ', value: PigletHerdStatus.UNWEANED },
  { label: 'Cai sữa', value: PigletHerdStatus.WEANED },
];

export function PigletHerdForm({
  initialData,
  onSubmit,
  onClose,
  loading,
}: Props) {
  const { pigs, fetchPigs } = usePig();
  const { pens, fetchPens } = usePen();

  const [form, setForm] = useState<HerdFormState>(emptyForm);
  const [motherEarTagInput, setMotherEarTagInput] = useState('');
  const [fatherEarTagInput, setFatherEarTagInput] = useState('');
  const [activeSuggestionField, setActiveSuggestionField] = useState<
    'mother' | 'father' | null
  >(null);

  useEffect(() => {
    fetchPigs();
    fetchPens();
  }, [fetchPigs, fetchPens]);

  const pigById = useMemo(() => {
    const map: Record<string, PigResponse> = {};
    pigs.forEach((pig) => {
      map[pig.id] = pig;
    });
    return map;
  }, [pigs]);

  const resolvePigByEarTag = (earTag: string) => {
    const normalized = earTag.trim().toLowerCase();
    if (!normalized) return null;

    return (
      pigs.find(
        (pig) => (pig.earTag || '').trim().toLowerCase() === normalized
      ) || null
    );
  };

  const getSuggestions = (keyword: string) => {
    const normalized = keyword.trim().toLowerCase();
    const source = pigs.filter((pig) => !!pig.earTag?.trim());
    if (!normalized) return source.slice(0, 8);

    return source
      .filter((pig) =>
        (pig.earTag || '').toLowerCase().includes(normalized)
      )
      .slice(0, 8);
  };

  useEffect(() => {
    if (!initialData) {
      setForm(emptyForm);
      setMotherEarTagInput('');
      setFatherEarTagInput('');
      return;
    }

    setForm({
      herdName: initialData.herdName || '',
      litterNumber: initialData.litterNumber ?? 0,
      penId: initialData.penId || '',
      motherId: initialData.motherId || '',
      motherEarTag: initialData.motherEarTag || '',
      motherBreed: initialData.motherBreed || '',
      fatherId: initialData.fatherId || '',
      fatherEarTag: initialData.fatherEarTag || '',
      fatherBreed: initialData.fatherBreed || '',
      quantity: initialData.quantity ?? 0,
      genderNote: initialData.genderNote || '',
      averageBirthWeight: initialData.averageBirthWeight ?? 0,
      birthDate: initialData.birthDate || '',
      semenId: initialData.semenId || '',
      status: initialData.status || PigletHerdStatus.UNWEANED,
      isSold: initialData.isSold ?? false,
    });

    const motherPig = initialData.motherId
      ? pigById[initialData.motherId]
      : null;
    const fatherPig = initialData.fatherId
      ? pigById[initialData.fatherId]
      : null;

    setMotherEarTagInput(
      initialData.motherEarTag || motherPig?.earTag || ''
    );
    setFatherEarTagInput(
      initialData.fatherEarTag || fatherPig?.earTag || ''
    );
  }, [initialData, pigById]);

  const handleChange = (key: keyof HerdFormState, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const applyMotherSelection = (pig: PigResponse) => {
    setMotherEarTagInput(pig.earTag || '');
    setForm((prev) => ({
      ...prev,
      motherId: pig.id,
      motherEarTag: pig.earTag || '',
      motherBreed: pig.breedName || pig.species || '',
    }));
    setActiveSuggestionField(null);
  };

  const applyFatherSelection = (pig: PigResponse) => {
    setFatherEarTagInput(pig.earTag || '');
    setForm((prev) => ({
      ...prev,
      fatherId: pig.id,
      fatherEarTag: pig.earTag || '',
      fatherBreed: pig.breedName || pig.species || '',
    }));
    setActiveSuggestionField(null);
  };

  const handleMotherChange = (value: string) => {
    setMotherEarTagInput(value);
    const matched = resolvePigByEarTag(value);

    setForm((prev) => ({
      ...prev,
      motherId: matched?.id || '',
      motherEarTag: value,
      motherBreed: matched?.breedName || matched?.species || '',
    }));
  };

  const handleFatherChange = (value: string) => {
    setFatherEarTagInput(value);
    const matched = resolvePigByEarTag(value);

    setForm((prev) => ({
      ...prev,
      fatherId: matched?.id || '',
      fatherEarTag: value,
      fatherBreed: matched?.breedName || matched?.species || '',
    }));
  };

  const handleSubmit = () => {
    const mother = resolvePigByEarTag(motherEarTagInput);
    const father = resolvePigByEarTag(fatherEarTagInput);

    onSubmit({
      ...form,
      motherId: mother?.id || form.motherId || undefined,
      motherEarTag:
        mother?.earTag || form.motherEarTag || motherEarTagInput || undefined,
      motherBreed:
        mother?.breedName || mother?.species || form.motherBreed || undefined,
      fatherId: father?.id || form.fatherId || undefined,
      fatherEarTag:
        father?.earTag || form.fatherEarTag || fatherEarTagInput || undefined,
      fatherBreed:
        father?.breedName || father?.species || form.fatherBreed || undefined,
    });
  };

  const Field = ({
    label,
    children,
  }: {
    label: string;
    children: React.ReactNode;
  }) => (
    <div className="space-y-1">
      <label className="text-xs font-semibold text-gray-500 uppercase">
        {label}
      </label>
      {children}
    </div>
  );

  const renderPigSuggestions = (
    field: 'mother' | 'father',
    keyword: string
  ) => {
    const suggestions = getSuggestions(keyword);
    if (activeSuggestionField !== field || suggestions.length === 0)
      return null;

    return (
      <div className="absolute z-50 mt-1 w-full max-h-48 overflow-y-auto rounded-xl border border-slate-100 bg-white shadow-lg">
        {suggestions.map((pig) => (
          <button
            key={pig.id}
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              field === 'mother'
                ? applyMotherSelection(pig)
                : applyFatherSelection(pig);
            }}
            className="block w-full px-3 py-2 text-left text-sm hover:bg-slate-50"
          >
            <span className="font-semibold text-slate-800">
              {pig.earTag}
            </span>
            <span className="ml-2 text-xs text-slate-400">
              ({pig.id})
            </span>
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center justify-between gap-3 pb-2">
        <h3 className="text-sm font-bold uppercase text-slate-800">
          {initialData ? 'Sửa đàn con' : 'Thêm đàn con'}
        </h3>

        <button
          type="button"
          onClick={onClose}
          className="p-2 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700"
        >
          <X size={16} />
        </button>
      </div>

      <Field label="Tên đàn">
        <input
          value={form.herdName}
          onChange={(e) =>
            handleChange('herdName', e.target.value)
          }
          className="w-full bg-slate-100 px-3 py-2 rounded outline-none"
        />
      </Field>

      <Field label="Số lứa">
        <input
          type="number"
          value={form.litterNumber}
          onChange={(e) =>
            handleChange('litterNumber', Number(e.target.value))
          }
          className="w-full bg-slate-100 px-3 py-2 rounded outline-none"
        />
      </Field>

      {/* PEN SELECT */}
      <Field label="Chuồng nuôi">
        <select
          value={form.penId || ''}
          onChange={(e) =>
            handleChange('penId', e.target.value)
          }
          className="w-full bg-slate-100 px-3 py-2 rounded outline-none"
        >
          <option value="">-- Chọn chuồng --</option>
          {pens.map((pen) => (
            <option key={pen.id} value={pen.id}>
              {pen.name}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Số tai lợn mẹ">
        <div className="relative">
          <input
            value={motherEarTagInput}
            onChange={(e) => {
              handleMotherChange(e.target.value);
              setActiveSuggestionField('mother');
            }}
            onFocus={() => setActiveSuggestionField('mother')}
            onBlur={() =>
              setTimeout(() => setActiveSuggestionField(null), 120)
            }
            className="w-full bg-slate-100 px-3 py-2 rounded outline-none"
          />
          {renderPigSuggestions('mother', motherEarTagInput)}
        </div>
      </Field>

      <Field label="Số tai lợn bố">
        <div className="relative">
          <input
            value={fatherEarTagInput}
            onChange={(e) => {
              handleFatherChange(e.target.value);
              setActiveSuggestionField('father');
            }}
            onFocus={() => setActiveSuggestionField('father')}
            onBlur={() =>
              setTimeout(() => setActiveSuggestionField(null), 120)
            }
            className="w-full bg-slate-100 px-3 py-2 rounded outline-none"
          />
          {renderPigSuggestions('father', fatherEarTagInput)}
        </div>
      </Field>

      <Field label="Mã giống mẹ">
        <input
          value={form.motherBreed || ''}
          readOnly
          className="w-full bg-slate-50 px-3 py-2 rounded outline-none text-slate-500"
        />
      </Field>

      <Field label="Mã giống bố">
        <input
          value={form.fatherBreed || ''}
          readOnly
          className="w-full bg-slate-50 px-3 py-2 rounded outline-none text-slate-500"
        />
      </Field>

      <Field label="Số lượng con">
        <input
          type="number"
          value={form.quantity}
          onChange={(e) =>
            handleChange('quantity', Number(e.target.value))
          }
          className="w-full bg-slate-100 px-3 py-2 rounded outline-none"
        />
      </Field>

      <Field label="Ghi chú giới tính">
        <input
          value={form.genderNote || ''}
          onChange={(e) =>
            handleChange('genderNote', e.target.value)
          }
          className="w-full bg-slate-100 px-3 py-2 rounded outline-none"
        />
      </Field>

      <Field label="Cân nặng trung bình (kg)">
        <input
          type="number"
          value={form.averageBirthWeight}
          onChange={(e) =>
            handleChange('averageBirthWeight', Number(e.target.value))
          }
          className="w-full bg-slate-100 px-3 py-2 rounded outline-none"
        />
      </Field>

      <Field label="Ngày sinh">
        <input
          type="date"
          value={form.birthDate || ''}
          onChange={(e) =>
            handleChange('birthDate', e.target.value)
          }
          className="w-full bg-slate-100 px-3 py-2 rounded outline-none"
        />
      </Field>

      <Field label="Trạng thái">
        <select
          value={form.status || PigletHerdStatus.UNWEANED}
          onChange={(e) =>
            handleChange(
              'status',
              e.target.value as HerdFormState['status']
            )
          }
          className="w-full bg-slate-100 px-3 py-2 rounded outline-none"
        >
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </Field>

      <label className="flex items-center gap-2 text-sm text-slate-700 pt-1">
        <input
          type="checkbox"
          checked={!!form.isSold}
          onChange={(e) =>
            handleChange('isSold', e.target.checked)
          }
        />
        Đã bán
      </label>

      <div className="flex gap-2 pt-2">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 bg-slate-100 text-slate-700 py-2 rounded font-semibold"
        >
          Hủy
        </button>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="flex-1 bg-emerald-600 text-white py-2 rounded font-semibold disabled:opacity-50"
        >
          {loading ? 'Đang lưu...' : 'Lưu'}
        </button>
      </div>
    </div>
  );
}