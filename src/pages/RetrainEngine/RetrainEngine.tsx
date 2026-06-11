import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useRetrain } from '../../hooks/useRetrain';
import { useHistory } from '../../hooks/useHistory';
import { resultsApi } from '../../services/api/resultsApi';
import ProgressIndicator from '../../components/shared/ProgressIndicator';
import ExecutionLogs from '../../components/shared/ExecutionLogs';
import OperationalParams from '../OptimizationEngine/OperationalParams';
import GAParams from '../OptimizationEngine/GAParams';
import FitnessSliders from '../OptimizationEngine/FitnessSliders';
import VisualizationParams from '../OptimizationEngine/VisualizationParams';
import BusinessParams from '../OptimizationEngine/BusinessParams';
import { Square, ArrowRight, RefreshCw } from 'lucide-react';
import type { OptimizationParams } from '../../services/types/optimization.types';
import type { ExecutionSummary } from '../../services/types/history.types';

const RetrainEngineContainer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isRunning, isCompleted, logs, progress, startRetrain, stopRetrain } = useRetrain();
  const historyParams = useMemo(() => ({ status: 'completed' }), []);
  const { history: executions } = useHistory(historyParams);
  const [selectedExecution, setSelectedExecution] = useState<ExecutionSummary | null>(null);
  const [checkpointPath, setCheckpointPath] = useState<string | null>(null);
  const [additionalGenerations, setAdditionalGenerations] = useState(10);
  const [params, setParams] = useState<OptimizationParams>({
    operational: {
      service_hours_start: 5,
      service_hours_end: 23,
      time_slot_interval: 30,
      num_routes_per_slot: 10,
      enable_time_slots: true
    },
    parameters: {
      population_size: 100,
      generations: 50,
      mutation_rate: 0.1,
      crossover_rate: 0.9,
      elitism_count: 5,
      tournament_size: 3,
      min_route_length: 5,
      max_route_length: 30,
      distance_bias_km: [{ min: 0, max: 5, weight: 1.0 }],
      enable_dijkstra_decoding: true,
      max_travel_time_min: 60,
      bus_capacity: 80,
      checkpoint_interval: 10,
      log_interval: 1,
      demand_sample_ratio: 1.0,
      demand_filter_threshold: 0,
      enable_numpy_vectorization: true,
      enable_spatial_index: true,
      enable_performance_timer: false,
      enable_connectivity_validation: true,
      connectivity_penalty: 1000
    },
    fitness_weights: {
      efficiency: 0.15,
      economy: 0.15,
      equity: 0.1,
      coverage: 0.15,
      transfers: 0.1,
      speed: 0.1,
      speed_max: 0.05,
      road_capacity: 0.05,
      road_class: 0.05,
      travel_time_real: 0.05,
      operating_cost: 0.05,
      frequency: 0.05,
      accessibility: 0.05,
      bus_type_compatibility: 0.05,
      population_density: 0.05,
      redundancy: 0.05
    },
    visualization_config: {
      visualization_graph: 'integrated_osm',
      enable_visualization: true
    },
    business_config: {
      morning_peak_start: 7,
      morning_peak_end: 9,
      afternoon_peak_start: 17,
      afternoon_peak_end: 19,
      peak_hour_speed_factor: 0.7,
      urban_default_speed: 30,
      highway_default_speed: 60,
      trunk_default_speed: 40,
      residential_default_speed: 20,
      max_speed: 80,
      crs_target: 'EPSG:4326',
      crs_source: 'EPSG:4326',
      min_stops: 10,
      max_stops: 50,
      min_routes_per_stop: 2,
      max_distance: 20000,
      min_distance: 1000,
      demand_default: 100,
      demand_min_threshold: 10,
      demand_max_threshold: 1000,
      demand_peak_hour_factor: 1.5,
      stratification_default: 3,
      stratification_buckets: null,
      stratification_weights: null,
      max_transfers: 3,
      transfer_average_time: 5,
      coverage_stop_radius: 500,
      coverage_min: 0.7,
      coverage_target: 0.9
    },
    mode: 'individual'
  });
  const [_hasSelectedExecution, _setHasSelectedExecution] = useState(false);

  // Cargar ejecución pre-seleccionada si viene de historial
  useEffect(() => {
    const state = location.state as { selectedExecutionId?: string };
    if (state?.selectedExecutionId) {
      const exec = executions.find(e => e.execution_id === state.selectedExecutionId);
      if (exec) {
        setSelectedExecution(exec);
        _setHasSelectedExecution(true);
        // Aquí cargaríamos los parámetros del endpoint
        loadExecutionParams(state.selectedExecutionId);
      }
    }
  }, [location.state, executions]);

  const loadExecutionParams = async (executionId: string) => {
    try {
      const results = await resultsApi.getResults(executionId);
      console.log('Estructura de resultados del backend:', results);
      
      // Mapear la configuración del backend al formato del frontend
      if (results.ga_config) {
        const gaConfig = results.ga_config;
        setParams(prev => {
          // Convertir distance_bias_km al formato correcto si viene como objeto simple
          let distanceBias = prev.parameters.distance_bias_km;
          if (gaConfig.distance_bias_km) {
            if (Array.isArray(gaConfig.distance_bias_km)) {
              distanceBias = gaConfig.distance_bias_km;
            } else if (typeof gaConfig.distance_bias_km === 'object') {
              // Si viene como objeto simple {min, max, weight}, convertir a array
              distanceBias = [gaConfig.distance_bias_km];
            } else if (typeof gaConfig.distance_bias_km === 'number') {
              // Si viene como número simple, crear un rango por defecto
              distanceBias = [{ min: 0, max: gaConfig.distance_bias_km, weight: 1.0 }];
            }
          }

          return {
            ...prev,
            parameters: {
              ...prev.parameters,
              population_size: gaConfig.population_size || prev.parameters.population_size,
              generations: gaConfig.generations || prev.parameters.generations,
              mutation_rate: gaConfig.mutation_rate || prev.parameters.mutation_rate,
              crossover_rate: gaConfig.crossover_rate || prev.parameters.crossover_rate,
              elitism_count: gaConfig.elitism_count || prev.parameters.elitism_count,
              tournament_size: gaConfig.tournament_size || prev.parameters.tournament_size,
              min_route_length: gaConfig.min_route_length || prev.parameters.min_route_length,
              max_route_length: gaConfig.max_route_length || prev.parameters.max_route_length,
              distance_bias_km: distanceBias,
              enable_dijkstra_decoding: gaConfig.enable_dijkstra_decoding ?? prev.parameters.enable_dijkstra_decoding,
              max_travel_time_min: gaConfig.max_travel_time_min || prev.parameters.max_travel_time_min
            }
          };
        });
      }
      
      if (results.operational_config) {
        const operationalConfig = results.operational_config;
        setParams(prev => ({
          ...prev,
          operational: {
            service_hours_start: operationalConfig.service_hours_start || prev.operational.service_hours_start,
            service_hours_end: operationalConfig.service_hours_end || prev.operational.service_hours_end,
            time_slot_interval: operationalConfig.time_slot_interval || prev.operational.time_slot_interval,
            num_routes_per_slot: operationalConfig.num_routes_per_slot || prev.operational.num_routes_per_slot,
            enable_time_slots: operationalConfig.enable_time_slots ?? prev.operational.enable_time_slots
          },
          parameters: {
            ...prev.parameters,
            bus_capacity: operationalConfig.bus_capacity || prev.parameters.bus_capacity
          }
        }));
      }
      
      if (results.technical_config) {
        const technicalConfig = results.technical_config;
        setParams(prev => ({
          ...prev,
          parameters: {
            ...prev.parameters,
            checkpoint_interval: technicalConfig.checkpoint_interval || prev.parameters.checkpoint_interval,
            log_interval: technicalConfig.log_interval || prev.parameters.log_interval,
            demand_sample_ratio: technicalConfig.demand_sample_ratio || prev.parameters.demand_sample_ratio,
            demand_filter_threshold: technicalConfig.demand_filter_threshold || prev.parameters.demand_filter_threshold,
            enable_numpy_vectorization: technicalConfig.enable_numpy_vectorization ?? prev.parameters.enable_numpy_vectorization,
            enable_spatial_index: technicalConfig.enable_spatial_index ?? prev.parameters.enable_spatial_index,
            enable_performance_timer: technicalConfig.enable_performance_timer ?? prev.parameters.enable_performance_timer
          },
          visualization_config: {
            visualization_graph: technicalConfig.visualization_graph || (prev.visualization_config?.visualization_graph || 'integrated_osm'),
            enable_visualization: technicalConfig.enable_visualization ?? (prev.visualization_config?.enable_visualization ?? true)
          }
        }));
      }
      
      if (results.fitness_weights) {
        const fitnessWeights = results.fitness_weights;
        setParams(prev => {
          // Calcular la suma de los 6 pesos del backend
          const backendSum = 
            (fitnessWeights.efficiency || 0) +
            (fitnessWeights.economy || 0) +
            (fitnessWeights.equity || 0) +
            (fitnessWeights.coverage || 0) +
            (fitnessWeights.transfers || 0) +
            (fitnessWeights.speed || 0);
          
          // Calcular el remainder para completar 100%
          const remainder = Math.max(0, 1 - backendSum);
          
          // Distribuir el remainder entre los 9 campos faltantes
          const missingFields = [
            'speed_max', 'road_capacity', 'road_class', 'travel_time_real',
            'operating_cost', 'frequency', 'accessibility', 'bus_type_compatibility',
            'population_density', 'redundancy'
          ];
          const defaultValue = remainder / missingFields.length;

          return {
            ...prev,
            fitness_weights: {
              ...prev.fitness_weights,
              efficiency: fitnessWeights.efficiency !== undefined ? fitnessWeights.efficiency : prev.fitness_weights.efficiency,
              economy: fitnessWeights.economy !== undefined ? fitnessWeights.economy : prev.fitness_weights.economy,
              equity: fitnessWeights.equity !== undefined ? fitnessWeights.equity : prev.fitness_weights.equity,
              coverage: fitnessWeights.coverage !== undefined ? fitnessWeights.coverage : prev.fitness_weights.coverage,
              transfers: fitnessWeights.transfers !== undefined ? fitnessWeights.transfers : prev.fitness_weights.transfers,
              speed: fitnessWeights.speed !== undefined ? fitnessWeights.speed : prev.fitness_weights.speed,
              // Campos faltantes con valores calculados para completar 100%
              speed_max: fitnessWeights.speed_max !== undefined ? fitnessWeights.speed_max : defaultValue,
              road_capacity: fitnessWeights.road_capacity !== undefined ? fitnessWeights.road_capacity : defaultValue,
              road_class: fitnessWeights.road_class !== undefined ? fitnessWeights.road_class : defaultValue,
              travel_time_real: fitnessWeights.travel_time_real !== undefined ? fitnessWeights.travel_time_real : defaultValue,
              operating_cost: fitnessWeights.operating_cost !== undefined ? fitnessWeights.operating_cost : defaultValue,
              frequency: fitnessWeights.frequency !== undefined ? fitnessWeights.frequency : defaultValue,
              accessibility: fitnessWeights.accessibility !== undefined ? fitnessWeights.accessibility : defaultValue,
              bus_type_compatibility: fitnessWeights.bus_type_compatibility !== undefined ? fitnessWeights.bus_type_compatibility : defaultValue,
              population_density: fitnessWeights.population_density !== undefined ? fitnessWeights.population_density : defaultValue,
              redundancy: fitnessWeights.redundancy !== undefined ? fitnessWeights.redundancy : defaultValue
            }
          };
        });
      }
      
      if (results.parameters) {
        setParams(prev => ({
          ...prev,
          business_config: {
            ...prev.business_config,
            ...results.parameters
          }
        }));
      }
      
      // Guardar el checkpoint path de kpis
      if (results.kpis && results.kpis.last_checkpoint) {
        setCheckpointPath(results.kpis.last_checkpoint);
        console.log('[RetrainEngine] checkpointPath guardado:', results.kpis.last_checkpoint);
      }
      
      console.log('Parámetros cargados para ejecución:', executionId);
    } catch (error) {
      console.error('Error al cargar parámetros:', error);
    }
  };

  const handleStartRetrain = () => {
    if (selectedExecution) {
      // Usar checkpointPath guardado de kpis.last_checkpoint
      if (!checkpointPath) {
        alert('No se puede reentrenar: no hay checkpoint disponible para esta ejecución. El backend no devolvió el path del checkpoint en kpis.last_checkpoint.');
        return;
      }
      console.log('[RetrainEngine] checkpointPath:', checkpointPath);
      startRetrain({
        checkpoint_path: checkpointPath,
        additional_generations: additionalGenerations,
        config: params
      });
    }
  };

  const handleOperationalChange = (operational: typeof params.operational) => {
    setParams({ ...params, operational });
  };

  const handleGAChange = (parameters: typeof params.parameters) => {
    setParams({ ...params, parameters });
  };

  const handleFitnessChange = (fitness_weights: typeof params.fitness_weights) => {
    setParams({ ...params, fitness_weights });
  };

  const handleVisualizationChange = (visualization_config: typeof params.visualization_config) => {
    setParams({ ...params, visualization_config });
  };

  const handleBusinessChange = (business_config: typeof params.business_config) => {
    setParams({ ...params, business_config });
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="bg-gradient-to-r from-[#3EA32A] to-[#2E7A1F] dark:from-[#1a3a5c] dark:to-[#015EB0] rounded-2xl p-8 shadow-2xl">
        <h1 className="text-4xl font-bold text-white mb-2">Reentrenar Modelo</h1>
        <p className="text-gray-200 dark:text-gray-300">Continúa el entrenamiento de un modelo existente desde un checkpoint</p>
      </div>

      {!isRunning && !isCompleted && (
        <>
          <div className="bg-white dark:bg-[#1a1a2e] rounded-2xl shadow-xl p-6 border border-[#926f6b] dark:border-[#015EB0]/20">
            <h3 className="text-xl font-bold text-[#191c1e] dark:text-white mb-6 flex items-center gap-2">
              <span className="w-2 h-8 bg-[#e31e24] rounded-full"></span>
              Seleccionar Ejecución
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-[#191c1e] dark:text-white mb-2">
                  Ejecución a Reentrenar
                </label>
                <select
                  value={selectedExecution?.execution_id || ''}
                  onChange={(e) => {
                    const exec = executions.find(ex => ex.execution_id === e.target.value);
                    setSelectedExecution(exec || null);
                    _setHasSelectedExecution(!!exec);
                    if (exec) {
                      loadExecutionParams(exec.execution_id);
                    }
                  }}
                  className="w-full px-4 py-3 rounded-lg border-2 border-[#926f6b] dark:border-[#015EB0]/30 bg-white dark:bg-[#2a2a4a] text-[#191c1e] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#3EA32A]"
                >
                  <option value="">Selecciona una ejecución...</option>
                  {executions.map((exec) => (
                    <option key={exec.execution_id} value={exec.execution_id}>
                      {exec.execution_id} - {exec.status}
                    </option>
                  ))}
                </select>
              </div>

              {selectedExecution && (
                <div className="bg-[#f7f9fb] dark:bg-[#2a2a4a] rounded-lg p-4 border border-[#926f6b] dark:border-[#015EB0]/30">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-semibold text-[#191c1e] dark:text-white">ID:</span>
                      <span className="text-[#191c1e] dark:text-gray-300 ml-2">{selectedExecution.execution_id}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-[#191c1e] dark:text-white">Estado:</span>
                      <span className="text-[#191c1e] dark:text-gray-300 ml-2">{selectedExecution.status}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-[#191c1e] dark:text-white">Fecha:</span>
                      <span className="text-[#191c1e] dark:text-gray-300 ml-2">{new Date(selectedExecution.timestamp).toLocaleString('es-CO')}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-[#191c1e] dark:text-white">Checkpoint:</span>
                      <span className="text-[#191c1e] dark:text-gray-300 ml-2">/data/checkpoints/{selectedExecution.execution_id}.pkl</span>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-[#191c1e] dark:text-white mb-2">
                  Generaciones Adicionales
                </label>
                <input
                  type="number"
                  value={additionalGenerations}
                  onChange={(e) => setAdditionalGenerations(parseInt(e.target.value))}
                  min="1"
                  max="1000"
                  className="w-full px-4 py-3 rounded-lg border-2 border-[#926f6b] dark:border-[#015EB0]/30 bg-white dark:bg-[#2a2a4a] text-[#191c1e] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#3EA32A]"
                />
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleStartRetrain}
                  disabled={!selectedExecution}
                  className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#3EA32A] to-[#2E7A1F] text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-bold shadow-md"
                >
                  <RefreshCw className="w-5 h-5" />
                  Iniciar Reentrenamiento
                </button>
              </div>
            </div>
          </div>

          {selectedExecution && (
            <>
              <OperationalParams 
                params={params.operational} 
                onChange={handleOperationalChange}
                disabled={isRunning}
              />
              <GAParams 
                params={params.parameters} 
                onChange={handleGAChange}
                disabled={isRunning}
              />
              <FitnessSliders 
                weights={params.fitness_weights} 
                onChange={handleFitnessChange}
                disabled={isRunning}
              />
              <VisualizationParams 
                params={params.visualization_config || { visualization_graph: 'integrated_osm', enable_visualization: true }}
                onChange={handleVisualizationChange}
                disabled={isRunning}
              />
              <BusinessParams 
                params={params.business_config || {}}
                onChange={handleBusinessChange}
                disabled={isRunning}
              />
            </>
          )}
        </>
      )}

      {(isRunning || isCompleted) && (
        <>
          <div className="flex gap-4 mb-6">
            <button
              onClick={stopRetrain}
              disabled={!isRunning}
              className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#e31e24] to-[#c00014] text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-bold shadow-md"
            >
              <Square className="w-5 h-5" />
              Detener
            </button>
            <button
              onClick={() => navigate('/results')}
              disabled={!isCompleted}
              className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#0f172a] to-[#475569] text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-bold shadow-md"
            >
              <ArrowRight className="w-5 h-5" />
              Ver Resultados
            </button>
          </div>

          <ProgressIndicator progress={progress} isRunning={isRunning} isCompleted={isCompleted} />
          <ExecutionLogs logs={logs} />
        </>
      )}
    </div>
  );
};

export default RetrainEngineContainer;
