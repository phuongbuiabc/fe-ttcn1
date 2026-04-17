import { ApiClient } from "./api-client";
import { ApiResponse, SowRecord, ReproductionStats } from "@/types";

class ReproductionService {
  private client = ApiClient.getInstance();

  async getSows(): Promise<ApiResponse<SowRecord[]>> {
    return this.client.get<SowRecord[]>("/reproduction/sows");
  }

  async getStats(): Promise<ApiResponse<ReproductionStats>> {
    return this.client.get<ReproductionStats>("/reproduction/stats");
  }

  async updateSowStatus(id: string, status: string): Promise<ApiResponse<SowRecord>> {
    return this.client.put<SowRecord>(`/reproduction/sows/${id}/status`, { status });
  }

  async recordMating(id: string, data: any): Promise<ApiResponse<any>> {
    return this.client.post<any>(`/reproduction/sows/${id}/mating`, data);
  }
}

export const reproductionService = new ReproductionService();
