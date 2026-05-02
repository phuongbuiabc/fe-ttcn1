"use client";

import React, { useEffect } from "react";
import { Eye, Edit, Trash2 } from "lucide-react";
import useSemen from "@/modules/semen/hooks/useSemen";

export const SemenTable: React.FC = () => {
  const { semens, loading, fetchSemens, deleteSemen } = useSemen();

  useEffect(() => {
    fetchSemens();
  }, [fetchSemens]);

  const handleDelete = async (id: string) => {
    if (!confirm("Xác nhận xóa mẫu nọc?")) return;
    try {
      await deleteSemen(id);
    } catch (err) {
      console.error(err);
      alert("Xóa thất bại");
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="animate-spin w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-slate-500 font-bold">Đang tải danh sách nọc...</p>
      </div>
    );
  }

  if (semens.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="text-slate-500 font-bold">Không có mẫu nọc.</p>
      </div>
    );
  }

  return (
    <div className="responsive-table">
      <table className="w-full text-left border-collapse">
        <thead className="bg-slate-50/50">
          <tr>
            <th className="px-4 py-3 text-[9px] uppercase tracking-widest font-black text-slate-900">Mã</th>
            <th className="px-4 py-3 text-[9px] uppercase tracking-widest font-black text-slate-900">Lợn đực</th>
            <th className="px-4 py-3 text-[9px] uppercase tracking-widest font-black text-slate-900">Giống</th>
            <th className="px-4 py-3 text-[9px] uppercase tracking-widest font-black text-slate-900">Ngày thu</th>
            <th className="px-4 py-3 text-[9px] uppercase tracking-widest font-black text-slate-900">Thể tích (ml)</th>
            <th className="px-4 py-3 text-[9px] uppercase tracking-widest font-black text-slate-900">Độ di động (%)</th>
            <th className="px-4 py-3 text-[9px] uppercase tracking-widest font-black text-slate-900">Chất lượng</th>
            <th className="px-4 py-3 text-right text-[9px] uppercase tracking-widest font-black text-slate-900">Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {semens.map((s) => (
            <tr key={s.id} className="hover:bg-slate-50 transition-all">
              <td className="px-4 py-3 font-black text-emerald-600 text-[11px]">{s.id}</td>
              <td className="px-4 py-3 text-[11px]">{s.boarPigEarTag || s.boarPigId}</td>
              <td className="px-4 py-3 text-[11px]">{s.boarBreed}</td>
              <td className="px-4 py-3 text-[11px]">{s.collectionDate}</td>
              <td className="px-4 py-3 text-[11px]">{s.volume ?? '-'}</td>
              <td className="px-4 py-3 text-[11px]">{s.motility ?? '-'}</td>
              <td className="px-4 py-3 text-[11px]">{s.quality ?? '-'}</td>
              <td className="px-4 py-3 text-right">
                <div className="flex justify-end gap-1.5">
                  <button className="p-1.5 text-slate-400 hover:text-emerald-600" title="Xem">
                    <Eye size={14} />
                  </button>
                  <button className="p-1.5 text-slate-400 hover:text-blue-600" title="Sửa">
                    <Edit size={14} />
                  </button>
                  <button onClick={() => handleDelete(s.id)} className="p-1.5 text-slate-400 hover:text-rose-600" title="Xóa">
                    <Trash2 size={14} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SemenTable;
