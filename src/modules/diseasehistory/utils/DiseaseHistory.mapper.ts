import { DiseaseHistoryStatus } from '@/shared/enums/diseasehistory.enum';

export const mapDiseaseHistoryStatus = (status?: DiseaseHistoryStatus) => {
    switch (status) {
        case DiseaseHistoryStatus.ACTIVE:
            return 'Đang mắc bệnh';
        case DiseaseHistoryStatus.RECOVERED:
            return 'Đã khỏi bệnh';
        case DiseaseHistoryStatus.DECEASED:
            return 'Đã chết';
        default:
            return '--';
    }
}