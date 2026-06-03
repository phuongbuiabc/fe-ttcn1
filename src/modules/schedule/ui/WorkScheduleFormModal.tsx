"use client";

import React from "react";
import { 
  User, MapPin, Calendar, Clock, 
  FileText, CheckCircle2, Briefcase
} from "lucide-react";
import { cn } from "@/shared/utils/utils";
import { Employee, WorkSchedule } from "@/shared/types";
import { areaService } from "@/modules/area/api/area.service";
import { staffService } from "@/modules/staff/api/staff.service";
import { BaseModal } from "@/shared/components/ui/BaseModal";
import { CustomSelect } from "@/shared/components/ui/CustomSelect";

interface WorkScheduleFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  editingSchedule: WorkSchedule | null;
}

const InputGroup = ({ label, icon: Icon, children }: any) => (
  <div className="space-y-1.5">
    <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest flex items-center gap-1.5">
      <Icon size={12} className="text-emerald-500" />
      {label}
    </label>
    <div className="relative group">{children}</div>
  </div>
);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };


  const inputClasses = "w-full px-5 py-4 bg-slate-50 border-2 border-transparent rounded-2xl text-sm font-bold text-slate-700 outline-none transition-all focus:border-emerald-500/20 focus:bg-white focus:ring-4 focus:ring-emerald-500/5 placeholder:text-slate-300";

  // Map data to options
  const employeeOptions = employees.map(emp => ({
    value: emp.id,
    label: `${emp.lastName} ${emp.firstName} - ${emp.position}`
  }));

  const areaOptions = areas.map(area => ({
    value: area.id,
    label: area.name
  }));

  const shiftOptions = [
    { value: "MORNING", label: "Ca Sáng" },
    { value: "AFTERNOON", label: "Ca Chiều" },
    { value: "NIGHT", label: "Ca Đêm" }
  ];

  const statusOptions = [
    { value: "PENDING", label: "Chưa thực hiện" },
    { value: "IN_PROGRESS", label: "Đang làm" },
    { value: "COMPLETED", label: "Đã hoàn thành" }
  ];

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={editingSchedule ? "Cập nhật lịch trực" : "Thiết lập lịch mới"}
      subtitle="Lập kế hoạch vận hành trang trại"
      className="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6 mt-4">
        {/* Employee Select */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest flex items-center gap-1.5">
            Nhân viên phụ trách
          </label>
          <CustomSelect
            value={formData.employeeId}
            onChange={val => setFormData({ ...formData, employeeId: val })}
            options={employeeOptions}
            icon={User}
            placeholder="Chọn nhân sự..."
          />
        </div>

        {/* Task Name */}
        <InputGroup label="Công việc cụ thể" icon={Briefcase}>
          <input 
            type="text" required placeholder="VD: Kiểm tra sức khỏe đàn lợn con..."
            value={formData.workName} onChange={e => setFormData({ ...formData, workName: e.target.value })}
            className={inputClasses}
          />
        </InputGroup>

        <div className="grid grid-cols-2 gap-5">
          {/* Area Select */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest flex items-center gap-1.5">
              Khu vực làm việc
            </label>
            <CustomSelect
              value={formData.areaId}
              onChange={val => setFormData({ ...formData, areaId: val })}
              options={areaOptions}
              icon={MapPin}
              placeholder="Chọn khu vực..."
            />
          </div>

          {/* Date */}
          <InputGroup label="Ngày thực hiện" icon={Calendar}>
            <input 
              type="date" required
              value={formData.workDate} onChange={e => setFormData({ ...formData, workDate: e.target.value })}
              className={inputClasses}
            />
          </InputGroup>
        </div>

        <div className="grid grid-cols-2 gap-5">
          {/* Shift */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest flex items-center gap-1.5">
              Ca trực
            </label>
            <CustomSelect
              value={formData.shift}
              onChange={val => setFormData({ ...formData, shift: val })}
              options={shiftOptions}
              icon={Clock}
            />
          </div>

          {/* Status */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest flex items-center gap-1.5">
              Trạng thái
            </label>
            <CustomSelect
              value={formData.status}
              onChange={val => setFormData({ ...formData, status: val })}
              options={statusOptions}
              icon={CheckCircle2}
            />
          </div>
        </div>

        {/* Note */}
        <InputGroup label="Ghi chú thêm" icon={FileText}>
          <textarea 
            rows={3} placeholder="Mô tả chi tiết nhiệm vụ hoặc lưu ý cho nhân viên..."
            value={formData.note} onChange={e => setFormData({ ...formData, note: e.target.value })}
            className={cn(inputClasses, "resize-none")}
          />
        </InputGroup>

        <button 
          type="submit"
          className="w-full py-4 mt-6 bg-slate-900 hover:bg-emerald-600 text-white rounded-2xl text-xs font-black uppercase tracking-[0.2em] shadow-xl hover:shadow-emerald-500/10 transition-all active:scale-95 duration-200"
        >
          {editingSchedule ? "Cập nhật lịch" : "Lưu lịch làm việc"}
        </button>
      </form>
    </BaseModal>
  );
}
