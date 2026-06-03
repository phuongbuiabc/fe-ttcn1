import { useState, useCallback } from 'react';
import { dashboardService } from '../api/dashboard.service';
import { WeightDistribution } from '../model/weightdistribution.model';
import { SurvivalRate } from '../model/survivalrate.model';
import { Summary } from '../model/summary.model';
import { MonthlyRevenue } from '../model/monthlyrevenue.model';
import { MonthlyImportCost } from '../model/monthlyimportcost.model';
import { MatingSuccessRate } from '../model/matingsuccessrate.model';
import { FeedConsumption } from '../model/feedconsumption.model';
import { MonthlyLiveBirths } from '../model/monthlylivebirths';

export function useDashboard() {
  const [weightDistribution, setWeightDistribution] = useState<WeightDistribution[]>([]);
  const [survivalRate, setSurvivalRate] = useState<SurvivalRate | null>(null);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [monthlyLiveBirths, setMonthlyLiveBirths] = useState<MonthlyLiveBirths[]>([]);
  const [monthlyRevenue, setMonthlyRevenue] = useState<MonthlyRevenue[]>([]);
  const [monthlyImportCost, setMonthlyImportCost] = useState<MonthlyImportCost[]>([]);
  const [matingSuccessRate, setMatingSuccessRate] = useState<MatingSuccessRate | null>(null);
  const [feedConsumption, setFeedConsumption] = useState<FeedConsumption[]>([]);

  const [loadingWeightDistribution, setLoadingWeightDistribution] = useState(false);
  const [loadingSurvivalRate, setLoadingSurvivalRate] = useState(false);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [loadingMonthlyLiveBirths, setLoadingMonthlyLiveBirths] = useState(false);
  const [loadingMonthlyRevenue, setLoadingMonthlyRevenue] = useState(false);
  const [loadingMonthlyImportCost, setLoadingMonthlyImportCost] = useState(false);
  const [loadingMatingSuccessRate, setLoadingMatingSuccessRate] = useState(false);
  const [loadingFeedConsumption, setLoadingFeedConsumption] = useState(false);

  const fetchWeightDistribution = useCallback(async () => {
    setLoadingWeightDistribution(true);
    try {
      const res = await dashboardService.getWeightDistribution();
      if (res.success) {
        setWeightDistribution(res.data || []);
      }
    } finally {
      setLoadingWeightDistribution(false);
    }
  }, []);

  const fetchSurvivalRate = useCallback(async () => {
    setLoadingSurvivalRate(true);
    try {
      const res = await dashboardService.getSurvivalRate();
      if (res.success) {
        setSurvivalRate(res.data || null);
      }
    } finally {
      setLoadingSurvivalRate(false);
    }
  }, []);

  const fetchSummary = useCallback(async () => {
    setLoadingSummary(true);
    try {
      const res = await dashboardService.getSummary();
      if (res.success) {
        setSummary(res.data || null);
      }
    } finally {
      setLoadingSummary(false);
    }
  }, []);

  const fetchMonthlyLiveBirths = useCallback(async (year: number) => {
    setLoadingMonthlyLiveBirths(true);
    try {
      const res = await dashboardService.getMonthlyLiveBirths(year);
      if (res.success) {
        setMonthlyLiveBirths(res.data || []);
      }
    } finally {
      setLoadingMonthlyLiveBirths(false);
    }
  }, []);

  const fetchMonthlyRevenue = useCallback(async (year: number) => {
    setLoadingMonthlyRevenue(true);
    try {
      const res = await dashboardService.getMonthlyRevenue(year);
      if (res.success) {
        setMonthlyRevenue(res.data || []);
      }
    } finally {
      setLoadingMonthlyRevenue(false);
    }
  }, []);

  const fetchMonthlyImportCost = useCallback(async (year: number) => {
    setLoadingMonthlyImportCost(true);
    try {
      const res = await dashboardService.getMonthlyImportCost(year);
      if (res.success) {
        setMonthlyImportCost(res.data || []);
      }
    } finally {
      setLoadingMonthlyImportCost(false);
    }
  }, []);

  const fetchMatingSuccessRate = useCallback(async () => {
    setLoadingMatingSuccessRate(true);
    try {
      const res = await dashboardService.getMatingSuccessRate();
      if (res.success) {
        setMatingSuccessRate(res.data || null);
      }
    } finally {
      setLoadingMatingSuccessRate(false);
    }
  }, []);

  const fetchFeedConsumption = useCallback(async (weekStart: string) => {
    setLoadingFeedConsumption(true);
    try {
      const res = await dashboardService.getFeedConsumption(weekStart);
      if (res.success) {
        setFeedConsumption(res.data || []);
      }
    } finally {
      setLoadingFeedConsumption(false);
    }
  }, []);

  return {
    weightDistribution,
    survivalRate,
    summary,
    monthlyLiveBirths,
    monthlyRevenue,
    monthlyImportCost,
    matingSuccessRate,
    feedConsumption,
    loadingWeightDistribution,
    loadingSurvivalRate,
    loadingSummary,
    loadingMonthlyLiveBirths,
    loadingMonthlyRevenue,
    loadingMonthlyImportCost,
    loadingMatingSuccessRate,
    loadingFeedConsumption,
    fetchWeightDistribution,
    fetchSurvivalRate,
    fetchSummary,
    fetchMonthlyLiveBirths,
    fetchMonthlyRevenue,
    fetchMonthlyImportCost,
    fetchMatingSuccessRate,
    fetchFeedConsumption,
  };
}
