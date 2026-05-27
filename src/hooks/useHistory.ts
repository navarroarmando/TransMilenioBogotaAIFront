import { useState, useEffect } from 'react';
import type { Execution } from '../services/types/optimization.types';
import { MockOptimizationRepository } from '../services/mock/optimizationRepositoryMock';

export const useHistory = () => {
  const [history, setHistory] = useState<Execution[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const repository = new MockOptimizationRepository();
  
  useEffect(() => {
    const loadHistory = async () => {
      try {
        setIsLoading(true);
        const data = await repository.getHistory();
        setHistory(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error loading history');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadHistory();
  }, []);
  
  return { history, isLoading, error };
};
