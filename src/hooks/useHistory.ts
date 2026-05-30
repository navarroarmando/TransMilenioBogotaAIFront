import { useState, useEffect } from 'react';
import type { ExecutionSummary } from '../services/types/history.types';
import { historyApi } from '../services/api/historyApi';

export const useHistory = (params?: {
  status?: string;
  mode?: string;
  start_date?: string;
  end_date?: string;
  limit?: number;
  offset?: number;
}) => {
  const [history, setHistory] = useState<ExecutionSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const loadHistory = async () => {
      try {
        setIsLoading(true);
        const data = await historyApi.getHistory(params);
        setHistory(data.executions);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error loading history');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadHistory();
  }, [params]);
  
  return { history, isLoading, error };
};
