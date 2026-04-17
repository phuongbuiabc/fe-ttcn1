// services/warehouse.service.ts
import { apiClient } from './api-client';

export interface Warehouse {
  id: string;
  name: string;
  location: string;
  capacity: number;
}

export const warehouseService = {
  getAll: () => apiClient.request<Warehouse[]>('/api/v1/warehouses'),
  getById: (id: string) => apiClient.request<Warehouse>(`/api/v1/warehouses/${id}`),
  create: (data: Partial<Warehouse>) => 
    apiClient.request<Warehouse>('/api/v1/warehouses', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};
