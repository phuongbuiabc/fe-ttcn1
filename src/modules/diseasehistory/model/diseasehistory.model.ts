export interface DiseaseHistoryResponse {
  id: string;
  pigId: string;
  pigEarTag?: string;
  diseaseName?: string;
  sickDate?: string;
  recoveryDate?: string;
  severity?: string;
  expectedTreatmentDays?: number;
  status?: string;
  note?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDiseaseHistoryRequest {
  pigId: string;
  diseaseName?: string;
  sickDate?: string;
  recoveryDate?: string;
  severity?: string;
  expectedTreatmentDays?: number;
  status?: string;
  note?: string;
}

export interface UpdateDiseaseHistoryRequest {
  pigId?: string;
  diseaseName?: string;
  sickDate?: string;
  recoveryDate?: string;
  severity?: string;
  expectedTreatmentDays?: number;
  status?: string;
  note?: string;
}