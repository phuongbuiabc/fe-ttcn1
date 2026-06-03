import { MatingStatus } from '@/shared/enums/mating.enum';

export const MATING_STATUS_OPTIONS = [
    { value: MatingStatus.TRACKING, label: 'Chờ phối' },
    { value: MatingStatus.SUCCESS, label: 'Thành công' },
    { value: MatingStatus.FAILURE, label: 'Thất bại ' },
];

export const matingStatusColor: Record<MatingStatus, string> = {
    TRACKING: 'bg-yellow-50 text-yellow-600',
    SUCCESS: 'bg-blue-50 text-blue-600',
    FAILURE: 'bg-green-50 text-green-600',
};