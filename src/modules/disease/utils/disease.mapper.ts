import {
  DiseaseResponse,
  CreateDiseaseRequest,
} from '@/modules/disease/model/disease.model';

export const mapDiseaseToForm = (
  disease: DiseaseResponse
): CreateDiseaseRequest => ({
  name: disease.name,
  diseaseType: disease.diseaseType,
  symptoms: disease.symptoms,
});