'use client';

import React from 'react';
import { PregnantResponse } from '@/modules/pig/model/pig.model';
import { ReproductionCycleTable } from '@/modules/reproduction/ui/ReproductionCycleTable';

interface PregnantPigTableProps {
	pregnantPigs: PregnantResponse[];
	loading: boolean;
	onView?: (pig: PregnantResponse) => void;
	onEdit?: (pig: PregnantResponse) => void;
	onDelete?: (id: string) => void;
	onRefresh?: () => Promise<void> | void;
}

type FarrowingRowState = {
	id: string;
	earTag: string;
	bornCount: string;
	aliveCount: string;
	deadCount: string;
	crushedCount: string;
	deformedCount: string;
	averageWeight: string;
};

type FarrowingRowError = Partial<Record<keyof Omit<FarrowingRowState, 'id' | 'earTag'>, string>>;

export function PregnantPigTable({
	pregnantPigs,
	loading,
	onView,
	onEdit,
	onDelete,
	onRefresh,
}: PregnantPigTableProps) {
	return (
		<ReproductionCycleTable
			pregnantPigs={pregnantPigs}
			loading={loading}
			onView={onView}
			onEdit={onEdit}
			onDelete={onDelete}
			onRefresh={onRefresh}
		/>
	);
}
