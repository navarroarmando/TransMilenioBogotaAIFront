import { useState, useCallback, useRef, useEffect } from 'react';
import type { OptimizationParams, OptimizationResults, OptimizationStatus } from '../services/types/optimization.types';
import { optimizationApi } from '../services/api/optimizationApi';
import { mockOperationalParams, mockGAParams, mockFitnessWeights, mockVisualizationConfig, mockBusinessConfig, mockParallelConfig, mockOutputConfig } from '../services/mock/optimizationMock';

interface WebSocketLog {
  timestamp: string;
  level: string;
  source: string;
  type: string;
  message: string;
}

export const useOptimization = () => {
  const [params, setParams] = useState<OptimizationParams>({
    mode: 'individual',
    parameters: mockGAParams,
    fitness_weights: mockFitnessWeights,
    operational: mockOperationalParams,
    visualization_config: mockVisualizationConfig,
    business_config: mockBusinessConfig,
    parallel_config: mockParallelConfig,
    output_config: mockOutputConfig
  });
  const [isRunning, setIsRunning] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<OptimizationResults | null>(null);
  const [executionId, setExecutionId] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  
  const addLog = useCallback((message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `[${timestamp}] ${message}`]);
  }, []);
  
  const updateParams = useCallback((newParams: Partial<OptimizationParams>) => {
    setParams(prev => ({ ...prev, ...newParams }));
  }, []);

  const processLog = useCallback((log: WebSocketLog) => {
    // Extraer progreso del mensaje
    if (log.message.includes('[progreso]')) {
      const match = log.message.match(/\[progreso\]\s*(\d+)%/);
      if (match) {
        const progressValue = parseInt(match[1]);
        setProgress(progressValue);
        
        // Si el progreso llega a 100%, marcar como completado
        if (progressValue === 100) {
          setIsCompleted(true);
          setIsRunning(false);
        }
      }
    }

    // Agregar log a la lista
    const timestamp = new Date(log.timestamp).toLocaleTimeString();
    setLogs(prev => [...prev, `[${timestamp}] [${log.level.toUpperCase()}] ${log.message}`]);
  }, []);
  
  const startOptimization = useCallback(async () => {
    try {
      setIsRunning(true);
      setIsCompleted(false);
      setProgress(0);
      setLogs([]);
      setResults(null);
      
      addLog('Iniciando optimización...');
      addLog(`Parámetros operativos: ${JSON.stringify(params.operational).substring(0, 50)}...`);
      addLog(`Parámetros AG: población=${params.parameters.population_size}, generaciones=${params.parameters.generations}`);
      
      const response = await optimizationApi.startOptimization({
        config: params
      });
      
      console.log('useOptimization - Response:', response);
      console.log('useOptimization - executionId:', response.execution_id);
      console.log('useOptimization - websocket_url:', response.websocket_url);
      
      setExecutionId(response.execution_id);
      localStorage.setItem('last_execution_id', response.execution_id);
      console.log('useOptimization - Saved to localStorage:', localStorage.getItem('last_execution_id'));
      addLog(`Optimización iniciada con ID: ${response.execution_id}`);
      
      // Conectar al WebSocket si se proporciona URL
      if (response.websocket_url) {
        connectWebSocket(response.websocket_url);
      } else {
        // Fallback a polling si no hay WebSocket
        pollStatus(response.execution_id);
      }
      
    } catch (error) {
      addLog(`Error: ${error instanceof Error ? error.message : 'Error desconocido'}`);
      setIsRunning(false);
    }
  }, [params, addLog, processLog]);

  const connectWebSocket = useCallback((websocketUrl: string) => {
    try {
      const ws = new WebSocket(websocketUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('WebSocket conectado');
        addLog('Conectado al streaming de logs en tiempo real');
      };

      ws.onmessage = (event) => {
        try {
          const log: WebSocketLog = JSON.parse(event.data);
          processLog(log);

          // Verificar si la optimización se completó
          if (log.message.includes('100%') && log.message.includes('completada')) {
            setIsRunning(false);
            setIsCompleted(true);
            addLog('Optimización completada exitosamente');
            ws.close();
          }
        } catch (error) {
          console.error('Error al procesar mensaje WebSocket:', error);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        addLog('Error en conexión WebSocket, cambiando a polling...');
        ws.close();
        // Fallback a polling
        if (executionId) {
          pollStatus(executionId);
        }
      };

      ws.onclose = () => {
        console.log('WebSocket desconectado');
        if (isRunning && progress < 100) {
          addLog('Conexión WebSocket cerrada, cambiando a polling...');
          if (executionId) {
            pollStatus(executionId);
          }
        }
      };
    } catch (error) {
      console.error('Error al conectar WebSocket:', error);
      addLog('Error al conectar WebSocket, usando polling...');
      if (executionId) {
        pollStatus(executionId);
      }
    }
  }, [addLog, processLog, executionId, isRunning, progress]);
  
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
            setIsCompleted(true);
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
    // Cerrar WebSocket si está conectado
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

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

  // Limpiar WebSocket al desmontar
  useEffect(() => {
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);
  
  return {
    params,
    isRunning,
    isCompleted,
    logs,
    progress,
    results,
    executionId,
    updateParams,
    startOptimization,
    stopOptimization
  };
};
