export interface DiseaseResponse {
  id: string;
  name: string;
  diseaseType?: string;
  symptoms?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDiseaseRequest {
  name: string;
  diseaseType?: string;
  symptoms?: string;
}

export interface UpdateDiseaseRequest {
  name?: string;
  diseaseType?: string;
  symptoms?: string;
}