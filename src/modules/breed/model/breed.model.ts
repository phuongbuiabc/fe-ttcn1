export interface BreedResponse {
  id: string;
  name: string;
  characteristics?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBreedRequest {
  name: string;
  characteristics?: string;
}

export interface UpdateBreedRequest {
  name?: string;
  characteristics?: string;
}