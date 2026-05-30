import { useState, useEffect } from 'react';
import type { OptimizationResults } from '../services/types/optimization.types';
import { resultsApi } from '../services/api/resultsApi';

export const useResults = (executionId?: string) => {
  const [data, setData] = useState<OptimizationResults | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const loadResults = async () => {
      if (!executionId) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const results = await resultsApi.getResults(executionId);
        setData(results);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error loading results');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadResults();
  }, [executionId]);
  
  return { data, isLoading, error };
};
