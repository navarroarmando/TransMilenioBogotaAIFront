import { useState, useEffect } from 'react';
import type { OptimizationResults } from '../services/types/optimization.types';
import { MockOptimizationRepository } from '../services/mock/optimizationRepositoryMock';

export const useDashboardData = () => {
  const [data, setData] = useState<OptimizationResults | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const repository = new MockOptimizationRepository();
  
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const results = await repository.getResults('latest');
        setData(results);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error loading data');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  return { data, isLoading, error };
};
