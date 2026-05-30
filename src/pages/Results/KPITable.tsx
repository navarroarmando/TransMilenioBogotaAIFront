import type { KPIs } from '../../services/types/optimization.types';

interface KPITableProps {
  before: KPIs;
  after: KPIs;
  variation: Record<string, number>;
}

const KPITablePresenter = ({ before, after, variation }: KPITableProps) => {
  const formatNumber = (num: number) => num.toLocaleString('es-CO');
  const formatCurrency = (num: number) => `$${formatNumber(num)}`;
  const formatPercent = (num: number) => `${num.toFixed(1)}%`;

  const kpiData = [
    { label: 'Demanda Atendida', before: formatNumber(before.total_demand_served), after: formatNumber(after.total_demand_served), variation: variation.total_demand_served },
    { label: 'Tiempo de Viaje Promedio (min)', before: formatNumber(before.avg_travel_time_min), after: formatNumber(after.avg_travel_time_min), variation: variation.avg_travel_time_min },
    { label: 'Distancia Total (km)', before: formatNumber(before.total_distance_km), after: formatNumber(after.total_distance_km), variation: variation.total_distance_km },
    { label: 'Cobertura (%)', before: formatPercent(before.coverage_pct), after: formatPercent(after.coverage_pct), variation: variation.coverage_pct },
    { label: 'Equidad', before: formatNumber(before.equity_score), after: formatNumber(after.equity_score), variation: variation.equity_score },
    { label: 'Costo Operativo', before: formatCurrency(before.operating_cost), after: formatCurrency(after.operating_cost), variation: variation.operating_cost },
    { label: 'Utilización de Flota', before: formatPercent(before.fleet_utilization * 100), after: formatPercent(after.fleet_utilization * 100), variation: variation.fleet_utilization },
  ];

  return (
    <div className="bg-white dark:bg-[#1a1a2e] rounded-2xl shadow-xl p-6 border border-[#3EA32A]/20 dark:border-[#015EB0]/20 animate-slide-in">
      <h3 className="text-xl font-bold text-[#191c1e] dark:text-white mb-6 flex items-center gap-2">
        <span className="w-2 h-8 bg-[#3EA32A] rounded-full"></span>
        Comparación de KPIs
      </h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-[#3EA32A]/20 dark:divide-[#015EB0]/20">
          <thead className="bg-[#3EA32A]/5 dark:bg-[#015EB0]/10">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-[#191c1e] dark:text-white uppercase tracking-wider">
                KPI
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-[#191c1e] dark:text-white uppercase tracking-wider">
                Antes
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-[#191c1e] dark:text-white uppercase tracking-wider">
                Después
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-[#191c1e] dark:text-white uppercase tracking-wider">
                Variación
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
                  {kpi.before}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#5d3f3c] dark:text-gray-400">
                  {kpi.after}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`px-3 py-1 rounded-full font-bold ${kpi.variation > 0 ? 'bg-[#3EA32A]/10 dark:bg-[#3EA32A]/20 text-[#3EA32A] dark:text-[#3EA32A] border border-[#3EA32A]/30' : 'bg-[#d1fae5] dark:bg-green-900/20 text-[#065f46] dark:text-green-200 border border-[#3EA32A] dark:border-green-600'}`}>
                    {kpi.variation > 0 ? '+' : ''}{kpi.variation.toFixed(1)}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default KPITablePresenter;
