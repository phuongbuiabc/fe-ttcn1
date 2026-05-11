import { CullingProposalStatus } from "@/shared/enums/cullingproposal.enum";

export interface CullingProposalResponse {
  id: string;
  pigId: string;
  pigEarTag: string;
  proposalType: string;
  reason?: string;
  employeeId: string;
  status?: CullingProposalStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCullingProposalRequest {
  pigId: string;
  proposalType: string;
  reason?: string;
  employeeId: string;
  status?: CullingProposalStatus;
}

export interface UpdateCullingProposalRequest {
  pigId?: string;
  proposalType?: string;
  reason?: string;
  employeeId?: string;
  status?: CullingProposalStatus;
}

export interface CullingProposalReview {
  id: string;
  status: CullingProposalStatus;
}