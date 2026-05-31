import type { GAParams } from '../../services/types/optimization.types';

interface GAParamsProps {
  params: GAParams;
  onChange: (params: GAParams) => void;
  disabled: boolean;
}

const GAParamsPresenter = ({ params, onChange, disabled }: GAParamsProps) => {
  const handleChange = (field: keyof GAParams, value: number | boolean) => {
    onChange({ ...params, [field]: value });
  };

  return (
    <div className="bg-white dark:bg-[#1a1a2e] rounded-2xl shadow-xl p-6 border border-[#926f6b] dark:border-[#015EB0]/20 animate-slide-in">
      <h3 className="text-xl font-bold text-[#191c1e] dark:text-white mb-6 flex items-center gap-2">
        <span className="w-2 h-8 bg-[#e31e24] rounded-full"></span>
        Parámetros del Algoritmo Genético
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-bold text-[#191c1e] dark:text-white mb-2 uppercase tracking-wide">Tamaño Población</label>
          <input
            type="number"
            value={params.population_size}
            onChange={(e) => handleChange('population_size', parseInt(e.target.value))}
            disabled={disabled}
            className="w-full px-4 py-3 border-2 border-[#926f6b] dark:border-[#015EB0]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#e31e24] focus:border-[#e31e24] disabled:opacity-50 bg-[#f7f9fb] dark:bg-[#121212] text-[#191c1e] dark:text-white font-semibold transition-all duration-300 hover:border-[#e31e24]/40 dark:hover:border-[#015EB0]/50"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-[#191c1e] dark:text-white mb-2 uppercase tracking-wide">Generaciones</label>
          <input
            type="number"
            value={params.generations}
            onChange={(e) => handleChange('generations', parseInt(e.target.value))}
            disabled={disabled}
            className="w-full px-4 py-3 border-2 border-[#926f6b] dark:border-[#015EB0]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#e31e24] focus:border-[#e31e24] disabled:opacity-50 bg-[#f7f9fb] dark:bg-[#121212] text-[#191c1e] dark:text-white font-semibold transition-all duration-300 hover:border-[#e31e24]/40 dark:hover:border-[#015EB0]/50"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-[#191c1e] dark:text-white mb-2 uppercase tracking-wide">Tasa Mutación</label>
          <input
            type="number"
            step="0.01"
            value={params.mutation_rate}
            onChange={(e) => handleChange('mutation_rate', parseFloat(e.target.value))}
            disabled={disabled}
            className="w-full px-4 py-3 border-2 border-[#926f6b] dark:border-[#015EB0]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#e31e24] focus:border-[#e31e24] disabled:opacity-50 bg-[#f7f9fb] dark:bg-[#121212] text-[#191c1e] dark:text-white font-semibold transition-all duration-300 hover:border-[#e31e24]/40 dark:hover:border-[#015EB0]/50"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-[#191c1e] dark:text-white mb-2 uppercase tracking-wide">Tasa Crossover</label>
          <input
            type="number"
            step="0.01"
            value={params.crossover_rate}
            onChange={(e) => handleChange('crossover_rate', parseFloat(e.target.value))}
            disabled={disabled}
            className="w-full px-4 py-3 border-2 border-[#926f6b] dark:border-[#015EB0]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#e31e24] focus:border-[#e31e24] disabled:opacity-50 bg-[#f7f9fb] dark:bg-[#121212] text-[#191c1e] dark:text-white font-semibold transition-all duration-300 hover:border-[#e31e24]/40 dark:hover:border-[#015EB0]/50"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-[#191c1e] dark:text-white mb-2 uppercase tracking-wide">Elitismo</label>
          <input
            type="number"
            value={params.elitism_count}
            onChange={(e) => handleChange('elitism_count', parseInt(e.target.value))}
            disabled={disabled}
            className="w-full px-4 py-3 border-2 border-[#926f6b] dark:border-[#015EB0]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#e31e24] focus:border-[#e31e24] disabled:opacity-50 bg-[#f7f9fb] dark:bg-[#121212] text-[#191c1e] dark:text-white font-semibold transition-all duration-300 hover:border-[#e31e24]/40 dark:hover:border-[#015EB0]/50"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-[#191c1e] dark:text-white mb-2 uppercase tracking-wide">Tamaño Torneo</label>
          <input
            type="number"
            value={params.tournament_size}
            onChange={(e) => handleChange('tournament_size', parseInt(e.target.value))}
            disabled={disabled}
            className="w-full px-4 py-3 border-2 border-[#926f6b] dark:border-[#015EB0]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#e31e24] focus:border-[#e31e24] disabled:opacity-50 bg-[#f7f9fb] dark:bg-[#121212] text-[#191c1e] dark:text-white font-semibold transition-all duration-300 hover:border-[#e31e24]/40 dark:hover:border-[#015EB0]/50"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-[#191c1e] dark:text-white mb-2 uppercase tracking-wide">Longitud Mínima Ruta</label>
          <input
            type="number"
            value={params.min_route_length}
            onChange={(e) => handleChange('min_route_length', parseInt(e.target.value))}
            disabled={disabled}
            className="w-full px-4 py-3 border-2 border-[#926f6b] dark:border-[#015EB0]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#e31e24] focus:border-[#e31e24] disabled:opacity-50 bg-[#f7f9fb] dark:bg-[#121212] text-[#191c1e] dark:text-white font-semibold transition-all duration-300 hover:border-[#e31e24]/40 dark:hover:border-[#015EB0]/50"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-[#191c1e] dark:text-white mb-2 uppercase tracking-wide">Longitud Máxima Ruta</label>
          <input
            type="number"
            value={params.max_route_length}
            onChange={(e) => handleChange('max_route_length', parseInt(e.target.value))}
            disabled={disabled}
            className="w-full px-4 py-3 border-2 border-[#926f6b] dark:border-[#015EB0]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#e31e24] focus:border-[#e31e24] disabled:opacity-50 bg-[#f7f9fb] dark:bg-[#121212] text-[#191c1e] dark:text-white font-semibold transition-all duration-300 hover:border-[#e31e24]/40 dark:hover:border-[#015EB0]/50"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-[#191c1e] dark:text-white mb-2 uppercase tracking-wide">Sesgo Distancia (km)</label>
          <input
            type="number"
            step="0.1"
            value={params.distance_bias_km}
            onChange={(e) => handleChange('distance_bias_km', parseFloat(e.target.value))}
            disabled={disabled}
            className="w-full px-4 py-3 border-2 border-[#926f6b] dark:border-[#015EB0]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#e31e24] focus:border-[#e31e24] disabled:opacity-50 bg-[#f7f9fb] dark:bg-[#121212] text-[#191c1e] dark:text-white font-semibold transition-all duration-300 hover:border-[#e31e24]/40 dark:hover:border-[#015EB0]/50"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-[#191c1e] dark:text-white mb-2 uppercase tracking-wide">Tiempo Máximo Viaje (min)</label>
          <input
            type="number"
            step="0.1"
            value={params.max_travel_time_min}
            onChange={(e) => handleChange('max_travel_time_min', parseFloat(e.target.value))}
            disabled={disabled}
            className="w-full px-4 py-3 border-2 border-[#926f6b] dark:border-[#015EB0]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#e31e24] focus:border-[#e31e24] disabled:opacity-50 bg-[#f7f9fb] dark:bg-[#121212] text-[#191c1e] dark:text-white font-semibold transition-all duration-300 hover:border-[#e31e24]/40 dark:hover:border-[#015EB0]/50"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-[#191c1e] dark:text-white mb-2 uppercase tracking-wide">Capacidad Bus</label>
          <input
            type="number"
            value={params.bus_capacity}
            onChange={(e) => handleChange('bus_capacity', parseInt(e.target.value))}
            disabled={disabled}
            className="w-full px-4 py-3 border-2 border-[#926f6b] dark:border-[#015EB0]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#e31e24] focus:border-[#e31e24] disabled:opacity-50 bg-[#f7f9fb] dark:bg-[#121212] text-[#191c1e] dark:text-white font-semibold transition-all duration-300 hover:border-[#e31e24]/40 dark:hover:border-[#015EB0]/50"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-[#191c1e] dark:text-white mb-2 uppercase tracking-wide">Intervalo Checkpoint</label>
          <input
            type="number"
            value={params.checkpoint_interval}
            onChange={(e) => handleChange('checkpoint_interval', parseInt(e.target.value))}
            disabled={disabled}
            className="w-full px-4 py-3 border-2 border-[#926f6b] dark:border-[#015EB0]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#e31e24] focus:border-[#e31e24] disabled:opacity-50 bg-[#f7f9fb] dark:bg-[#121212] text-[#191c1e] dark:text-white font-semibold transition-all duration-300 hover:border-[#e31e24]/40 dark:hover:border-[#015EB0]/50"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-[#191c1e] dark:text-white mb-2 uppercase tracking-wide">Intervalo Log</label>
          <input
            type="number"
            value={params.log_interval}
            onChange={(e) => handleChange('log_interval', parseInt(e.target.value))}
            disabled={disabled}
            className="w-full px-4 py-3 border-2 border-[#926f6b] dark:border-[#015EB0]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#e31e24] focus:border-[#e31e24] disabled:opacity-50 bg-[#f7f9fb] dark:bg-[#121212] text-[#191c1e] dark:text-white font-semibold transition-all duration-300 hover:border-[#e31e24]/40 dark:hover:border-[#015EB0]/50"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-[#191c1e] dark:text-white mb-2 uppercase tracking-wide">Ratio Muestra Demanda</label>
          <input
            type="number"
            step="0.01"
            value={params.demand_sample_ratio}
            onChange={(e) => handleChange('demand_sample_ratio', parseFloat(e.target.value))}
            disabled={disabled}
            className="w-full px-4 py-3 border-2 border-[#926f6b] dark:border-[#015EB0]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#e31e24] focus:border-[#e31e24] disabled:opacity-50 bg-[#f7f9fb] dark:bg-[#121212] text-[#191c1e] dark:text-white font-semibold transition-all duration-300 hover:border-[#e31e24]/40 dark:hover:border-[#015EB0]/50"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-[#191c1e] dark:text-white mb-2 uppercase tracking-wide">Umbral Filtro Demanda</label>
          <input
            type="number"
            step="0.01"
            value={params.demand_filter_threshold}
            onChange={(e) => handleChange('demand_filter_threshold', parseFloat(e.target.value))}
            disabled={disabled}
            className="w-full px-4 py-3 border-2 border-[#926f6b] dark:border-[#015EB0]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#e31e24] focus:border-[#e31e24] disabled:opacity-50 bg-[#f7f9fb] dark:bg-[#121212] text-[#191c1e] dark:text-white font-semibold transition-all duration-300 hover:border-[#e31e24]/40 dark:hover:border-[#015EB0]/50"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-[#191c1e] dark:text-white mb-2 uppercase tracking-wide">Penalización Conectividad</label>
          <input
            type="number"
            value={params.connectivity_penalty}
            onChange={(e) => handleChange('connectivity_penalty', parseInt(e.target.value))}
            disabled={disabled}
            className="w-full px-4 py-3 border-2 border-[#926f6b] dark:border-[#015EB0]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#e31e24] focus:border-[#e31e24] disabled:opacity-50 bg-[#f7f9fb] dark:bg-[#121212] text-[#191c1e] dark:text-white font-semibold transition-all duration-300 hover:border-[#e31e24]/40 dark:hover:border-[#015EB0]/50"
          />
        </div>
        <div className="flex items-center bg-[#f7f9fb] dark:bg-[#121212] border-2 border-[#926f6b] dark:border-[#015EB0]/30 rounded-xl px-4 py-3 hover:border-[#e31e24]/40 dark:hover:border-[#015EB0]/50 transition-all duration-300">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={params.enable_dijkstra_decoding}
              onChange={(e) => handleChange('enable_dijkstra_decoding', e.target.checked)}
              disabled={disabled}
              className="w-5 h-5 accent-[#e31e24] rounded focus:ring-2 focus:ring-[#e31e24] disabled:opacity-50"
            />
            <span className="text-sm font-bold text-[#191c1e] dark:text-white uppercase tracking-wide">Habilitar Dijkstra</span>
          </label>
        </div>
        <div className="flex items-center bg-[#f7f9fb] dark:bg-[#121212] border-2 border-[#926f6b] dark:border-[#015EB0]/30 rounded-xl px-4 py-3 hover:border-[#e31e24]/40 dark:hover:border-[#015EB0]/50 transition-all duration-300">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={params.enable_numpy_vectorization}
              onChange={(e) => handleChange('enable_numpy_vectorization', e.target.checked)}
              disabled={disabled}
              className="w-5 h-5 accent-[#e31e24] rounded focus:ring-2 focus:ring-[#e31e24] disabled:opacity-50"
            />
            <span className="text-sm font-bold text-[#191c1e] dark:text-white uppercase tracking-wide">Vectorización NumPy</span>
          </label>
        </div>
        <div className="flex items-center bg-[#f7f9fb] dark:bg-[#121212] border-2 border-[#926f6b] dark:border-[#015EB0]/30 rounded-xl px-4 py-3 hover:border-[#e31e24]/40 dark:hover:border-[#015EB0]/50 transition-all duration-300">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={params.enable_spatial_index}
              onChange={(e) => handleChange('enable_spatial_index', e.target.checked)}
              disabled={disabled}
              className="w-5 h-5 accent-[#e31e24] rounded focus:ring-2 focus:ring-[#e31e24] disabled:opacity-50"
            />
            <span className="text-sm font-bold text-[#191c1e] dark:text-white uppercase tracking-wide">Índice Espacial</span>
          </label>
        </div>
        <div className="flex items-center bg-[#f7f9fb] dark:bg-[#121212] border-2 border-[#926f6b] dark:border-[#015EB0]/30 rounded-xl px-4 py-3 hover:border-[#e31e24]/40 dark:hover:border-[#015EB0]/50 transition-all duration-300">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={params.enable_performance_timer}
              onChange={(e) => handleChange('enable_performance_timer', e.target.checked)}
              disabled={disabled}
              className="w-5 h-5 accent-[#e31e24] rounded focus:ring-2 focus:ring-[#e31e24] disabled:opacity-50"
            />
            <span className="text-sm font-bold text-[#191c1e] dark:text-white uppercase tracking-wide">Timer Rendimiento</span>
          </label>
        </div>
        <div className="flex items-center bg-[#f7f9fb] dark:bg-[#121212] border-2 border-[#926f6b] dark:border-[#015EB0]/30 rounded-xl px-4 py-3 hover:border-[#e31e24]/40 dark:hover:border-[#015EB0]/50 transition-all duration-300">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={params.enable_connectivity_validation}
              onChange={(e) => handleChange('enable_connectivity_validation', e.target.checked)}
              disabled={disabled}
              className="w-5 h-5 accent-[#e31e24] rounded focus:ring-2 focus:ring-[#e31e24] disabled:opacity-50"
            />
            <span className="text-sm font-bold text-[#191c1e] dark:text-white uppercase tracking-wide">Validación Conectividad</span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default GAParamsPresenter;
