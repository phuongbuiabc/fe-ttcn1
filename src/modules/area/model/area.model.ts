export interface Area {
  id: string;
  areaCode: string;
  name: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateAreaRequest {
  name: string;
  description?: string;
}
