import { MatingStatus } from '@/shared/enums/mating.enum';

export const MATING_STATUS_OPTIONS = [
    { value: MatingStatus.PENDING, label: 'Chờ phối' },
    { value: MatingStatus.MATED, label: 'Đã phối' },
    { value: MatingStatus.PREGNANT, label: 'Mang thai' },
];

export const matingStatusColor: Record<MatingStatus, string> = {
    PENDING: 'bg-yellow-50 text-yellow-600',
    MATED: 'bg-blue-50 text-blue-600',
    PREGNANT: 'bg-green-50 text-green-600',
};