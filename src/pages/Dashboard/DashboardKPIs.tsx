import type { DashboardKPIs } from '../../services/types/dashboard.types';

interface DashboardKPIsProps {
  kpis: DashboardKPIs;
}

interface KPICardProps {
  title: string;
  value: string | number;
  trend?: number;
  trendLabel?: string;
  icon?: React.ReactNode;
}

const KPICard = ({ title, value, trend, trendLabel, icon }: KPICardProps) => {
  const trendColor = trend && trend > 0 ? 'text-[#3EA32A]' : trend && trend < 0 ? 'text-[#ba1a1a]' : 'text-gray-500';
  
  return (
    <div className="bg-white dark:bg-[#1a1a2e] rounded-2xl shadow-xl p-6 border border-[#3EA32A]/20 dark:border-[#015EB0]/20 hover:shadow-2xl hover:border-[#3EA32A]/30 dark:hover:border-[#015EB0]/40 transition-all duration-300 animate-slide-in transform hover:-translate-y-1">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-[#5d3f3c] dark:text-gray-400 mb-1 uppercase tracking-wide">{title}</h3>
          <p className="text-3xl font-bold text-[#191c1e] dark:text-white">{value}</p>
        </div>
        {icon && <div className="text-[#3EA32A] dark:text-[#3EA32A]">{icon}</div>}
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
        title="Total Ejecuciones" 
        value={kpis.total_executions.toLocaleString()} 
        trend={12.5}
        trendLabel="vs mes anterior"
      />
      <KPICard 
        title="Ejecuciones Completadas" 
        value={kpis.completed_executions.toLocaleString()} 
        trend={8.3}
        trendLabel="vs mes anterior"
      />
      <KPICard 
        title="Ejecuciones Fallidas" 
        value={kpis.failed_executions.toLocaleString()} 
        trend={-15.2}
        trendLabel="vs mes anterior"
      />
      <KPICard 
        title="Duración Promedio" 
        value={`${kpis.avg_duration_seconds.toFixed(0)}s`} 
        trend={-5.7}
        trendLabel="vs mes anterior"
      />
      <KPICard 
        title="Mejor Fitness Histórico" 
        value={kpis.best_fitness_all_time.toFixed(4)} 
        trend={2.1}
        trendLabel="vs mes anterior"
      />
    </div>
  );
};

export default DashboardKPIsPresenter;
