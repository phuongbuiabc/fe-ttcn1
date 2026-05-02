import React, { useEffect, useMemo, useState } from 'react';
import { PenResponse } from '@/modules/pens/model/pen.model';
import { PigResponse } from '@/modules/pig/model/pig.model';
import { PenPigResponse } from '@/modules/penpig/model/penpig.model';
import { PenPigStatus } from '@/shared/enums/penpig.enum';

type PenPigFormValue = {
	penId: string;
	pigId: string;
	entryDate: string;
	exitDate: string;
	status: PenPigStatus;
};

interface Props {
	open: boolean;
	onClose: () => void;
	onSubmit: (data: {
		penId: string;
		pigId: string;
		entryDate: string;
		exitDate?: string;
		status?: PenPigStatus;
	}) => void | Promise<void>;
	initialData?: PenPigResponse | null;
	pens: PenResponse[];
	pigs: PigResponse[];
	loading?: boolean;
}

const getToday = () => new Date().toISOString().slice(0, 10);

const isValidStatus = (value: string): value is PenPigStatus =>
	Object.values(PenPigStatus).includes(value as PenPigStatus);

const trimToUndefined = (value: string) => {
	const trimmed = value.trim();
	return trimmed ? trimmed : undefined;
};

export function PenPigForm({
	open,
	onClose,
	onSubmit,
	initialData,
	pens,
	pigs,
	loading = false,
}: Props) {
	const initialForm = useMemo<PenPigFormValue>(
		() => ({
			penId: initialData?.penId || '',
			pigId: initialData?.pigId || '',
			entryDate: initialData?.entryDate?.slice(0, 10) || getToday(),
			exitDate: initialData?.exitDate?.slice(0, 10) || '',
			status: initialData && isValidStatus(initialData.status)
				? initialData.status
				: PenPigStatus.IN_PEN,
		}),
		[initialData]
	);

	const [form, setForm] = useState<PenPigFormValue>(initialForm);

	useEffect(() => {
		setForm(initialForm);
	}, [initialForm]);

	useEffect(() => {
		if (!open || initialData) return;
		setForm((prev) => ({
			...prev,
			entryDate: getToday(),
		}));
	}, [open, initialData]);

	if (!open) return null;

	const selectedPenName = pens.find((pen) => pen.id === form.penId)?.name || '';
	const selectedPigLabel = pigs.find((pig) => pig.id === form.pigId)?.pigCode || '';

	const handleSubmit = async () => {
		if (!form.penId || !form.pigId) {
			alert('Vui lòng chọn chuồng và lợn trước khi lưu.');
			return;
		}

		await onSubmit({
			penId: form.penId,
			pigId: form.pigId,
			entryDate: form.entryDate || getToday(),
			exitDate: trimToUndefined(form.exitDate),
			status: form.status,
		});
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4">
			<div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">
				<div className="border-b px-6 py-4">
					<h3 className="text-lg font-bold text-slate-900">
						{initialData ? 'Cập nhật lợn trong chuồng' : 'Thêm lợn vào chuồng'}
					</h3>
					<p className="mt-1 text-sm text-slate-500">
						Chọn chuồng, chọn lợn và thời gian vào/ra chuồng để lưu phân công.
					</p>
				</div>

				<div className="space-y-4 px-6 py-5">
					<div>
						<label className="mb-1 block text-sm font-medium text-slate-700">
							Chuồng
						</label>
						<select
							value={form.penId}
							onChange={(e) => setForm((prev) => ({ ...prev, penId: e.target.value }))}
							className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-emerald-500"
						>
							<option value="">Chọn chuồng</option>
							{pens.map((pen) => (
								<option key={pen.id} value={pen.id}>
									{pen.name}
								</option>
							))}
						</select>
						{selectedPenName ? (
							<p className="mt-1 text-xs text-slate-500">Đang chọn: {selectedPenName}</p>
						) : null}
					</div>

					<div>
						<label className="mb-1 block text-sm font-medium text-slate-700">
							Lợn
						</label>
						<select
							value={form.pigId}
							onChange={(e) => setForm((prev) => ({ ...prev, pigId: e.target.value }))}
							className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-emerald-500"
						>
							<option value="">Chọn lợn</option>
							{pigs.map((pig) => (
								<option key={pig.id} value={pig.id}>
									{pig.pigCode}
									{pig.earTag ? ` - ${pig.earTag}` : ''}
								</option>
							))}
						</select>
						{selectedPigLabel ? (
							<p className="mt-1 text-xs text-slate-500">Đang chọn: {selectedPigLabel}</p>
						) : null}
					</div>

					<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
						<div>
							<label className="mb-1 block text-sm font-medium text-slate-700">
								Ngày vào chuồng
							</label>
							<input
								type="date"
								value={form.entryDate}
								onChange={(e) =>
									setForm((prev) => ({ ...prev, entryDate: e.target.value }))
								}
								className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-emerald-500"
							/>
						</div>

						<div>
							<label className="mb-1 block text-sm font-medium text-slate-700">
								Ngày ra chuồng
							</label>
							<input
								type="date"
								value={form.exitDate}
								onChange={(e) =>
									setForm((prev) => ({ ...prev, exitDate: e.target.value }))
								}
								className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-emerald-500"
							/>
						</div>
					</div>

					<div>
						<label className="mb-1 block text-sm font-medium text-slate-700">
							Trạng thái
						</label>
						<select
							value={form.status}
							onChange={(e) =>
								setForm((prev) => ({
									...prev,
									status: e.target.value as PenPigStatus,
								}))
							}
							className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-emerald-500"
						>
							<option value={PenPigStatus.IN_PEN}>In Pen</option>
							<option value={PenPigStatus.EXITED}>Exited</option>
						</select>
					</div>
				</div>

				<div className="flex items-center justify-end gap-3 border-t bg-slate-50 px-6 py-4">
					<button
						type="button"
						onClick={onClose}
						className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
					>
						Hủy
					</button>
					<button
						type="button"
						onClick={handleSubmit}
						disabled={loading}
						className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
					>
						{loading ? 'Đang lưu...' : 'Lưu'}
					</button>
				</div>
			</div>
		</div>
	);
}

export default PenPigForm;
