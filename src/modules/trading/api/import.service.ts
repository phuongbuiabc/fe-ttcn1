import { apiClient } from '@/shared/api/api-client';
import { ApiResponse } from '@/shared/types';
import {
  PigImportInvoiceResponse,
  CreatePigImportInvoiceRequest,
} from '../model/import.model';

const ENDPOINT = '/api/v1/pig-import-invoices';

export const importService = {
  getInvoices: () =>
    apiClient.get<ApiResponse<PigImportInvoiceResponse[]>>(ENDPOINT),

  getInvoiceById: (id: string) =>
    apiClient.get<ApiResponse<PigImportInvoiceResponse>>(`${ENDPOINT}/${id}`),

  createInvoice: (data: CreatePigImportInvoiceRequest) =>
    apiClient.post<ApiResponse<PigImportInvoiceResponse>>(ENDPOINT, data),

  deleteInvoice: (id: string) =>
    apiClient.delete<ApiResponse<any>>(`${ENDPOINT}/${id}`),
};
