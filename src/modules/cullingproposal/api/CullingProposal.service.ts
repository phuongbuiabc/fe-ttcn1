import { apiClient } from "@/shared/api/api-client";
import { ApiResponse } from "@/shared/types";
import {
  CullingProposalResponse,
  CreateCullingProposalRequest,
  UpdateCullingProposalRequest,
  CullingProposalReview
} from "@/modules/cullingproposal/model/CullingProposal.model";
import { CullingProposalStatus, CullingProposalType } from "@/shared/enums/cullingproposal.enum";

const BASE_URL = '/api/v1/culling-proposals';

export const cullingProposalService = {
  getAll: () =>
    apiClient.get<ApiResponse<CullingProposalResponse[]>>(`${BASE_URL}`),

  getById: (id: string) =>
    apiClient.get<ApiResponse<CullingProposalResponse>>(`${BASE_URL}/${id}`),

  getProcessed: () =>
    apiClient.get<ApiResponse<CullingProposalResponse[]>>(`${BASE_URL}/processed`),

  getByType: (proposalType: CullingProposalType) =>
    apiClient.get<ApiResponse<CullingProposalResponse[]>>(`${BASE_URL}/by-type/${proposalType}`),

  create: (data: CreateCullingProposalRequest) =>
    apiClient.post<ApiResponse<CullingProposalResponse>>(`${BASE_URL}`, data),

  createBulk: (data: CreateCullingProposalRequest[]) =>
    apiClient.post<ApiResponse<CullingProposalResponse[]>>(`${BASE_URL}/bulk`, data),

  update: (id: string, data: UpdateCullingProposalRequest) =>
    apiClient.put<ApiResponse<CullingProposalResponse>>(`${BASE_URL}/${id}`, data),

  review: (id: string, status: CullingProposalStatus) =>
    apiClient.put<ApiResponse<CullingProposalReview[]>>(`${BASE_URL}/review`, { status }),

  delete: (id: string) =>
    apiClient.delete<ApiResponse<void>>(`${BASE_URL}/${id}`),
};
