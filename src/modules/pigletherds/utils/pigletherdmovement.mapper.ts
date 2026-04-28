import { PigletHerdMovementType } from '@/shared/enums/pigletherd.enum';
import { PigletHerdMovement } from '../model/pigletherdmovement.model';

export const MOVEMENT_TYPE_OPTIONS = {
    [PigletHerdMovementType.SPLIT]: 'Tách đàn',
    [PigletHerdMovementType.MERGE]: 'Gộp đàn',
    [PigletHerdMovementType.INCREASE]: 'Tăng đàn',
    [PigletHerdMovementType.DECREASE]: 'Giảm đàn',
}