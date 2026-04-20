"use client";

import React from "react";
import { X, Activity } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface AdjustmentModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSave: (e: React.FormEvent) => void;
	supply: any | null;
	adjForm: any;
	setAdjForm: (data: any) => void;
}

export function AdjustmentModal({ isOpen, onClose, onSave, supply, adjForm, setAdjForm }: AdjustmentModalProps) {
	if (!isOpen || !supply) return null;

	return (
		<AnimatePresence>
			<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
				<motion.div 
					initial={{ scale: 0.9, opacity: 0 }} 
					animate={{ scale: 1, opacity: 1 }} 
					exit={{ scale: 0.9, opacity: 0 }} 
					className="bg-white rounded-[1.75rem] w-full max-lg shadow-2xl p-10 border-t-8 border-blue-500 max-w-lg"
				>
					<div className="flex justify-between items-start mb-6 text-blue-600">
						<div>
							<h2 className="text-xl font-black uppercase leading-none">ĐIỀU CHỈNH TỒN KHO</h2>
							<p className="text-[10px] font-bold mt-2 text-slate-400 uppercase tracking-widest">
								Vật tư: {supply.supply_name} (Hiện có: {supply.quantity})
							</p>
						</div>
						<Activity size={32} className="opacity-20" />
					</div>
					<form onSubmit={onSave} className="space-y-5">
						<div className="space-y-1">
							<label className="text-[10px] font-black text-slate-400 uppercase">Số lượng thay đổi (+/-)</label>
							<input 
								type="number" required 
								value={adjForm.quantity_change} 
								onChange={e => setAdjForm({ ...adjForm, quantity_change: parseInt(e.target.value) })} 
								className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-center text-xl font-black text-slate-800 placeholder:text-slate-300 focus:ring-2 focus:ring-blue-500/20 outline-none" 
								placeholder="0" 
							/>
							<p className="text-[9px] text-center text-slate-400 font-bold mt-2 uppercase tracking-tight">Số dương: Tăng kho | Số âm: Giảm kho</p>
						</div>
						<div className="space-y-1">
							<label className="text-[10px] font-black text-slate-400 uppercase">Lý do điều chỉnh</label>
							<input 
								type="text" required 
								value={adjForm.reason} 
								onChange={e => setAdjForm({ ...adjForm, reason: e.target.value })} 
								className="w-full px-4 py-4 bg-slate-50 border-none rounded-2xl text-xs font-bold outline-none shadow-inner" 
								placeholder="Lý do điều chỉnh..." 
							/>
						</div>
						<div className="space-y-1">
							<label className="text-[10px] font-black text-slate-400 uppercase">Ghi chú bổ sung</label>
							<textarea 
								value={adjForm.note} 
								onChange={e => setAdjForm({ ...adjForm, note: e.target.value })} 
								className="w-full px-4 py-4 bg-slate-50 border-none rounded-2xl text-xs font-bold resize-none outline-none" 
								rows={2} 
							/>
						</div>
						<div className="flex gap-4 pt-4">
							<button 
								type="button" 
								onClick={onClose} 
								className="flex-1 py-4 bg-slate-50 text-slate-700 rounded-2xl text-[10px] font-black uppercase tracking-widest active:scale-95 transition-all"
							>
								Huỷ bỏ
							</button>
							<button 
								type="submit" 
								className="flex-1 py-4 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-900/10 active:scale-95 transition-all"
							>
								Cập nhật kho
							</button>
						</div>
					</form>
				</motion.div>
			</div>
		</AnimatePresence>
	);
}
