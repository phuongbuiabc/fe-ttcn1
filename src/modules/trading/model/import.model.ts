import { PigType } from '@/shared/enums/pig.enum';

export interface CreatePigImportInvoiceDetailPigRequest {
  earTag: string;
  nippleCount: number;
  birthWeight: number;
  birthDate: string;
  penId: string;
}

export interface CreatePigImportInvoiceDetailRequest {
  breedId: string;
  breedName: string;
  type: PigType | string;
  quantity: number;
  unitPrice: number;
  pigs: CreatePigImportInvoiceDetailPigRequest[];
}

export interface CreatePigImportInvoiceRequest {
  invoiceCode: string;
  supplierId: string | null;
  supplierName: string;
  importDate: string;
  details: CreatePigImportInvoiceDetailRequest[];
}

export interface PigImportInvoiceDetailPigResponse {
  id: string;
  detailId: string;
  pigId: string;
  earTag: string;
  penId: string;
}

export interface PigImportInvoiceDetailResponse {
  id: string;
  invoiceId: string;
  breedId: string;
  breedName: string;
  type: PigType | string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  pigs: PigImportInvoiceDetailPigResponse[];
  createdAt: string;
  updatedAt: string;
}

export interface PigImportInvoiceResponse {
  id: string;
  invoiceCode: string;
  supplierId: string | null;
  supplierName: string;
  importDate: string;
  totalQuantity: number;
  totalAmount: number;
  details: PigImportInvoiceDetailResponse[];
  createdAt: string;
  updatedAt: string;
}
