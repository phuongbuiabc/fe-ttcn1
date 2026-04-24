"use client";

import React, { useState } from "react";
import { 
  AlertTriangle, 
  Stethoscope, 
  Utensils, 
  ChevronDown, 
  ChevronLeft, 
  ChevronRight, 
  Eye, 
  MoreVertical, 
  Skull, 
  CheckCircle, 
  PlusCircle, 
  Plus, 
  Search, 
  Edit, 
  Trash2,
  X,
  Calendar,
  Clock,
  MapPin,
  GraduationCap,
  Phone,
  User,
  Baby,
  Activity
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/shared/utils/utils";

// Feature Components
import { TreatmentFormModal } from "@/modules/health/ui/TreatmentFormModal";
import { VaccinationFormModal } from "@/modules/health/ui/VaccinationFormModal";

// --- Types ---
interface Treatment {
  id: string; breed: string; type: string; weight: string; disease: string; date: string; duration: string; expected: string; color: string;
}
interface Vaccination {
  id: string; date: string; vaccine: string; dose: string; staff: string;
}
interface LitterVaccination extends Vaccination {
  count: number;
}

// --- Mock Data ---
const activeTreatments: Treatment[] = [
  { id: "#LD-9901", breed: "Duroc", type: "Nái", weight: "105 kg", disease: "Sốt xuất huyết heo (ASF)", date: "21/05/2026", duration: "14 ngày", expected: "04/06", color: "rose" },
  { id: "#LD-9844", breed: "Yorkshire", type: "Thịt", weight: "92 kg", disease: "Hội chứng rối loạn hô hấp (PRRS)", date: "18/05/2026", duration: "21 ngày", expected: "08/06", color: "amber" },
];

const pigVaccinations: Vaccination[] = [
  { id: "#LD-9821", date: "15/05/2026", vaccine: "FMD-Vac", dose: "2ml", staff: "Nguyễn An" },
  { id: "#LD-9901", date: "10/05/2026", vaccine: "PRRS-Live", dose: "1ml", staff: "Trần Bình" },
];

const litterVaccinations: LitterVaccination[] = [
  { id: "#PIG-004", date: "18/05/2026", vaccine: "Circo-Vac", dose: "0.5ml", count: 12, staff: "Lê Văn C" },
];

export default function HealthManagementPage() {
  const [isMonitoringOpen, setIsMonitoringOpen] = useState(true);
  const [selectedBarn, setSelectedBarn] = useState("A-01");
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [isVaccineModalOpen, setIsVaccineModalOpen] = useState(false);
  const [isLitterVaccineModalOpen, setIsLitterVaccineModalOpen] = useState(false);
  
  const [selectedTreatment, setSelectedTreatment] = useState<Treatment | null>(null);
  const [treatments, setTreatments] = useState<Treatment[]>(activeTreatments);
  const [editingTreatment, setEditingTreatment] = useState<Treatment | null>(null);

  const [pVaccinations, setPVaccinations] = useState<Vaccination[]>(pigVaccinations);
  const [lVaccinations, setLVaccinations] = useState<LitterVaccination[]>(litterVaccinations);

  const [formData, setFormData] = useState<any>({
    id: "", breed: "Yorkshire", type: "Thịt", weight: "90 kg", disease: "", date: "21/05/2026", duration: "7 ngày", expected: "30/05/2026", color: "amber"
  });

  const [vaccineFormData, setVaccineFormData] = useState<any>({
    id: "", date: "21/05/2026", vaccine: "", dose: "", staff: "Nguyễn An", count: 10
  });

  const openAddModal = () => {
    setEditingTreatment(null);
    setFormData({ id: `#LD-${Math.floor(1000 + Math.random() * 9000)}`, breed: "Yorkshire", type: "Thịt", weight: "90 kg", disease: "", date: "21/05/2026", duration: "7 ngày", expected: "30/05/2026", color: "amber" });
    setIsAddEditModalOpen(true);
  };

  const openAddVaccineModal = (isLitter: boolean) => {
    setVaccineFormData({ id: isLitter ? "#PIG-000" : "#LD-0000", date: "21/05/2026", vaccine: "", dose: "", staff: "Nguyễn An", count: 10 });
    if (isLitter) setIsLitterVaccineModalOpen(true);
    else setIsVaccineModalOpen(true);
  };

  return (
    <div className="space-y-4 pb-20 bg-[#fbfcfd] min-h-screen -m-4 p-4 ">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-lg font-extrabold text-slate-800 tracking-tight font-headline uppercase leading-none">Giám sát sức khỏe</h1>
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mt-1">Hệ thống theo dõi cá thể tích cực</p>
        </div>
        <button onClick={openAddModal} className="px-4 py-2 bg-[#00a67d] text-white rounded-full text-[11px] font-bold shadow-lg shadow-emerald-900/10 flex items-center gap-2 active:scale-95 transition-all">
          <Plus size={14} /> Ghi nhận tình trạng
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "Lợn bất thường", value: "12", color: "rose", bg: "bg-rose-50", text: "text-rose-600", icon: AlertTriangle },
          { label: "Đang điều trị", value: "45", color: "emerald", bg: "bg-emerald-50", text: "text-emerald-700", icon: Stethoscope },
          { label: "Bỏ ăn/Theo dõi", value: "08", color: "amber", bg: "bg-amber-50", text: "text-amber-600", icon: Utensils }
        ].map((kpi, i) => (
          <div key={i} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm relative overflow-hidden group">
            <div className={cn("absolute right-0 top-0 w-20 h-20 opacity-5 -mr-5 -mt-5 rounded-full", kpi.bg)} />
            <div className="relative z-10 space-y-3">
              <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center shadow-inner", kpi.bg, kpi.text)}><kpi.icon size={20} /></div>
              <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{kpi.label}</p>
                <p className={cn("text-xl font-black tracking-tighter mt-1", kpi.text)}>{kpi.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Monitoring List */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
          <h2 className="text-sm font-black text-slate-800 uppercase tracking-tight">Cá thể đang điều trị tích cực</h2>
          <div className="flex gap-2">
             <button className="p-2 bg-white text-slate-400 rounded-lg hover:bg-slate-50 active:scale-90 transition-all"><Search size={14} /></button>
             <button className="p-2 bg-white text-slate-400 rounded-lg hover:bg-slate-50 active:scale-90 transition-all"><Plus size={14} /></button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50/50">
              <tr>
                <th className="px-6 py-1.5 text-[9px] font-black text-slate-900 uppercase tracking-widest leading-none">Mã số tai</th>
                <th className="px-6 py-1.5 text-[9px] font-black text-slate-900 uppercase tracking-widest leading-none">Chẩn đoán bệnh</th>
                <th className="px-6 py-1.5 text-[9px] font-black text-slate-900 uppercase tracking-widest leading-none">Liệu trình</th>
                <th className="px-6 py-1.5 text-[9px] font-black text-slate-900 uppercase tracking-widest leading-none">Dự kiến kết thúc</th>
                <th className="px-6 py-1.5 text-[9px] font-black text-slate-900 uppercase tracking-widest leading-none text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {treatments.map((item) => (
                <tr key={item.id} className="bg-white hover:bg-slate-50 transition-all group cursor-pointer" onClick={() => { setSelectedTreatment(item); setIsDetailModalOpen(true); }}>
                  <td className="px-6 py-1.5 font-black text-slate-900 tracking-tight leading-none text-[13px]">{item.id}</td>
                  <td className="px-6 py-1.5 leading-none">
                    <span className={cn(
                      "px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest", 
                      item.color === "rose" ? "bg-rose-50 text-rose-500" : "bg-amber-50 text-amber-600"
                    )}>{item.disease}</span>
                  </td>
                  <td className="px-6 py-1.5">
                     <span className="px-2 py-0.5 bg-slate-50 text-slate-500 rounded border border-slate-100 text-[9px] font-black uppercase tracking-tighter">
                        {item.duration}
                     </span>
                  </td>
                  <td className="px-6 py-1.5 font-black text-emerald-600 tracking-tighter text-base leading-none">{item.expected}</td>
                  <td className="px-6 py-1.5 text-right">
                    <div className="flex justify-end gap-1.5 transition-all">
                      <button className="p-1.5 text-slate-400 hover:text-blue-600 transition-all"><Edit size={14} /></button>
                      <button className="p-1.5 text-slate-400 hover:text-rose-600 transition-all"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* History Grid */}
      <div className="grid grid-cols-2 gap-4">
        {[
          { title: "Nhật ký tiêm phòng Lợn", icon: User, data: pVaccinations },
          { title: "Nhật ký tiêm phòng Đàn con", icon: Baby, data: lVaccinations }
        ].map((sec, i) => (
          <div key={i} className="space-y-4">
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <div className="w-8 h-8 bg-white border border-slate-100 text-emerald-600 rounded-lg flex items-center justify-center shadow-sm"><sec.icon size={16} /></div>
                   <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight">{sec.title}</h3>
                </div>
                <button onClick={() => openAddVaccineModal(i === 1)} className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Thêm mới</button>
             </div>
             <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden min-h-[200px]">
                <table className="w-full text-left border-collapse">
                   <thead className="bg-slate-50/50">
                      <tr>
                         <th className="px-6 py-2 text-[9px] font-black text-slate-900 uppercase tracking-widest leading-none">Mã định danh</th>
                         <th className="px-6 py-2 text-[9px] font-black text-slate-900 uppercase tracking-widest leading-none">Loại Vaccine</th>
                         <th className="px-6 py-2 text-[9px] font-black text-slate-900 uppercase tracking-widest leading-none text-right">Ngày thực hiện</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-50">
                      {sec.data.map((v, idx) => (
                        <tr key={idx} className="hover:bg-slate-50 transition-all cursor-pointer">
                           <td className="px-6 py-2 font-black text-slate-900 text-xs leading-none">{v.id}</td>
                           <td className="px-6 py-2 leading-none">
                              <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded text-[9px] font-black uppercase tracking-tighter border border-emerald-100/50">{v.vaccine}</span>
                           </td>
                           <td className="px-6 py-2 font-bold text-slate-400 text-[9px] text-right leading-none uppercase">{v.date}</td>
                        </tr>
                      ))}
                   </tbody>
                </table>
             </div>
          </div>
        ))}
      </div>

      {/* Modals */}
      <TreatmentFormModal isOpen={isAddEditModalOpen} onClose={() => setIsAddEditModalOpen(false)} onSave={(e) => { e.preventDefault(); setIsAddEditModalOpen(false); }} editingTreatment={editingTreatment} formData={formData} setFormData={setFormData} />
      <VaccinationFormModal isOpen={isVaccineModalOpen} isLitter={false} onClose={() => setIsVaccineModalOpen(false)} onSave={(e) => { e.preventDefault(); setIsVaccineModalOpen(false); }} formData={vaccineFormData} setFormData={setFormData} />
      <VaccinationFormModal isOpen={isLitterVaccineModalOpen} isLitter={true} onClose={() => setIsLitterVaccineModalOpen(false)} onSave={(e) => { e.preventDefault(); setIsLitterVaccineModalOpen(false); }} formData={vaccineFormData} setFormData={setFormData} />

      {/* Detail Modal */}
      <AnimatePresence>
        {isDetailModalOpen && selectedTreatment && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl border border-slate-100 overflow-hidden p-6">
               <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-emerald-50 text-[#00a67d] rounded-lg flex items-center justify-center shadow-inner"><Activity size={20} /></div>
                    <div>
                      <h2 className="text-lg font-black text-slate-800 tracking-tight uppercase leading-none">{selectedTreatment.id}</h2>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Hồ sơ bệnh án chi tiết</p>
                    </div>
                  </div>
                  <button onClick={() => setIsDetailModalOpen(false)} className="p-1.5 bg-slate-50 text-slate-400 rounded-lg hover:bg-slate-100 transition-all"><X size={14} /></button>
               </div>

               <div className="grid grid-cols-2 gap-4 mb-4 pb-4 border-b border-slate-50">
                  <div className="space-y-3">
                     <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Thông tin cơ bản</p>
                     <div className="space-y-1.5">
                        <div className="flex items-center gap-2 font-bold text-slate-700 text-[11px]"><User size={12} className="text-emerald-500" /> {selectedTreatment.type} - {selectedTreatment.breed}</div>
                        <div className="flex items-center gap-2 font-bold text-slate-700 text-[11px]"><PlusCircle size={12} className="text-rose-500" /> {selectedTreatment.disease}</div>
                     </div>
                  </div>
                  <div className="space-y-3">
                     <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Tiến độ điều trị</p>
                     <div className="space-y-1.5">
                        <div className="flex items-center gap-2 font-bold text-slate-700 text-[11px]"><Calendar size={12} className="text-[#00a67d]" /> Bắt đầu: {selectedTreatment.date}</div>
                        <div className="flex items-center gap-2 font-black text-emerald-600 text-[11px]"><Clock size={12} /> Dự kiến: {selectedTreatment.expected}</div>
                     </div>
                  </div>
               </div>

               <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-slate-400 shadow-sm"><CheckCircle size={16} /></div>
                    <p className="text-[11px] font-bold text-slate-600">Xác nhận hoàn thành liệu trình sớm?</p>
                  </div>
                  <button className="px-3 py-1.5 bg-white text-emerald-600 border border-emerald-100 rounded text-[9px] font-black uppercase tracking-widest shadow-sm hover:bg-emerald-50 transition-all">Kết thúc</button>
               </div>
               
               <button onClick={() => setIsDetailModalOpen(false)} className="w-full mt-4 py-3 bg-slate-900 text-white rounded-lg text-[9px] font-black uppercase tracking-[0.2em] shadow-xl shadow-slate-900/10 active:scale-[0.98] transition-all">Quay lại danh sách</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

