import { Pig } from '../model/pig.model';

export const mapApiPigToUI = (apiData: any): Pig => ({
  id: apiData.id,
  pigCode: apiData.pigCode,
  breed: apiData.species || "N/A",
  weight: apiData.birthWeight || 0,
  healthStatus: apiData.status || "N/A",
  birthDate: apiData.birthDate,
  penId: apiData.penId || "C-01",
  pen: apiData.penName || "Chuồng 1",
  status: apiData.status,
  entryDate: apiData.createdAt,
});
