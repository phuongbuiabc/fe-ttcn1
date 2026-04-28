export interface PenPigResponse {
  id: string;
  penId: string;
  pigId: string;
  entryDate: string;
  exitDate?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePenPigRequest {
  penId: string;
  pigId: string;
  entryDate?: string;
  exitDate?: string;
  status?: string;
}

export interface UpdatePenPigRequest {
  penId?: string;
  pigId?: string;
  entryDate?: string;
  exitDate?: string;
  status?: string;
}