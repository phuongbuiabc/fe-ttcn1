export interface CullingProposal {
  id: string;
  pigId: string;
  pigEarTag: string;
  proposalType: string;
  reason?: string;
  employeeId: string;
  status?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCullingProposalRequest {
  pigId: string;
  proposalType: string;
  reason?: string;
  employeeId: string;
  status?: string;
}

export interface UpdateCullingProposalRequest {
  pigId?: string;
  proposalType?: string;
  reason?: string;
  employeeId?: string;
  status?: string;
}