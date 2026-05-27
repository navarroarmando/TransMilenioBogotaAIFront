import type { KPIs } from '../../services/types/optimization.types';

interface DashboardKPIsProps {
  kpis: KPIs;
}

interface KPICardProps {
  title: string;
  value: string | number;
  trend?: number;
  trendLabel?: string;
  icon?: React.ReactNode;
}

const KPICard = ({ title, value, trend, trendLabel, icon }: KPICardProps) => {
  const trendColor = trend && trend > 0 ? 'text-[#3EA32A]' : trend && trend < 0 ? 'text-red-500' : 'text-gray-500';
  
  return (
    <div className="bg-white dark:bg-[#1a1a2e] rounded-2xl shadow-xl p-6 border border-[#015EB0]/10 dark:border-[#015EB0]/20 hover:shadow-2xl hover:border-[#015EB0]/30 dark:hover:border-[#015EB0]/40 transition-all duration-300 animate-slide-in transform hover:-translate-y-1">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1 uppercase tracking-wide">{title}</h3>
          <p className="text-3xl font-bold text-[#002E5E] dark:text-white">{value}</p>
        </div>
        {icon && <div className="text-[#015EB0] dark:text-[#3EA32A]">{icon}</div>}
      </div>
      {trend !== undefined && (
        <div className="flex items-center gap-2">
          <span className={`text-sm font-bold ${trendColor}`}>
            {trend > 0 ? '↑' : trend < 0 ? '↓' : ''} {Math.abs(trend)}%
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">{trendLabel || 'vs anterior'}</span>
        </div>
      )}
    </div>
  );
};

const DashboardKPIsPresenter = ({ kpis }: DashboardKPIsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <KPICard 
        title="Demanda Atendida" 
        value={kpis.total_demand_served.toLocaleString()} 
        trend={47.1}
        trendLabel="mejora"
      />
      <KPICard 
        title="Tiempo de Viaje Promedio" 
        value={`${kpis.avg_travel_time_min} min`} 
        trend={-26.9}
        trendLabel="reducción"
      />
      <KPICard 
        title="Cobertura" 
        value={`${kpis.coverage_pct}%`} 
        trend={23.6}
        trendLabel="mejora"
      />
      <KPICard 
        title="Utilización de Flota" 
        value={`${(kpis.fleet_utilization * 100).toFixed(0)}%`} 
        trend={60.0}
        trendLabel="mejora"
      />
    </div>
  );
};

export default DashboardKPIsPresenter;
