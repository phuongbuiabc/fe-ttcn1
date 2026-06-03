import { WeightDistribution } from '@/modules/dashboard/model/weightdistribution.model';
import { FeedConsumption } from '@/modules/dashboard/model/feedconsumption.model';
import { Summary } from '@/modules/dashboard/model/summary.model';
import { MatingSuccessRate } from '@/modules/dashboard/model/matingsuccessrate.model';
import { MonthlyImportCost } from '@/modules/dashboard/model/monthlyimportcost.model';
import { MonthlyRevenue } from '@/modules/dashboard/model/monthlyrevenue.model';
import { SurvivalRate } from '@/modules/dashboard/model/survivalrate.model';
import { apiClient } from '@/shared/api/api-client';
import { ApiResponse } from '@/shared/types';

const BASE_URL = '/api/v1/dashboard';

export const dashboardService = {
  getWeightDistribution: () =>
    apiClient.get<ApiResponse<WeightDistribution[]>>(`${BASE_URL}/weight-distribution`),

  getSurvivalRate: () =>
    apiClient.get<ApiResponse<SurvivalRate[]>>(`${BASE_URL}/survival-rate`),

  getSummary: () =>
    apiClient.get<ApiResponse<Summary>>(`${BASE_URL}/summary`),

  getMonthlyRevenue: (year: number) =>
    apiClient.get<ApiResponse<MonthlyRevenue[]>>(`${BASE_URL}/monthly-revenue`, { params: { year } }),

  getMonthlyImportCost: (year: number) =>
    apiClient.get<ApiResponse<MonthlyImportCost[]>>(`${BASE_URL}/monthly-import-cost`, { params: { year } }),

  getMatingSuccessRate: () =>
    apiClient.get<ApiResponse<MatingSuccessRate>>(`${BASE_URL}/mating-success-rate`),

  getFeedConsumption: (weekStart: string) =>
    apiClient.get<ApiResponse<FeedConsumption[]>>(`${BASE_URL}/feed-consumption`, { params: { weekStart } }),
};