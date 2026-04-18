import React, { useState, useEffect } from "react";
import { X, Calendar, Clock, MapPin, User, FileText, Save } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/shared/lib/utils";
import { WorkSchedule, CreateScheduleRequest } from "@/shared/types";
import { scheduleService } from "@/entities/staff/api/schedule.service";

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  schedule?: WorkSchedule | null;
}

export function ScheduleModal({ isOpen, onClose, onSuccess, schedule }: ScheduleModalProps) {
  const [formData, setFormData] = useState<CreateScheduleRequest>({
    employeeCode: "",
    task: "",
    sectionId: "",
    workDate: "",
    shift: 'MORNING',
    status: "NORMAL",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (schedule) {
      setFormData({
        employeeCode: schedule.employeeCode,
        task: schedule.task,
        sectionId: schedule.sectionId,
        workDate: schedule.workDate,
        shift: schedule.shift,
        status: schedule.status,
      });
    } else {
      setFormData({
        employeeCode: "",
        task: "",
        sectionId: "",
        workDate: new Date().toISOString().split('T')[0],
        shift: 'MORNING',
        status: "NORMAL",
      });
    }
  }, [schedule, isOpen]);

  if (!isOpen) return null;

  const isEditing = !!schedule;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEditing && schedule) {
        await scheduleService.updateSchedule(schedule.id, formData);
      } else {
        await scheduleService.createSchedule(formData);
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Failed to save schedule:", error);
      alert("Lưu lịch làm việc thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-white rounded-[3rem] shadow-2xl overflow-hidden"
        >
          <div className="p-10">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h3 className="text-2xl font-bold text-slate-900 font-manrope">
                  {isEditing ? "Chỉnh sửa Lịch làm việc" : "Tạo Lịch làm việc mới"}
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  Thiết lập phân công nhân sự vào các khu vực trang trại.
                </p>
              </div>
              <button 
                onClick={onClose}
                className="p-3 bg-slate-50 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-2xl transition-all"
              >
                <X size={20} />
              </button>
            </div>

            <form className="space-y-8" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Mã nhân viên</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      type="text"
                      required
                      value={formData.employeeCode}
                      onChange={(e) => setFormData({...formData, employeeCode: e.target.value})}
                      placeholder="VD: NV001"
                      className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-emerald-500 transition-all outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Ngày làm việc</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      type="date" 
                      required
                      value={formData.workDate}
                      onChange={(e) => setFormData({...formData, workDate: e.target.value})}
                      className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-emerald-500 transition-all outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Ca làm việc</label>
                  <div className="relative">
                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <select 
                      value={formData.shift}
                      onChange={(e) => setFormData({...formData, shift: e.target.value as any})}
                      className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-emerald-500 transition-all outline-none appearance-none"
                    >
                      <option value="MORNING">Ca Sáng (06:00 - 14:00)</option>
                      <option value="AFTERNOON">Ca Chiều (14:00 - 22:00)</option>
                      <option value="NIGHT">Ca Đêm (22:00 - 06:00)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Khu vực (Section ID)</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      type="text" 
                      required
                      value={formData.sectionId}
                      onChange={(e) => setFormData({...formData, sectionId: e.target.value})}
                      placeholder="VD: AREA_A_01" 
                      className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-emerald-500 transition-all outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Nội dung công việc</label>
                <div className="relative">
                  <FileText className="absolute left-4 top-4 text-slate-400" size={18} />
                  <textarea 
                    required
                    value={formData.task}
                    onChange={(e) => setFormData({...formData, task: e.target.value})}
                    placeholder="Nhập chi tiết công việc cần thực hiện..." 
                    rows={3}
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-emerald-500 transition-all outline-none resize-none"
                  />
                </div>
              </div>

              <div className="pt-6 flex gap-4">
                <button 
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-4 bg-slate-50 text-slate-700 rounded-2xl text-sm font-bold hover:bg-slate-100 transition-all"
                >
                  Hủy bỏ
                </button>
                <button 
                  type="submit"
                  disabled={loading}
                  className="flex-[2] py-4 bg-gradient-to-br from-[#006c49] to-[#10b981] text-white rounded-2xl text-sm font-bold hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Save size={18} />
                      {isEditing ? "Cập nhật" : "Xác nhận tạo"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
