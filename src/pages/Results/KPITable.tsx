import type { KPIs } from '../../services/types/optimization.types';

interface KPITableProps {
  kpis: KPIs;
}

const KPITablePresenter = ({ kpis }: KPITableProps) => {
  const formatNumber = (num: number) => num.toLocaleString('es-CO');
  const formatCurrency = (num: number) => `$${formatNumber(num)}`;
  const formatPercent = (num: number) => `${num.toFixed(1)}%`;

  const kpiData = [
    { label: 'Demanda Atendida', value: formatNumber(kpis.total_demand_served) },
    { label: 'Tiempo de Viaje Promedio (min)', value: formatNumber(kpis.avg_travel_time_min) },
    { label: 'Distancia Total (km)', value: formatNumber(kpis.total_distance_km) },
    { label: 'Cobertura (%)', value: formatPercent(kpis.coverage_pct) },
    { label: 'Equidad', value: formatNumber(kpis.equity_score) },
    { label: 'Costo Operativo', value: formatCurrency(kpis.operating_cost) },
    { label: 'Utilización de Flota', value: formatPercent(kpis.fleet_utilization * 100) },
  ];

  return (
    <div className="bg-white dark:bg-[#1a1a2e] rounded-2xl shadow-xl p-6 border border-[#3EA32A]/20 dark:border-[#015EB0]/20 animate-slide-in">
      <h3 className="text-xl font-bold text-[#191c1e] dark:text-white mb-6 flex items-center gap-2">
        <span className="w-2 h-8 bg-[#3EA32A] rounded-full"></span>
        KPIs de Optimización
      </h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-[#3EA32A]/20 dark:divide-[#015EB0]/20">
          <thead className="bg-[#3EA32A]/5 dark:bg-[#015EB0]/10">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-[#191c1e] dark:text-white uppercase tracking-wider">
                KPI
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

export default KPITablePresenter;
