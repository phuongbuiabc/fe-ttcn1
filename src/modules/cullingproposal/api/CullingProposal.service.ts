import { apiClient } from "@/shared/api/api-client";
import { ApiResponse } from "@/shared/types";
import {
  CullingProposal,
  CreateCullingProposalRequest,
  UpdateCullingProposalRequest,
} from "@/modules/cullingproposal/model/CullingProposal.model";

const BASE = "/culling-proposals";

export const cullingProposalService = {
  getAll: () =>
    apiClient.get<ApiResponse<CullingProposal[]>>(BASE),

  getById: (id: string) =>
    apiClient.get<ApiResponse<CullingProposal>>(`${BASE}/${id}`),

  create: (data: CreateCullingProposalRequest) =>
    apiClient.post<ApiResponse<CullingProposal>>(BASE, data),

  update: (id: string, data: UpdateCullingProposalRequest) =>
    apiClient.put<ApiResponse<CullingProposal>>(`${BASE}/${id}`, data),

  delete: (id: string) =>
    apiClient.delete<ApiResponse<void>>(`${BASE}/${id}`),
};