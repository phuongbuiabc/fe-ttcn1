'use client';

import React from 'react';
import PenPiggrowthTable from '@/modules/health/ui/PenPiggrowthTable';
import PiggrowthForm from '@/modules/pig/ui/PiggrowthForm';

export default function GrowthTrackingPage() {
	return (
		<div className="space-y-6 p-4 min-h-screen bg-[#fbfcfd]">
			<section className="bg-white border rounded-xl shadow-sm overflow-hidden">
				<div className="px-4 py-3 border-b">
					<h1 className="text-base font-bold text-slate-800">Bảng tăng trưởng theo chuồng</h1>
					<p className="text-xs text-slate-500">Theo dõi nhanh thông tin tăng trưởng hiện tại của lợn theo chuồng.</p>
				</div>
				<div className="h-[520px]">
					<PenPiggrowthTable />
				</div>
			</section>

			<section className="bg-white border rounded-xl shadow-sm overflow-hidden">
				<div className="px-4 py-3 border-b">
					<h2 className="text-base font-bold text-slate-800">Form nhập tăng trưởng</h2>
					<p className="text-xs text-slate-500">Nhập số đo theo từng hàng và xác nhận lưu dữ liệu.</p>
				</div>
				<PiggrowthForm />
			</section>
		</div>
	);
}
