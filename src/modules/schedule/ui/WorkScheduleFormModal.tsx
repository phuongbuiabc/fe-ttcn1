"use client";

import React from "react";
import { 
  X, User, MapPin, Calendar, Clock, 
  FileText, CheckCircle2, ChevronDown, Briefcase
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/shared/utils/utils";
import { Employee, WorkSchedule } from "@/shared/types";
import { areaService } from "@/modules/area/api/area.service";
import { staffService } from "@/modules/staff/api/staff.service";

interface WorkScheduleFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  editingSchedule: WorkSchedule | null;
}

export function WorkScheduleFormModal({ 
  isOpen, 
  onClose, 
  onSave, 
  editingSchedule 
}: WorkScheduleFormModalProps) {
  const [employees, setEmployees] = React.useState<Employee[]>([]);
  const [areas, setAreas] = React.useState<any[]>([]);
  const [formData, setFormData] = React.useState({
    employeeId: "",
    workName: "",
    areaId: "",
    shift: "MORNING",
    note: "",
    status: "PENDING",
    workDate: new Date().toISOString().split('T')[0]
  });

  React.useEffect(() => {
    if (isOpen) {
      // Load data for dropdowns
      const loadData = async () => {
        try {
          const [empRes, areaRes] = await Promise.all([
            staffService.getEmployees(),
            areaService.getAll()
          ]);
          if (empRes.success) setEmployees(empRes.data);
          if (areaRes.success) setAreas(areaRes.data);
        } catch (error) {
          console.error("Failed to load dropdown data:", error);
        }
      };
      loadData();

      // Set initial form data if editing
      if (editingSchedule) {
        setFormData({
          employeeId: editingSchedule.employeeId,
          workName: editingSchedule.workName,
          areaId: editingSchedule.areaId,
          shift: editingSchedule.shift,
          note: editingSchedule.note || "",
          status: editingSchedule.status,
          workDate: editingSchedule.workDate
        });
      } else {
        setFormData({
          employeeId: "",
          workName: "",
          areaId: "",
          shift: "MORNING",
          note: "",
          status: "PENDING",
          workDate: new Date().toISOString().split('T')[0]
        });
      }
    }
  }, [isOpen, editingSchedule]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const InputGroup = ({ label, icon: Icon, children }: any) => (
    <div className="space-y-1.5">
      <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest flex items-center gap-1.5">
        <Icon size={12} className="text-emerald-500" />
        {label}
      </label>
      <div className="relative group">{children}</div>
    </div>
  );

  const inputClasses = "w-full px-5 py-4 bg-slate-50 border-2 border-transparent rounded-2xl text-sm font-bold text-slate-700 outline-none transition-all focus:border-emerald-500/20 focus:bg-white focus:ring-4 focus:ring-emerald-500/5 placeholder:text-slate-300";

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-hidden">
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose} className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" 
        />
        
        <motion.div 
          initial={{ y: 20, scale: 0.95, opacity: 0 }} animate={{ y: 0, scale: 1, opacity: 1 }} exit={{ y: 20, scale: 0.95, opacity: 0 }}
          className="relative w-full max-w-xl bg-white rounded-[2.5rem] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="p-8 border-b border-slate-50 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 shadow-inner">
                <Calendar size={24} />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">
                  {editingSchedule ? "Cập nhật lịch trực" : "Thiết lập lịch mới"}
                </h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Lập kế hoạch vận hành trang trại</p>
              </div>
            </div>
            <button onClick={onClose} className="p-3 hover:bg-slate-50 text-slate-400 rounded-2xl transition-all">
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-6 scrollbar-thin scrollbar-thumb-slate-100">
            {/* Employee Select */}
            <InputGroup label="Nhân viên phụ trách" icon={User}>
              <select 
                required value={formData.employeeId} 
                onChange={e => setFormData({...formData, employeeId: e.target.value})}
                className={cn(inputClasses, "appearance-none cursor-pointer")}
              >
                <option value="">Chọn nhân sự...</option>
                {employees.map(emp => (
                  <option key={emp.id} value={emp.id}>{emp.lastName} {emp.firstName} - {emp.position}</option>
                ))}
              </select>
              <ChevronDown size={16} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </InputGroup>

            {/* Task Name */}
            <InputGroup label="Công việc cụ thể" icon={Briefcase}>
              <input 
                type="text" required placeholder="VD: Kiểm tra sức khỏe đàn lợn con..."
                value={formData.workName} onChange={e => setFormData({...formData, workName: e.target.value})}
                className={inputClasses}
              />
            </InputGroup>

            <div className="grid grid-cols-2 gap-5">
              {/* Area Select */}
              <InputGroup label="Khu vực làm việc" icon={MapPin}>
                <select 
                  required value={formData.areaId} 
                  onChange={e => setFormData({...formData, areaId: e.target.value})}
                  className={cn(inputClasses, "appearance-none cursor-pointer")}
                >
                  <option value="">Chọn khu vực...</option>
                  {areas.map(area => (
                    <option key={area.id} value={area.id}>{area.name}</option>
                  ))}
                </select>
                <ChevronDown size={16} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </InputGroup>

              {/* Date */}
              <InputGroup label="Ngày thực hiện" icon={Calendar}>
                <input 
                  type="date" required
                  value={formData.workDate} onChange={e => setFormData({...formData, workDate: e.target.value})}
                  className={inputClasses}
                />
              </InputGroup>
            </div>

            <div className="grid grid-cols-2 gap-5">
              {/* Shift */}
              <InputGroup label="Ca trực" icon={Clock}>
                <select 
                  value={formData.shift} onChange={e => setFormData({...formData, shift: e.target.value})}
                  className={cn(inputClasses, "appearance-none cursor-pointer")}
                >
                  <option value="MORNING">Ca Sáng</option>
                  <option value="AFTERNOON">Ca Chiều</option>
                  <option value="NIGHT">Ca Đêm</option>
                </select>
                <ChevronDown size={16} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </InputGroup>

              {/* Status */}
              <InputGroup label="Trạng thái" icon={CheckCircle2}>
                <select 
                  value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}
                  className={cn(inputClasses, "appearance-none cursor-pointer")}
                >
                  <option value="PENDING">Chưa thực hiện</option>
                  <option value="IN_PROGRESS">Đang làm</option>
                  <option value="COMPLETED">Đã hoàn thành</option>
                </select>
                <ChevronDown size={16} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </InputGroup>
            </div>

            {/* Note */}
            <InputGroup label="Ghi chú thêm" icon={FileText}>
              <textarea 
                rows={3} placeholder="Mô tả chi tiết nhiệm vụ hoặc lưu ý cho nhân viên..."
                value={formData.note} onChange={e => setFormData({...formData, note: e.target.value})}
                className={cn(inputClasses, "resize-none")}
              />
            </InputGroup>

            <button 
              type="submit"
              className="w-full py-5 bg-slate-900 text-white rounded-2xl text-[13px] font-black uppercase tracking-[0.2em] shadow-xl hover:bg-emerald-600 transition-all active:scale-95"
            >
              {editingSchedule ? "Cập nhật lịch" : "Lưu lịch làm việc"}
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
