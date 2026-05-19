import { AlertTriangle, User, Calendar, Tag, Trash2 } from 'lucide-react';
import { motion } from 'motion/react';
import { SupplyLoss } from '../model/inventory.model';
import { useAuth } from '@/shared/components/AuthProvider';

interface LossTableProps {
  losses: SupplyLoss[];
  employees: any[];
  loading: boolean;
  onView: (loss: SupplyLoss) => void;
  onVoid: (loss: SupplyLoss) => void;
}

export function LossTable({ losses, employees, loading, onView, onVoid }: LossTableProps) {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN' || user?.role === 'OWNER';
  if (loading) {
    return (
      <div className="py-20 text-center font-black text-slate-400 uppercase tracking-widest">
        Đang tải lịch sử...
      </div>
    );
  }

  if (losses.length === 0) {
    return (
      <div className="py-20 text-center">
        <AlertTriangle size={48} className="mx-auto text-slate-200 mb-4" />
        <p className="font-black text-slate-400 uppercase tracking-widest text-sm">Chưa có dữ liệu hao hụt</p>
      </div>
    );
  }

  return (
    <div className="responsive-table">
      <table className="w-full text-left">
        <thead className="bg-slate-50/50">
          <tr>
            <th className="px-6 py-4 text-[10px] font-black text-slate-900 uppercase tracking-widest leading-none">Vật tư / Mã phiếu</th>
            <th className="px-6 py-4 text-[10px] font-black text-slate-900 uppercase tracking-widest leading-none">Thời gian</th>
            <th className="px-6 py-4 text-[10px] font-black text-slate-900 uppercase tracking-widest leading-none">Nhân viên</th>
            <th className="px-6 py-4 text-[10px] font-black text-slate-900 uppercase tracking-widest leading-none text-center">Số lượng</th>
            <th className="px-6 py-4 text-[10px] font-black text-slate-900 uppercase tracking-widest leading-none">Lý do</th>
            <th className="px-6 py-4 text-[10px] font-black text-slate-900 uppercase tracking-widest leading-none text-right">Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {losses.map((loss, i) => (
            <motion.tr 
              key={loss.id} 
              initial={{ opacity: 0, x: -10 }} 
              animate={{ opacity: 1, x: 0 }} 
              transition={{ delay: i * 0.04 }} 
              onClick={() => onView(loss)}
              className="hover:bg-slate-50/80 transition-all group cursor-pointer"
            >
              <td className="px-6 py-5">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center font-black text-[10px] shadow-sm">
                    LOSS
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-slate-800 leading-none">{loss.supply_id}</p>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Mã: {loss.loss_id?.slice(0, 8)}</p>
                  </div>
                </div>
              </td>
              <td className="px-6 py-5 text-center">
                <div className="flex items-center justify-center gap-2 text-slate-400">
                  <Calendar size={13} />
                  <span className="text-xs font-bold text-slate-600">
                    {new Date(loss.date).toLocaleDateString('vi-VN')}
                  </span>
                </div>
              </td>
              <td className="px-6 py-5">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                    <User size={12} />
                  </div>
                  <span className="text-xs font-bold text-slate-600 uppercase tracking-tight">
                    {employees.find(e => e.id === loss.employee_id)?.fullName || "N/A"}
                  </span>
                </div>
              </td>
              <td className="px-6 py-5 text-center">
                <span className="px-3 py-1.5 bg-rose-50 text-rose-500 text-[11px] font-black rounded-xl border border-rose-100/50">
                  -{loss.quantity.toLocaleString()}
                </span>
              </td>
              <td className="px-6 py-5">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-rose-400" />
                  <span className="text-xs font-bold text-slate-600">{loss.reason}</span>
                </div>
              </td>
              <td className="px-6 py-4 text-right">
                {isAdmin && (
                  <button 
                    onClick={(e) => { e.stopPropagation(); onVoid(loss); }}
                    className="p-2 text-slate-300 hover:text-rose-500 transition-all active:scale-90"
                    title="Hủy phiếu & Hoàn kho"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
