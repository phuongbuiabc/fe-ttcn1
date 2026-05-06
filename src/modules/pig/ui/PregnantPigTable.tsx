'use client';

import React from 'react';
import { PregnantResponse } from '@/modules/pig/model/pig.model';
import { Eye, Edit, Trash2 } from 'lucide-react';

interface PregnantPigTableProps {
	pregnantPigs: PregnantResponse[];
	loading: boolean;
	onView?: (pig: PregnantResponse) => void;
	onEdit?: (pig: PregnantResponse) => void;
	onDelete?: (id: string) => void;
}

export function PregnantPigTable({
	pregnantPigs,
	loading,
	onView,
	onEdit,
	onDelete,
}: PregnantPigTableProps) {
	const hasActions = Boolean(onView || onEdit || onDelete);

	if (loading && pregnantPigs.length === 0) {
		return (
			<div className="flex items-center justify-center py-20">
				<div className="h-12 w-12 animate-spin rounded-full border-b-2 border-emerald-600" />
			</div>
		);
	}

	if (!loading && pregnantPigs.length === 0) {
		return (
			<div className="flex items-center justify-center py-20">
				<p className="text-slate-400">Không có lợn nái đang mang thai</p>
			</div>
		);
	}

	const formatDate = (date: string) => {
		if (!date) return '--';
		return new Date(date).toLocaleDateString('vi-VN');
	};

	return (
		<div className="responsive-table">
			<table className="w-full border-collapse text-left">
				<thead className="bg-slate-50/50">
					<tr>
						<th className="px-6 py-3 text-[9px] font-black uppercase text-slate-400">
							Số tai
						</th>
						<th className="px-6 py-3 text-[9px] font-black uppercase text-slate-400">
							Ngày phối
						</th>
						<th className="px-6 py-3 text-[9px] font-black uppercase text-slate-400">
							Ngày có thai
						</th>
						<th className="px-6 py-3 text-[9px] font-black uppercase text-slate-400">
							Ngày dự sinh
						</th>
						<th className="px-6 py-3 text-[9px] font-black uppercase text-slate-400 text-center">
							Lần có thai
						</th>
						<th className="px-6 py-3 text-[9px] font-black uppercase text-slate-400 text-center">
							Trạng thái
						</th>
						{hasActions && (
							<th className="px-6 py-3 text-[9px] font-black uppercase text-slate-900 text-right">
								Thao tác
							</th>
						)}
					</tr>
				</thead>

				<tbody className="divide-y divide-slate-50">
					{pregnantPigs.map((pig) => (
						<tr
							key={pig.id}
							className="cursor-pointer bg-white transition-all hover:bg-slate-50"
							onClick={() => onView?.(pig)}
						>
							{/* SỐ TAI */}
							<td className="px-6 py-3">
								<p className="text-[13px] font-black text-slate-900">
									{pig.earTag || '--'}
								</p>
								<p className="text-[10px] text-slate-400">ID: {pig.id}</p>
							</td>

							{/* NGÀY PHỐI */}
							<td className="px-6 py-3">
								<span className="text-sm text-slate-700">
									{formatDate(pig.matingDate)}
								</span>
							</td>

							{/* NGÀY CÓ THAI */}
							<td className="px-6 py-3">
								<span className="text-sm text-slate-700">
									{formatDate(pig.conceptionDate)}
								</span>
							</td>

							{/* NGÀY DỰ SINH */}
							<td className="px-6 py-3">
								<span className="text-sm font-bold text-emerald-600">
									{formatDate(pig.expectedFarrowDate)}
								</span>
							</td>

							{/* LẦN CÓ THAI */}
							<td className="px-6 py-3 text-center">
								<span className="inline-block rounded-full bg-slate-100 px-3 py-1 text-sm font-bold text-slate-900">
									{pig.prenancyNumber}
								</span>
							</td>

							{/* TRẠNG THÁI */}
							<td className="px-6 py-3 text-center">
								<span
									className={`inline-block rounded px-2 py-1 text-xs font-bold ${
										pig.status === 'active'
											? 'bg-green-100 text-green-700'
											: pig.status === 'inactive'
												? 'bg-red-100 text-red-700'
												: 'bg-yellow-100 text-yellow-700'
									}`}
								>
									{pig.status}
								</span>
							</td>

							{/* THAO TÁC */}
							{hasActions && (
								<td className="px-6 py-3 text-right">
									<div
										className="flex items-center justify-end gap-2"
										onClick={(e) => e.stopPropagation()}
									>
										{onView && (
											<button
												onClick={() => onView(pig)}
												className="rounded p-1 hover:bg-blue-100"
												title="Xem chi tiết"
											>
												<Eye className="h-4 w-4 text-blue-600" />
											</button>
										)}
										{onEdit && (
											<button
												onClick={() => onEdit(pig)}
												className="rounded p-1 hover:bg-yellow-100"
												title="Sửa"
											>
												<Edit className="h-4 w-4 text-yellow-600" />
											</button>
										)}
										{onDelete && (
											<button
												onClick={() => onDelete(pig.id)}
												className="rounded p-1 hover:bg-red-100"
												title="Xóa"
											>
												<Trash2 className="h-4 w-4 text-red-600" />
											</button>
										)}
									</div>
								</td>
							)}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
