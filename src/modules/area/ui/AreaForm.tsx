import React, { useState } from 'react';
import { areaService } from '../api/area.service';
import { CreateAreaRequest } from '../model/area.model';

interface AreaFormProps {
  onSuccess?: () => void;
}

export const AreaForm: React.FC<AreaFormProps> = ({ onSuccess }) => {
  const [form, setForm] = useState<CreateAreaRequest>({name: '', description: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await areaService.create(form);
      setForm({ name: '', description: '' });
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err?.message || 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-xs font-bold mb-1">Tên khu vực</label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border rounded"
        />
      </div>
      <div>
        <label className="block text-xs font-bold mb-1">Mô tả</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded"
        />
      </div>
      {error && <div className="text-red-500 text-xs">{error}</div>}
      <button
        type="submit"
        className="px-4 py-2 bg-emerald-600 text-white rounded font-bold"
        disabled={loading}
      >
        {loading ? 'Đang lưu...' : 'Thêm khu vực'}
      </button>
    </form>
  );
};
