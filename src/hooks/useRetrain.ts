import { useState, useCallback, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { OptimizationParams } from '../services/types/optimization.types';

interface WebSocketLog {
  timestamp: string;
  level: string;
  source: string;
  type: string;
  message: string;
}

interface RetrainParams {
  checkpoint_path: string;
  additional_generations: number;
  config?: OptimizationParams;
}

export const useRetrain = () => {
  const navigate = useNavigate();
  const [isRunning, setIsRunning] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [executionId, setExecutionId] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  
  const addLog = useCallback((message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `[${timestamp}] ${message}`]);
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
  
  const startRetrain = useCallback(async (params: RetrainParams) => {
    try {
      setIsRunning(true);
      setIsCompleted(false);
      setProgress(0);
      setLogs([]);
      
      addLog('Iniciando reentrenamiento...');
      addLog(`Checkpoint: ${params.checkpoint_path}`);
      addLog(`Generaciones adicionales: ${params.additional_generations}`);
      
      const response = await fetch('http://127.0.0.1:8000/api/v1/optimization/retrain', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
        body: JSON.stringify({
          checkpoint_path: params.checkpoint_path,
          additional_generations: params.additional_generations,
          config: params.config,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Error al iniciar reentrenamiento');
      }
      
      const data = await response.json();
      
      console.log('useRetrain - Response:', data);
      console.log('useRetrain - executionId:', data.execution_id);
      console.log('useRetrain - websocket_url:', data.websocket_url);
      
      setExecutionId(data.execution_id);
      localStorage.setItem('last_execution_id', data.execution_id);
      addLog(`Reentrenamiento iniciado con ID: ${data.execution_id}`);
      
      // Conectar al WebSocket
      connectWebSocket(data.websocket_url);
      
    } catch (error) {
      addLog(`Error: ${error instanceof Error ? error.message : 'Error desconocido'}`);
      setIsRunning(false);
    }
  }, [addLog, processLog]);

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
            addLog('Reentrenamiento completado exitosamente');
            ws.close();
          }
        } catch (error) {
          console.error('Error al procesar mensaje WebSocket:', error);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        addLog('Error en conexión WebSocket');
        ws.close();
      };

      ws.onclose = () => {
        console.log('WebSocket desconectado');
      };
    } catch (error) {
      console.error('Error al conectar WebSocket:', error);
      addLog('Error al conectar WebSocket');
    }
  }, [addLog, processLog]);
  
  const stopRetrain = useCallback(async () => {
    // Cerrar WebSocket si está conectado
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    setIsRunning(false);
  }, [addLog]);

  // Limpiar WebSocket al desmontar
  useEffect(() => {
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);
  
  return {
    isRunning,
    isCompleted,
    logs,
    progress,
    executionId,
    startRetrain,
    stopRetrain
  };
};
