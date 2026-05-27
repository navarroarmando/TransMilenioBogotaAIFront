import { useState, useCallback } from 'react';
import type { OptimizationParams, OptimizationResults } from '../services/types/optimization.types';
import { MockOptimizationRepository } from '../services/mock/optimizationRepositoryMock';
import { mockOperationalParams, mockGAParams, mockFitnessWeights } from '../services/mock/optimizationMock';

export const useOptimization = () => {
  const [params, setParams] = useState<OptimizationParams>({
    operational: mockOperationalParams,
    ga: mockGAParams,
    fitness_weights: mockFitnessWeights
  });
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<OptimizationResults | null>(null);
  
  const repository = new MockOptimizationRepository();
  
  const addLog = useCallback((message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `[${timestamp}] ${message}`]);
  }, []);
  
  const updateParams = useCallback((newParams: Partial<OptimizationParams>) => {
    setParams(prev => ({ ...prev, ...newParams }));
  }, []);
  
  const startOptimization = useCallback(async () => {
    setIsRunning(true);
    setProgress(0);
    setLogs([]);
    setResults(null);
    
    addLog('Iniciando optimización...');
    addLog(`Parámetros operativos: ${JSON.stringify(params.operational).substring(0, 50)}...`);
    addLog(`Parámetros AG: población=${params.ga.population_size}, generaciones=${params.ga.generations}`);
    
    const totalSteps = 10;
    for (let i = 1; i <= totalSteps; i++) {
      await new Promise(resolve => setTimeout(resolve, 200));
      setProgress((i / totalSteps) * 100);
      addLog(`Generación ${i * 30}/${params.ga.generations} - Mejor fitness: ${(0.7 + Math.random() * 0.2).toFixed(4)}`);
    }
    
    addLog('Optimización completada exitosamente');
    
    try {
      const optimizationResults = await repository.executeOptimization(params);
      setResults(optimizationResults);
      addLog(`Resultados generados: ${optimizationResults.routes.length} rutas`);
    } catch (error) {
      addLog(`Error: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    } finally {
      setIsRunning(false);
    }
  }, [params, repository, addLog]);
  
  const stopOptimization = useCallback(() => {
    setIsRunning(false);
    addLog('Optimización detenida por el usuario');
  }, [addLog]);
  
  return {
    params,
    isRunning,
    logs,
    progress,
    results,
    updateParams,
    startOptimization,
    stopOptimization
  };
};
