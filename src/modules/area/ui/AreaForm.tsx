import { Area } from '../api/area.service';

export interface AreaFormProps {
  formData: Partial<Area>;
  setFormData: (data: Partial<Area>) => void;
}

export function AreaForm({ formData, setFormData }: AreaFormProps) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-bold mb-1">Mã khu chuồng <span className="text-red-500">*</span></label>
        <input
          type="text"
          required
          value={formData.areaCode || ''}
          onChange={e => setFormData({ ...formData, areaCode: e.target.value })}
          className="w-full px-4 py-2 border rounded"
        />
      </div>
      <div>
        <label className="block text-xs font-bold mb-1">Tên khu chuồng <span className="text-red-500">*</span></label>
        <input
          type="text"
          required
          value={formData.name || ''}
          onChange={e => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-4 py-2 border rounded"
        />
      </div>
      <div>
        <label className="block text-xs font-bold mb-1">Mô tả</label>
        <textarea
          value={formData.description || ''}
          onChange={e => setFormData({ ...formData, description: e.target.value })}
          className="w-full px-4 py-2 border rounded"
        />
      </div>
    </div>
  );
}
