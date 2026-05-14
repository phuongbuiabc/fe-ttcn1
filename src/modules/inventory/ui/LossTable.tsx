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
              key={i} 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: i * 0.05 }} 
              onClick={() => onView(loss)}
              className="hover:bg-slate-50 transition-all cursor-pointer group"
            >
              <td className="px-6 py-4">
                <div>
                  <p className="text-sm font-black text-slate-800 leading-none mb-1">{loss.supply_id}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">#{loss.loss_id || 'ISSUE-'+i}</p>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2 text-slate-500">
                  <Calendar size={14} />
                  <span className="text-xs font-bold">{loss.date}</span>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2 text-slate-500">
                  <User size={14} />
                  <span className="text-xs font-bold uppercase">
                    {employees.find(e => e.id === loss.employee_id)?.fullName || loss.employee_id}
                  </span>
                </div>
              </td>
              <td className="px-6 py-4 text-center">
                <span className="px-3 py-1 bg-rose-50 text-rose-500 text-xs font-black rounded-lg">
                  -{loss.quantity}
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <Tag size={12} className="text-slate-400" />
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
