import type { ExecutionInfo, KPIs } from '../../services/types/optimization.types';

interface InformacionEjecucionProps {
  execution: ExecutionInfo;
  kpis: KPIs;
}

const InformacionEjecucion = ({ execution, kpis }: InformacionEjecucionProps) => {
  const formatNumber = (value?: number, decimals: number = 2) => {
    if (value === undefined || value === null) return 'N/A';
    return value.toLocaleString('es-CO', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  };

  const formatPercentage = (value?: number, decimals: number = 0) => {
    if (value === undefined || value === null) return 'N/A';
    return `${value.toFixed(decimals)}%`;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('es-CO');
  };

  const kpiData = [
    { label: 'ID de Ejecución', value: execution.execution_id },
    { label: 'Modo', value: execution.mode },
    { label: 'Estado', value: execution.status },
    { label: 'Progreso', value: formatPercentage(execution.progress) },
    { label: 'Generación Actual', value: execution.current_generation !== undefined ? `${execution.current_generation} / ${execution.total_generations || 'N/A'}` : 'N/A' },
    { label: 'Time Slot Actual', value: execution.current_time_slot !== undefined ? `${execution.current_time_slot} / ${execution.total_time_slots || 'N/A'}` : 'N/A' },
    { label: 'Fecha de Inicio', value: formatDate(execution.started_at) },
    { label: 'Fecha de Finalización', value: formatDate(execution.completed_at) },
    { label: 'Duración (segundos)', value: formatNumber(execution.duration_seconds, 0) },
    { label: 'Mejor Fitness', value: formatNumber(execution.best_fitness, 6) },
    { label: 'Generación de Convergencia', value: kpis.convergence_generation !== undefined ? kpis.convergence_generation : 'N/A' },
    { label: 'Fitness Inicial', value: formatNumber(kpis.initial_fitness, 6) },
    { label: 'Mejora de Fitness', value: formatNumber(kpis.fitness_improvement, 6) },
    { label: 'Mejora de Fitness (%)', value: formatPercentage(kpis.fitness_improvement_pct) },
    { label: 'Fitness Promedio de Población', value: formatNumber(kpis.avg_fitness_population, 6) },
    { label: 'Peor Fitness', value: formatNumber(kpis.worst_fitness, 6) },
    { label: 'Diversidad de Población', value: formatNumber(kpis.population_diversity, 4) },
    { label: 'Número de Rutas Generadas', value: kpis.num_routes_generated !== undefined ? kpis.num_routes_generated : 'N/A' },
    { label: 'Promedio de Paradas por Ruta', value: formatNumber(kpis.avg_stops_per_route, 1) },
    { label: 'Tiempo por Generación (s)', value: formatNumber(kpis.time_per_generation, 1) },
    { label: 'Tasa de Mutación Efectiva', value: formatNumber(kpis.effective_mutation_rate, 1) },
    { label: 'Tasa de Cruza Efectiva', value: formatNumber(kpis.effective_crossover_rate, 1) },
    { label: 'Último Checkpoint', value: kpis.last_checkpoint || 'N/A' },
    { label: 'Time Slots Completados', value: kpis.completed_time_slots !== undefined ? kpis.completed_time_slots : 'N/A' },
    { label: 'Fitness Promedio por Time Slot', value: formatNumber(kpis.avg_fitness_per_slot, 6) },
    { label: 'Distancia de Hamming Promedio', value: formatNumber(kpis.hamming_distance_avg, 4) },
    { label: 'Entropía Genética', value: formatNumber(kpis.genetic_entropy, 4) },
    { label: 'Presión de Selección', value: formatNumber(kpis.selection_pressure, 4) },
    { label: 'Tasa de Convergencia', value: formatNumber(kpis.convergence_rate, 4) },
    { label: 'Generaciones para Alcanzar Threshold', value: kpis.generations_to_threshold !== undefined ? kpis.generations_to_threshold : 'N/A' },
    { label: 'Hipervolumen', value: formatNumber(kpis.hypervolume, 6) },
    { label: 'Spacing Metric', value: formatNumber(kpis.spacing_metric, 4) },
    { label: 'Tamaño de Población', value: execution.population_size !== undefined ? execution.population_size : 'N/A' },
  ];

  return (
    <div className="bg-white dark:bg-[#1a1a2e] rounded-2xl shadow-xl p-6 border border-[#3EA32A]/20 dark:border-[#015EB0]/20 animate-slide-in">
      <h3 className="text-xl font-bold text-[#191c1e] dark:text-white mb-6 flex items-center gap-2">
        <span className="w-2 h-8 bg-[#3EA32A] rounded-full"></span>
        Información de Ejecución
      </h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-[#3EA32A]/20 dark:divide-[#015EB0]/20">
          <thead className="bg-[#3EA32A]/5 dark:bg-[#015EB0]/10">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-[#191c1e] dark:text-white uppercase tracking-wider">
                Campo
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-[#191c1e] dark:text-white uppercase tracking-wider">
                Valor
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-[#1a1a2e] divide-y divide-[#3EA32A]/20 dark:divide-[#015EB0]/20">
            {kpiData.map((kpi, index) => (
              <tr key={index} className="hover:bg-[#3EA32A]/5 dark:hover:bg-[#015EB0]/10 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-[#191c1e] dark:text-white">
                  {kpi.label}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#5d3f3c] dark:text-gray-400">
                  {kpi.value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InformacionEjecucion;
