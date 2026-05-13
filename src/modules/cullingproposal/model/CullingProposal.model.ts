import { CullingProposalStatus, CullingProposalType } from "@/shared/enums/cullingproposal.enum";

export interface CullingProposalResponse {
  id: string;
  pigId: string;
  pigEarTag: string;
  proposalType: CullingProposalType;
  reason?: string;
  employeeId: string;
  employeeName: string;
  status?: CullingProposalStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCullingProposalRequest {
  pigEarTag: string;
  proposalType: CullingProposalType;
  reason?: string;
}

export interface UpdateCullingProposalRequest {
  pigId?: string;
  proposalType?: CullingProposalType;
  reason?: string;
  employeeName?: string;
  status?: CullingProposalStatus;
}

export interface CullingProposalReview {
  id: string;
  status: CullingProposalStatus;
}