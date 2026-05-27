import type { OperationalParams } from '../../services/types/optimization.types';

interface OperationalParamsProps {
  params: OperationalParams;
  onChange: (params: OperationalParams) => void;
  disabled: boolean;
}

const OperationalParamsPresenter = ({ params, onChange, disabled }: OperationalParamsProps) => {
  const handleChange = (field: keyof OperationalParams, value: number) => {
    onChange({ ...params, [field]: value });
  };

  return (
    <div className="bg-white dark:bg-[#1a1a2e] rounded-2xl shadow-xl p-6 border border-[#015EB0]/10 dark:border-[#015EB0]/20 animate-slide-in">
      <h3 className="text-xl font-bold text-[#002E5E] dark:text-white mb-6 flex items-center gap-2">
        <span className="w-2 h-8 bg-[#3EA32A] rounded-full"></span>
        Parámetros Operativos
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-bold text-[#002E5E] dark:text-white mb-2 uppercase tracking-wide">Hora Inicio Servicio</label>
          <input
            type="number"
            value={params.service_hours_start}
            onChange={(e) => handleChange('service_hours_start', parseInt(e.target.value))}
            disabled={disabled}
            className="w-full px-4 py-3 border-2 border-[#015EB0]/20 dark:border-[#015EB0]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#015EB0] focus:border-[#015EB0] disabled:opacity-50 bg-[#F8F8F8] dark:bg-[#121212] text-[#002E5E] dark:text-white font-semibold transition-all duration-300 hover:border-[#015EB0]/40 dark:hover:border-[#015EB0]/50"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-[#002E5E] dark:text-white mb-2 uppercase tracking-wide">Hora Fin Servicio</label>
          <input
            type="number"
            value={params.service_hours_end}
            onChange={(e) => handleChange('service_hours_end', parseInt(e.target.value))}
            disabled={disabled}
            className="w-full px-4 py-3 border-2 border-[#015EB0]/20 dark:border-[#015EB0]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#015EB0] focus:border-[#015EB0] disabled:opacity-50 bg-[#F8F8F8] dark:bg-[#121212] text-[#002E5E] dark:text-white font-semibold transition-all duration-300 hover:border-[#015EB0]/40 dark:hover:border-[#015EB0]/50"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-[#002E5E] dark:text-white mb-2 uppercase tracking-wide">Capacidad Bus</label>
          <input
            type="number"
            value={params.bus_capacity}
            onChange={(e) => handleChange('bus_capacity', parseInt(e.target.value))}
            disabled={disabled}
            className="w-full px-4 py-3 border-2 border-[#015EB0]/20 dark:border-[#015EB0]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#015EB0] focus:border-[#015EB0] disabled:opacity-50 bg-[#F8F8F8] dark:bg-[#121212] text-[#002E5E] dark:text-white font-semibold transition-all duration-300 hover:border-[#015EB0]/40 dark:hover:border-[#015EB0]/50"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-[#002E5E] dark:text-white mb-2 uppercase tracking-wide">Distancia Máxima Recorrida (km)</label>
          <input
            type="number"
            value={params.max_travel_time_min}
            onChange={(e) => handleChange('max_travel_time_min', parseInt(e.target.value))}
            disabled={disabled}
            className="w-full px-4 py-3 border-2 border-[#015EB0]/20 dark:border-[#015EB0]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#015EB0] focus:border-[#015EB0] disabled:opacity-50 bg-[#F8F8F8] dark:bg-[#121212] text-[#002E5E] dark:text-white font-semibold transition-all duration-300 hover:border-[#015EB0]/40 dark:hover:border-[#015EB0]/50"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-[#002E5E] dark:text-white mb-2 uppercase tracking-wide">Franjas Horarias</label>
          <input
            type="number"
            value={params.time_windows}
            onChange={(e) => handleChange('time_windows', parseInt(e.target.value))}
            disabled={disabled}
            className="w-full px-4 py-3 border-2 border-[#015EB0]/20 dark:border-[#015EB0]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#015EB0] focus:border-[#015EB0] disabled:opacity-50 bg-[#F8F8F8] dark:bg-[#121212] text-[#002E5E] dark:text-white font-semibold transition-all duration-300 hover:border-[#015EB0]/40 dark:hover:border-[#015EB0]/50"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-[#002E5E] dark:text-white mb-2 uppercase tracking-wide">Cobertura Objetivo (%)</label>
          <input
            type="number"
            value={params.target_coverage_pct}
            onChange={(e) => handleChange('target_coverage_pct', parseInt(e.target.value))}
            disabled={disabled}
            className="w-full px-4 py-3 border-2 border-[#015EB0]/20 dark:border-[#015EB0]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#015EB0] focus:border-[#015EB0] disabled:opacity-50 bg-[#F8F8F8] dark:bg-[#121212] text-[#002E5E] dark:text-white font-semibold transition-all duration-300 hover:border-[#015EB0]/40 dark:hover:border-[#015EB0]/50"
          />
        </div>
      </div>
    </div>
  );
};

export default OperationalParamsPresenter;
