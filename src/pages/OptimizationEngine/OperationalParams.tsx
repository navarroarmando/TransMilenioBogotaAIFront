import type { OperationalParams } from '../../services/types/optimization.types';

interface OperationalParamsProps {
  params: OperationalParams;
  onChange: (params: OperationalParams) => void;
  disabled: boolean;
}

const OperationalParamsPresenter = ({ params, onChange, disabled }: OperationalParamsProps) => {
  const handleChange = (field: keyof OperationalParams, value: number | boolean) => {
    onChange({ ...params, [field]: value });
  };

  return (
    <div className="bg-white dark:bg-[#1a1a2e] rounded-2xl shadow-xl p-6 border border-[#926f6b] dark:border-[#015EB0]/20 animate-slide-in">
      <h3 className="text-xl font-bold text-[#191c1e] dark:text-white mb-6 flex items-center gap-2">
        <span className="w-2 h-8 bg-[#e31e24] rounded-full"></span>
        Parámetros Operativos
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-bold text-[#191c1e] dark:text-white mb-2 uppercase tracking-wide">Hora Inicio Servicio</label>
          <input
            type="number"
            value={params.service_hours_start}
            onChange={(e) => handleChange('service_hours_start', parseInt(e.target.value))}
            disabled={disabled}
            className="w-full px-4 py-3 border-2 border-[#926f6b] dark:border-[#015EB0]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#e31e24] focus:border-[#e31e24] disabled:opacity-50 bg-[#f7f9fb] dark:bg-[#121212] text-[#191c1e] dark:text-white font-semibold transition-all duration-300 hover:border-[#e31e24]/40 dark:hover:border-[#015EB0]/50"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-[#191c1e] dark:text-white mb-2 uppercase tracking-wide">Hora Fin Servicio</label>
          <input
            type="number"
            value={params.service_hours_end}
            onChange={(e) => handleChange('service_hours_end', parseInt(e.target.value))}
            disabled={disabled}
            className="w-full px-4 py-3 border-2 border-[#926f6b] dark:border-[#015EB0]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#e31e24] focus:border-[#e31e24] disabled:opacity-50 bg-[#f7f9fb] dark:bg-[#121212] text-[#191c1e] dark:text-white font-semibold transition-all duration-300 hover:border-[#e31e24]/40 dark:hover:border-[#015EB0]/50"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-[#191c1e] dark:text-white mb-2 uppercase tracking-wide">Intervalo Slot Tiempo (min)</label>
          <input
            type="number"
            value={params.time_slot_interval}
            onChange={(e) => handleChange('time_slot_interval', parseInt(e.target.value))}
            disabled={disabled}
            className="w-full px-4 py-3 border-2 border-[#926f6b] dark:border-[#015EB0]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#e31e24] focus:border-[#e31e24] disabled:opacity-50 bg-[#f7f9fb] dark:bg-[#121212] text-[#191c1e] dark:text-white font-semibold transition-all duration-300 hover:border-[#e31e24]/40 dark:hover:border-[#015EB0]/50"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-[#191c1e] dark:text-white mb-2 uppercase tracking-wide">Rutas por Slot</label>
          <input
            type="number"
            value={params.num_routes_per_slot}
            onChange={(e) => handleChange('num_routes_per_slot', parseInt(e.target.value))}
            disabled={disabled}
            className="w-full px-4 py-3 border-2 border-[#926f6b] dark:border-[#015EB0]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#e31e24] focus:border-[#e31e24] disabled:opacity-50 bg-[#f7f9fb] dark:bg-[#121212] text-[#191c1e] dark:text-white font-semibold transition-all duration-300 hover:border-[#e31e24]/40 dark:hover:border-[#015EB0]/50"
          />
        </div>
        <div className="flex items-center bg-[#f7f9fb] dark:bg-[#121212] border-2 border-[#926f6b] dark:border-[#015EB0]/30 rounded-xl px-4 py-3 hover:border-[#e31e24]/40 dark:hover:border-[#015EB0]/50 transition-all duration-300">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={params.enable_time_slots}
              onChange={(e) => handleChange('enable_time_slots', e.target.checked)}
              disabled={disabled}
              className="w-5 h-5 accent-[#e31e24] rounded focus:ring-2 focus:ring-[#e31e24] disabled:opacity-50"
            />
            <span className="text-sm font-bold text-[#191c1e] dark:text-white uppercase tracking-wide">Habilitar Slots de Tiempo</span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default OperationalParamsPresenter;
