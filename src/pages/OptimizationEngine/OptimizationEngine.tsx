import { useOptimization } from '../../hooks/useOptimization';
import { useNavigate } from 'react-router-dom';
import OperationalParams from './OperationalParams';
import GAParams from './GAParams';
import FitnessSliders from './FitnessSliders';
import VisualizationParams from './VisualizationParams';
import BusinessParams from './BusinessParams';
import ExecutionLogs from '../../components/shared/ExecutionLogs';
import ProgressIndicator from '../../components/shared/ProgressIndicator';
import { Play, Square, ArrowRight } from 'lucide-react';

const OptimizationEngineContainer = () => {
  const navigate = useNavigate();
  const {
    params,
    isRunning,
    isCompleted,
    logs,
    progress,
    updateParams,
    startOptimization,
    stopOptimization
  } = useOptimization();

  const handleOperationalChange = (operational: typeof params.operational) => {
    updateParams({ ...params, operational });
  };

  const handleGAChange = (parameters: typeof params.parameters) => {
    updateParams({ ...params, parameters });
  };

  const handleFitnessChange = (fitness_weights: typeof params.fitness_weights) => {
    updateParams({ ...params, fitness_weights });
  };

  const handleModeChange = (mode: string) => {
    updateParams({ ...params, mode });
  };

  const handleVisualizationChange = (visualization_config: typeof params.visualization_config) => {
    updateParams({ ...params, visualization_config });
  };

  const handleBusinessChange = (business_config: typeof params.business_config) => {
    updateParams({ ...params, business_config });
  };

  const totalFitness = Object.values(params.fitness_weights).reduce((sum, val) => sum + val, 0);
  const isValidFitness = Math.abs(totalFitness - 1.0) < 0.01;

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="bg-gradient-to-r from-[#3EA32A] to-[#2E7A1F] dark:from-[#1a3a5c] dark:to-[#015EB0] rounded-2xl p-8 shadow-2xl">
        <h1 className="text-4xl font-bold text-white mb-2">Motor de Optimización</h1>
        <p className="text-gray-200 dark:text-gray-300">Configura y ejecuta el algoritmo genético para optimizar rutas</p>
      </div>
      
      <div className="bg-white dark:bg-[#1a1a2e] rounded-2xl shadow-xl p-6 border border-[#3EA32A]/20 dark:border-[#015EB0]/20">
        <h3 className="text-xl font-bold text-[#191c1e] dark:text-white mb-4">Modo de Optimización</h3>
        <div className="flex gap-4">
          <button
            onClick={() => handleModeChange('individual')}
            disabled={isRunning}
            className={`flex-1 px-4 py-3 rounded-lg font-semibold transition-all ${
              params.mode === 'individual'
                ? 'bg-gradient-to-r from-[#3EA32A] to-[#2E7A1F] text-white shadow-lg'
                : 'bg-gray-100 dark:bg-[#2a2a4a] text-[#191c1e] dark:text-white hover:bg-gray-200 dark:hover:bg-[#3a3a5a]'
            }`}
          >
            Individual
          </button>
          <button
            onClick={() => handleModeChange('map')}
            disabled={isRunning}
            className={`flex-1 px-4 py-3 rounded-lg font-semibold transition-all ${
              params.mode === 'map'
                ? 'bg-gradient-to-r from-[#3EA32A] to-[#2E7A1F] text-white shadow-lg'
                : 'bg-gray-100 dark:bg-[#2a2a4a] text-[#191c1e] dark:text-white hover:bg-gray-200 dark:hover:bg-[#3a3a5a]'
            }`}
          >
            Mapa
          </button>
        </div>
      </div>
      
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
      
      <div className="flex gap-4 mb-6">
        <button
          onClick={startOptimization}
          disabled={isRunning || !isValidFitness}
          className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#3EA32A] to-[#2E7A1F] text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-bold shadow-md"
        >
          <Play className="w-5 h-5" />
          {isRunning ? 'Ejecutando...' : 'Iniciar Optimización'}
        </button>
        <button
          onClick={stopOptimization}
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
    </div>
  );
};

export default OptimizationEngineContainer;
