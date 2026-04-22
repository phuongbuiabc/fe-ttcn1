export interface DiseaseResponse {
  id: string;
  diseaseCode: string;
  name: string;
  diseaseType?: string;
  symptoms?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDiseaseRequest {
  diseaseCode: string;
  name: string;
  diseaseType?: string;
  symptoms?: string;
}

export interface UpdateDiseaseRequest {
  diseaseCode?: string;
  name?: string;
  diseaseType?: string;
  symptoms?: string;
}