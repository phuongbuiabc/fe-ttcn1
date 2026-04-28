export interface PigletHerdMovement {
  id: string;
  herdId: string;
  movementType: string;
  sourceHerdId?: string;
  targetHerdId?: string;
  movementDate: string;
  quantity: number;
  reason?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type CreatePigletHerdMovementRequest = {
  herdId: string;
  movementType: string;
  sourceHerdId?: string;
  targetHerdId?: string;
  movementDate: string;
  quantity: number;
  reason?: string;
};

export type UpdatePigletHerdMovementRequest =
  Partial<CreatePigletHerdMovementRequest>;