'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Plus } from 'lucide-react';
import CullingProposalTable from '@/modules/cullingproposal/ui/CullingProposalTable';
import { CullingProposalForm } from '@/modules/cullingproposal/ui/CullingproposalForm';
import { pigTabs } from '@/shared/config/module-tabs';

export default function CullingProposalsPage() {
	const pathname = usePathname();
	const currentTab = pigTabs.find((tab) => tab.href === pathname);

	const [isFormOpen, setIsFormOpen] = useState(false);
	const [refreshKey, setRefreshKey] = useState(0);

	const handleFormSuccess = () => {
		setRefreshKey((prev) => prev + 1);
	};

	return (
		<div className="space-y-4 pb-20 bg-[#fbfcfd] min-h-screen -m-4 p-4">
			<div className="flex justify-between items-center">
				<h1 className="text-lg font-extrabold uppercase">{currentTab?.title || 'Đề xuất loại vào'}</h1>
				<button
					onClick={() => setIsFormOpen(true)}
					className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-600 transition"
				>
					<Plus size={18} />
					Thêm đề xuất
				</button>
			</div>

			{/* Table */}
			<CullingProposalTable key={refreshKey} />

			{/* Form Modal */}
			<CullingProposalForm
				isOpen={isFormOpen}
				onClose={() => setIsFormOpen(false)}
				onSuccess={handleFormSuccess}
			/>
		</div>
	);
}

