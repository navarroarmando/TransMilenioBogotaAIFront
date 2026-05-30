import { useState, useCallback } from 'react';
import type { OptimizationParams, OptimizationResults, OptimizationStatus } from '../services/types/optimization.types';
import { optimizationApi } from '../services/api/optimizationApi';
import { mockOperationalParams, mockGAParams, mockFitnessWeights } from '../services/mock/optimizationMock';

export const useOptimization = () => {
  const [params, setParams] = useState<OptimizationParams>({
    mode: 'individual',
    parameters: mockGAParams,
    fitness_weights: mockFitnessWeights,
    operational: mockOperationalParams
  });
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<OptimizationResults | null>(null);
  const [executionId, setExecutionId] = useState<string | null>(null);
  
  const addLog = useCallback((message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `[${timestamp}] ${message}`]);
  }, []);
  
  const updateParams = useCallback((newParams: Partial<OptimizationParams>) => {
    setParams(prev => ({ ...prev, ...newParams }));
  }, []);
  
  const startOptimization = useCallback(async () => {
    try {
      setIsRunning(true);
      setProgress(0);
      setLogs([]);
      setResults(null);
      
      addLog('Iniciando optimización...');
      addLog(`Parámetros operativos: ${JSON.stringify(params.operational).substring(0, 50)}...`);
      addLog(`Parámetros AG: población=${params.parameters.population_size}, generaciones=${params.parameters.generations}`);
      
      const response = await optimizationApi.startOptimization({
        config: params
      });
      
      setExecutionId(response.execution_id);
      addLog(`Optimización iniciada con ID: ${response.execution_id}`);
      
      // Start polling for status
      pollStatus(response.execution_id);
      
    } catch (error) {
      addLog(`Error: ${error instanceof Error ? error.message : 'Error desconocido'}`);
      setIsRunning(false);
    }
  }, [params, addLog]);
  
  const pollStatus = useCallback(async (id: string) => {
    const pollInterval = setInterval(async () => {
      try {
        const status: OptimizationStatus = await optimizationApi.getOptimizationStatus(id);
        setProgress(status.progress);
        
        if (status.current_generation && status.total_generations) {
          addLog(`Generación ${status.current_generation}/${status.total_generations} - Mejor fitness: ${status.best_fitness?.toFixed(4) || 'N/A'}`);
        }
        
        if (status.status === 'completed' || status.status === 'failed') {
          clearInterval(pollInterval);
          setIsRunning(false);
          
          if (status.status === 'completed') {
            addLog('Optimización completada exitosamente');
          } else {
            addLog('Optimización fallida');
          }
        }
      } catch (error) {
        addLog(`Error al obtener estado: ${error instanceof Error ? error.message : 'Error desconocido'}`);
        clearInterval(pollInterval);
        setIsRunning(false);
      }
    }, 1000);
  }, [addLog]);
  
  const stopOptimization = useCallback(async () => {
    if (executionId) {
      try {
        await optimizationApi.cancelOptimization(executionId);
        addLog('Optimización detenida por el usuario');
      } catch (error) {
        addLog(`Error al detener: ${error instanceof Error ? error.message : 'Error desconocido'}`);
      }
    }
    setIsRunning(false);
  }, [executionId, addLog]);
  
  return {
    params,
    isRunning,
    logs,
    progress,
    results,
    executionId,
    updateParams,
    startOptimization,
    stopOptimization
  };
};
