import {
  DiseaseResponse,
  CreateDiseaseRequest,
} from '../model/disease.model';

export const mapDiseaseToForm = (
  disease: DiseaseResponse
): CreateDiseaseRequest => ({
  diseaseCode: disease.diseaseCode,
  name: disease.name,
  diseaseType: disease.diseaseType,
  symptoms: disease.symptoms,
});