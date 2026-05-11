import { apiClient } from "@/shared/api/api-client";
import { ApiResponse } from "@/shared/types";
import {
  CullingProposalResponse,
  CreateCullingProposalRequest,
  UpdateCullingProposalRequest,
  CullingProposalReview
} from "@/modules/cullingproposal/model/CullingProposal.model";

const BASE = '/api/v1/culling-proposals';

export const cullingProposalService = {
  getAll: () =>
    apiClient.get<ApiResponse<CullingProposalResponse[]>>(`${BASE}`),

  getById: (id: string) =>
    apiClient.get<ApiResponse<CullingProposalResponse>>(`${BASE}/${id}`),

  getProcessed: () =>
    apiClient.get<ApiResponse<CullingProposalResponse[]>>(`${BASE}/processed`),

  getByType: (proposalType: string) =>
    apiClient.get<ApiResponse<CullingProposalResponse[]>>(`${BASE}/by-type/${proposalType}`),

  create: (data: CreateCullingProposalRequest) =>
    apiClient.post<ApiResponse<CullingProposalResponse>>(`${BASE}`, data),

  update: (id: string, data: UpdateCullingProposalRequest) =>
    apiClient.put<ApiResponse<CullingProposalResponse>>(`${BASE}/${id}`, data),

  review: (id: string, status: string) =>
    apiClient.put<ApiResponse<CullingProposalReview[]>>(`${BASE}/review`, { status }),

  delete: (id: string) =>
    apiClient.delete<ApiResponse<void>>(`${BASE}/${id}`),
};