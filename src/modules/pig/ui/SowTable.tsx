'use client';

import React from 'react';
import { Eye, Edit, Trash2 } from 'lucide-react';
import { cn } from '@/shared/utils/utils';
import { SowResponse } from '../model/pig.model';

interface SowTableProps {
	sows: SowResponse[];
	loading: boolean;
	onView?: (sow: SowResponse) => void;
	onEdit?: (sow: SowResponse) => void;
	onDelete?: (id: string) => void;
}

export function SowTable({
	sows,
	loading,
	onView,
	onEdit,
	onDelete,
}: SowTableProps) {
	const hasActions = Boolean(onView || onEdit || onDelete);

	if (loading && sows.length === 0) {
		return (
			<div className="flex items-center justify-center py-20">
				<div className="h-12 w-12 animate-spin rounded-full border-b-2 border-emerald-600" />
			</div>
		);
	}

	return (
		<div className="responsive-table">
			<table className="w-full border-collapse text-left">
				<thead className="bg-slate-50/50">
					<tr>
						<th className="px-6 py-3 text-[9px] font-black uppercase text-slate-400">
							Số tai
						</th>
						<th className="px-6 py-3 text-[9px] font-black uppercase text-slate-400">
							Loại
						</th>
						<th className="px-6 py-3 text-[9px] font-black uppercase text-slate-400">
							Giống
						</th>
						<th className="px-6 py-3 text-[9px] font-black uppercase text-slate-400 text-center">
							Số thai
						</th>
						<th className="px-6 py-3 text-[9px] font-black uppercase text-slate-400 text-center">
							Sẩy thai
						</th>
						<th className="px-6 py-3 text-[9px] font-black uppercase text-slate-400 text-center">
							Trạng thái
						</th>
					</tr>
				</thead>

				<tbody className="divide-y divide-slate-50">
					{sows.map((sow) => (
						<tr
						key={sow.id}
						className="cursor-pointer bg-white transition-all hover:bg-slate-50"
						onClick={() => onView?.(sow)}
						>
						{/* SỐ TAI */}
						<td className="px-6 py-3">
							<p className="text-[13px] font-black text-slate-900">
							{sow.earTag || '--'}
							</p>
						</td>

						{/* LOẠI */}
						<td className="px-6 py-3">
							<span className="text-xs font-bold text-slate-700">
							{sow.type}
							</span>
						</td>

						{/* GIỐNG */}
						<td className="px-6 py-3">
							<span className="text-xs text-slate-700">
							{sow.species || '--'}
							</span>
						</td>

						{/* SỐ THAI */}
						<td className="px-6 py-3 text-center">
							<span className="text-sm font-bold text-slate-900">
							{sow.totalPregnancies}
							</span>
						</td>

						{/* SẨY THAI */}
						<td className="px-6 py-3 text-center">
							<span className="text-sm font-bold text-slate-900">
							{sow.miscarriageCount}
							</span>
						</td>

						{/* TRẠNG THÁI */}
						<td className="px-6 py-3 text-center">
							<span
							className={cn(
								'rounded-full px-2 py-0.5 text-[9px] font-bold uppercase',
								sow.status === 'ACTIVE'
								? 'bg-emerald-50 text-emerald-600'
								: sow.status === 'SOLD'
								? 'bg-blue-50 text-blue-600'
								: 'bg-slate-100 text-slate-500'
							)}
							>
							{sow.status || '--'}
							</span>
						</td>
						</tr>
					))}
					</tbody>
			</table>
		</div>
	);
}
