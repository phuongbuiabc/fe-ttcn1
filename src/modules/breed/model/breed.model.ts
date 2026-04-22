export interface BreedResponse {
  id: string;
  breedCode: string;
  name: string;
  characteristics?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBreedRequest {
  breedCode: string;
  name: string;
  characteristics?: string;
}

export interface UpdateBreedRequest {
  name?: string;
  characteristics?: string;
}