import { useOptimization } from '../../hooks/useOptimization';
import OperationalParams from './OperationalParams';
import GAParams from './GAParams';
import FitnessSliders from './FitnessSliders';
import ExecutionLogs from './ExecutionLogs';
import ProgressIndicator from './ProgressIndicator';
import { Play, Square, ArrowRight } from 'lucide-react';

const OptimizationEngineContainer = () => {
  const {
    params,
    isRunning,
    logs,
    progress,
    results,
    updateParams,
    startOptimization,
    stopOptimization
  } = useOptimization();

  const handleOperationalChange = (operational: typeof params.operational) => {
    updateParams({ ...params, operational });
  };

  const handleGAChange = (ga: typeof params.ga) => {
    updateParams({ ...params, ga });
  };

  const handleFitnessChange = (fitness_weights: typeof params.fitness_weights) => {
    updateParams({ ...params, fitness_weights });
  };

  const totalFitness = Object.values(params.fitness_weights).reduce((sum, val) => sum + val, 0);
  const isValidFitness = Math.abs(totalFitness - 1.0) < 0.01;

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="bg-gradient-to-r from-[#002E5E] to-[#015EB0] dark:from-[#1a3a5c] dark:to-[#015EB0] rounded-2xl p-8 shadow-2xl">
        <h1 className="text-4xl font-bold text-white mb-2">Motor de Optimización</h1>
        <p className="text-gray-200 dark:text-gray-300">Configura y ejecuta el algoritmo genético para optimizar rutas</p>
      </div>
      
      <OperationalParams 
        params={params.operational} 
        onChange={handleOperationalChange}
        disabled={isRunning}
      />
      <GAParams 
        params={params.ga} 
        onChange={handleGAChange}
        disabled={isRunning}
      />
      <FitnessSliders 
        weights={params.fitness_weights} 
        onChange={handleFitnessChange}
        disabled={isRunning}
      />
      
      <div className="flex gap-4 mb-6">
        <button
          onClick={startOptimization}
          disabled={isRunning || !isValidFitness}
          className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#3EA32A] to-[#2d8a22] text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-bold shadow-md"
        >
          <Play className="w-5 h-5" />
          {isRunning ? 'Ejecutando...' : 'Iniciar Optimización'}
        </button>
        <button
          onClick={stopOptimization}
          disabled={!isRunning}
          className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-bold shadow-md"
        >
          <Square className="w-5 h-5" />
          Detener
        </button>
        {results && (
          <button
            onClick={() => window.location.href = '/results'}
            className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#002E5E] to-[#015EB0] text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300 font-bold shadow-md"
          >
            <ArrowRight className="w-5 h-5" />
            Ver Resultados
          </button>
        )}
      </div>
      
      <ProgressIndicator progress={progress} isRunning={isRunning} />
      <ExecutionLogs logs={logs} />
    </div>
  );
};

export default OptimizationEngineContainer;
