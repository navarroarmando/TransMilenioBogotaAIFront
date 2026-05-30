import { useState, useEffect } from 'react';
import type { DashboardResponse } from '../services/types/dashboard.types';
import { dashboardApi } from '../services/api/dashboardApi';

export const useDashboardData = () => {
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const dashboardData = await dashboardApi.getDashboardData();
        setData(dashboardData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error loading dashboard data');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  return { data, isLoading, error };
};
