import { useResults } from '../../hooks/useResults';
import { useLocation } from 'react-router-dom';
import KPITable from './KPITable';
import ResultsBySlot from './ResultsBySlot';
import MapaRutas from './MapaRutas';
import InformacionEjecucion from './InformacionEjecucion';

const ResultsContainer = () => {
  const location = useLocation();
  const executionId = location.state?.selectedExecutionId || localStorage.getItem('last_execution_id');
  console.log('Results - executionId from location/state:', location.state?.selectedExecutionId);
  console.log('Results - executionId from localStorage:', localStorage.getItem('last_execution_id'));
  console.log('Results - final executionId:', executionId);
  const { data, isLoading, error } = useResults(executionId);
  console.log('Results - data:', data, 'isLoading:', isLoading, 'error:', error);

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-200 px-4 py-3 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-6">
        <p className="text-text-secondary-light dark:text-text-secondary-dark">No hay resultados disponibles. Ejecute una optimización primero.</p>
      </div>
    );
  }

  // Verificar si la ejecución falló, está en running, o tiene error_message
  const isFailed = data.execution.status === 'failed' || data.execution.status === 'error';
  const isRunning = data.execution.status === 'running';
  const hasError = data.execution.error_message !== null && data.execution.error_message !== undefined;
  
  if (isFailed || isRunning || (hasError && data.execution.status !== 'completed')) {
    return (
      <div className="p-6 space-y-6">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-red-700 dark:text-red-200 mb-2">Ejecución Fallida o Incompleta</h3>
          <p className="text-red-600 dark:text-red-300 mb-4">
            La ejecución <span className="font-mono font-bold">{data.execution.execution_id}</span> {isFailed ? 'falló' : 'está incompleta'} durante el proceso de optimización.
          </p>
          {data.execution.error_message && (
            <div className="bg-red-100 dark:bg-red-900/30 rounded-lg p-4 mt-4">
              <p className="text-sm font-bold text-red-700 dark:text-red-200 mb-2">Mensaje de error:</p>
              <p className="text-sm text-red-600 dark:text-red-300 font-mono">{data.execution.error_message}</p>
            </div>
          )}
        </div>
        <div className="bg-gray-50 dark:bg-[#2a2a4a] rounded-2xl p-6">
          <h3 className="text-lg font-bold text-[#191c1e] dark:text-white mb-4">Información de Ejecución</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-[#1a1a2e] rounded-xl p-4">
              <p className="text-sm text-[#5d3f3c] dark:text-gray-400 mb-1">ID de Ejecución</p>
              <p className="text-lg font-bold text-[#191c1e] dark:text-white">{data.execution.execution_id}</p>
            </div>
            <div className="bg-white dark:bg-[#1a1a2e] rounded-xl p-4">
              <p className="text-sm text-[#5d3f3c] dark:text-gray-400 mb-1">Estado</p>
              <p className="text-lg font-bold text-red-600 dark:text-red-400">{data.execution.status}</p>
            </div>
            <div className="bg-white dark:bg-[#1a1a2e] rounded-xl p-4">
              <p className="text-sm text-[#5d3f3c] dark:text-gray-400 mb-1">Modo</p>
              <p className="text-lg font-bold text-[#191c1e] dark:text-white">{data.execution.mode}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="bg-gradient-to-r from-[#3EA32A] to-[#2E7A1F] dark:from-[#1a3a5c] dark:to-[#015EB0] rounded-2xl p-8 shadow-2xl">
        <h1 className="text-4xl font-bold text-white mb-2">Resultados de Optimización</h1>
        <p className="text-gray-200 dark:text-gray-300">Análisis detallado de las mejoras en el sistema de transporte</p>
      </div>
      
      {/* Información de ejecución básica */}
      <div className="bg-white dark:bg-[#1a1a2e] rounded-2xl shadow-xl p-6 border border-[#3EA32A]/20 dark:border-[#015EB0]/20">
        <h3 className="text-xl font-bold text-[#191c1e] dark:text-white mb-4">Información de Ejecución</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 dark:bg-[#2a2a4a] rounded-xl p-4">
            <p className="text-sm text-[#5d3f3c] dark:text-gray-400 mb-1">ID de Ejecución</p>
            <p className="text-lg font-bold text-[#191c1e] dark:text-white">{data.execution.execution_id}</p>
          </div>
          <div className="bg-gray-50 dark:bg-[#2a2a4a] rounded-xl p-4">
            <p className="text-sm text-[#5d3f3c] dark:text-gray-400 mb-1">Modo</p>
            <p className="text-lg font-bold text-[#191c1e] dark:text-white">{data.execution.mode}</p>
          </div>
          <div className="bg-gray-50 dark:bg-[#2a2a4a] rounded-xl p-4">
            <p className="text-sm text-[#5d3f3c] dark:text-gray-400 mb-1">Duración</p>
            <p className="text-lg font-bold text-[#191c1e] dark:text-white">{data.execution.duration_seconds ? data.execution.duration_seconds.toFixed(0) + 's' : 'N/A'}</p>
          </div>
        </div>
      </div>
      
      {/* Mapa de rutas */}
      <MapaRutas executionId={data.execution.execution_id} />
      
      {/* Información de ejecución detallada con KPIs del AG */}
      <InformacionEjecucion execution={data.execution} kpis={data.kpis} />
      
      {/* KPIs de negocio */}
      <KPITable kpis={data.kpis} />
      
      {/* Resultados por slot */}
      <ResultsBySlot resultsBySlot={data.results_by_slot} />
    </div>
  );
};

export default ResultsContainer;
