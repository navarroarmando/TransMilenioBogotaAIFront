import type { GAParams, DistanceBiasRange } from '../../services/types/optimization.types';
import { Plus, Trash2 } from 'lucide-react';
import InfoTooltip from '../../components/ui/InfoTooltip';

interface GAParamsProps {
  params: GAParams;
  onChange: (params: GAParams) => void;
  disabled: boolean;
}

const GAParamsPresenter = ({ params, onChange, disabled }: GAParamsProps) => {
  const handleChange = (field: keyof GAParams, value: number | boolean) => {
    onChange({ ...params, [field]: value });
  };

  const handleDistanceBiasChange = (index: number, field: keyof DistanceBiasRange, value: number) => {
    const newDistanceBias = [...params.distance_bias_km];
    newDistanceBias[index] = { ...newDistanceBias[index], [field]: value };
    onChange({ ...params, distance_bias_km: newDistanceBias });
  };

  const addDistanceBiasRange = () => {
    const newRange: DistanceBiasRange = { min: 0, max: 10, weight: 1.0 };
    onChange({ ...params, distance_bias_km: [...params.distance_bias_km, newRange] });
  };

  const removeDistanceBiasRange = (index: number) => {
    const newDistanceBias = params.distance_bias_km.filter((_, i) => i !== index);
    onChange({ ...params, distance_bias_km: newDistanceBias });
  };

  return (
    <div className="bg-white dark:bg-[#1a1a2e] rounded-2xl shadow-xl p-6 border border-[#926f6b] dark:border-[#015EB0]/20 animate-slide-in">
      <h3 className="text-xl font-bold text-[#191c1e] dark:text-white mb-6 flex items-center gap-2">
        <span className="w-2 h-8 bg-[#e31e24] rounded-full"></span>
        Parámetros del Algoritmo Genético
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm text-[#191c1e] dark:text-white mb-2 tracking-wide flex items-center">Tamaño población<InfoTooltip content="Número de individuos en cada generación del algoritmo genético. Valores mayores aumentan la diversidad pero requieren más tiempo." /></label>
          <input
            type="number"
            value={params.population_size}
            onChange={(e) => handleChange('population_size', parseInt(e.target.value))}
            disabled={disabled}
            className="w-full px-4 py-3 border-2 border-[#926f6b] dark:border-[#015EB0]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#e31e24] focus:border-[#e31e24] disabled:opacity-50 bg-[#f7f9fb] dark:bg-[#121212] text-[#191c1e] dark:text-white font-semibold transition-all duration-300 hover:border-[#e31e24]/40 dark:hover:border-[#015EB0]/50"
          />
        </div>
        <div>
          <label className="block text-sm text-[#191c1e] dark:text-white mb-2 tracking-wide flex items-center">Generaciones<InfoTooltip content="Número de iteraciones del algoritmo genético. Más generaciones pueden mejorar la solución pero aumentan el tiempo de ejecución." /></label>
          <input
            type="number"
            value={params.generations}
            onChange={(e) => handleChange('generations', parseInt(e.target.value))}
            disabled={disabled}
            className="w-full px-4 py-3 border-2 border-[#926f6b] dark:border-[#015EB0]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#e31e24] focus:border-[#e31e24] disabled:opacity-50 bg-[#f7f9fb] dark:bg-[#121212] text-[#191c1e] dark:text-white font-semibold transition-all duration-300 hover:border-[#e31e24]/40 dark:hover:border-[#015EB0]/50"
          />
        </div>
        <div>
          <label className="block text-sm text-[#191c1e] dark:text-white mb-2 tracking-wide flex items-center">Tasa mutación<InfoTooltip content="Probabilidad de que un individuo sufra mutación aleatoria. Valores típicos: 0.01-0.2. Valores altos aumentan la exploración pero pueden perder buenas soluciones." /></label>
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
          <label className="block text-sm text-[#191c1e] dark:text-white mb-2 tracking-wide flex items-center">Tasa crossover<InfoTooltip content="Probabilidad de que dos padres se crucen para crear descendencia. Valores típicos: 0.7-0.9. Valores altos fomentan la explotación de buenas soluciones." /></label>
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
          <label className="block text-sm text-[#191c1e] dark:text-white mb-2 tracking-wide flex items-center">Elitismo<InfoTooltip content="Número de mejores individuos que se preservan sin cambios en la siguiente generación. Garantiza que las mejores soluciones no se pierdan." /></label>
          <input
            type="number"
            value={params.elitism_count}
            onChange={(e) => handleChange('elitism_count', parseInt(e.target.value))}
            disabled={disabled}
            className="w-full px-4 py-3 border-2 border-[#926f6b] dark:border-[#015EB0]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#e31e24] focus:border-[#e31e24] disabled:opacity-50 bg-[#f7f9fb] dark:bg-[#121212] text-[#191c1e] dark:text-white font-semibold transition-all duration-300 hover:border-[#e31e24]/40 dark:hover:border-[#015EB0]/50"
          />
        </div>
        <div>
          <label className="block text-sm text-[#191c1e] dark:text-white mb-2 tracking-wide flex items-center">Tamaño torneo<InfoTooltip content="Número de individuos que compiten en el torneo de selección. Valores mayores aumentan la presión de selección." /></label>
          <input
            type="number"
            value={params.tournament_size}
            onChange={(e) => handleChange('tournament_size', parseInt(e.target.value))}
            disabled={disabled}
            className="w-full px-4 py-3 border-2 border-[#926f6b] dark:border-[#015EB0]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#e31e24] focus:border-[#e31e24] disabled:opacity-50 bg-[#f7f9fb] dark:bg-[#121212] text-[#191c1e] dark:text-white font-semibold transition-all duration-300 hover:border-[#e31e24]/40 dark:hover:border-[#015EB0]/50"
          />
        </div>
        <div>
          <label className="block text-sm text-[#191c1e] dark:text-white mb-2 tracking-wide flex items-center">Longitud mínima ruta<InfoTooltip content="Número mínimo de paradas que debe tener una ruta generada. Valores bajos pueden crear rutas muy cortas e ineficientes." /></label>
          <input
            type="number"
            value={params.min_route_length}
            onChange={(e) => handleChange('min_route_length', parseInt(e.target.value))}
            disabled={disabled}
            className="w-full px-4 py-3 border-2 border-[#926f6b] dark:border-[#015EB0]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#e31e24] focus:border-[#e31e24] disabled:opacity-50 bg-[#f7f9fb] dark:bg-[#121212] text-[#191c1e] dark:text-white font-semibold transition-all duration-300 hover:border-[#e31e24]/40 dark:hover:border-[#015EB0]/50"
          />
        </div>
        <div>
          <label className="block text-sm text-[#191c1e] dark:text-white mb-2 tracking-wide flex items-center">Longitud máxima ruta<InfoTooltip content="Número máximo de paradas que puede tener una ruta generada. Valores altos pueden crear rutas muy largas e ineficientes." /></label>
          <input
            type="number"
            value={params.max_route_length}
            onChange={(e) => handleChange('max_route_length', parseInt(e.target.value))}
            disabled={disabled}
            className="w-full px-4 py-3 border-2 border-[#926f6b] dark:border-[#015EB0]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#e31e24] focus:border-[#e31e24] disabled:opacity-50 bg-[#f7f9fb] dark:bg-[#121212] text-[#191c1e] dark:text-white font-semibold transition-all duration-300 hover:border-[#e31e24]/40 dark:hover:border-[#015EB0]/50"
          />
        </div>
        <div className="md:col-span-2 lg:col-span-3">
          <label className="block text-sm text-[#191c1e] dark:text-white mb-2 tracking-wide flex items-center">Sesgo distancia (km)<InfoTooltip content="Rangos de distancia con pesos para preferir rutas de cierta longitud. Mayor peso = mayor preferencia para ese rango de distancia." /></label>
          <div className="space-y-3">
            {params.distance_bias_km.map((range, index) => (
              <div key={index} className="flex items-center gap-3 bg-[#f7f9fb] dark:bg-[#121212] p-3 rounded-xl border-2 border-[#926f6b] dark:border-[#015EB0]/30">
                <div className="flex-1">
                  <label className="block text-xs font-bold text-[#5d3f3c] dark:text-gray-400 mb-1">Min</label>
                  <input
                    type="number"
                    step="0.1"
                    value={range.min}
                    onChange={(e) => handleDistanceBiasChange(index, 'min', parseFloat(e.target.value))}
                    disabled={disabled}
                    className="w-full px-3 py-2 border border-[#926f6b] dark:border-[#015EB0]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e31e24] disabled:opacity-50 bg-white dark:bg-[#1a1a2e] text-[#191c1e] dark:text-white font-semibold"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-bold text-[#5d3f3c] dark:text-gray-400 mb-1">Max</label>
                  <input
                    type="number"
                    step="0.1"
                    value={range.max}
                    onChange={(e) => handleDistanceBiasChange(index, 'max', parseFloat(e.target.value))}
                    disabled={disabled}
                    className="w-full px-3 py-2 border border-[#926f6b] dark:border-[#015EB0]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e31e24] disabled:opacity-50 bg-white dark:bg-[#1a1a2e] text-[#191c1e] dark:text-white font-semibold"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-bold text-[#5d3f3c] dark:text-gray-400 mb-1">Peso</label>
                  <input
                    type="number"
                    step="0.1"
                    value={range.weight}
                    onChange={(e) => handleDistanceBiasChange(index, 'weight', parseFloat(e.target.value))}
                    disabled={disabled}
                    className="w-full px-3 py-2 border border-[#926f6b] dark:border-[#015EB0]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e31e24] disabled:opacity-50 bg-white dark:bg-[#1a1a2e] text-[#191c1e] dark:text-white font-semibold"
                  />
                </div>
                <button
                  onClick={() => removeDistanceBiasRange(index)}
                  disabled={disabled}
                  className="mt-5 p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg disabled:opacity-50 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
            <button
              onClick={addDistanceBiasRange}
              disabled={disabled}
              className="flex items-center gap-2 px-4 py-2 bg-[#3EA32A] text-white rounded-lg hover:bg-[#2E7A1F] disabled:opacity-50 transition-colors font-semibold"
            >
              <Plus className="w-4 h-4" />
              Agregar Rango
            </button>
          </div>
        </div>
        <div>
          <label className="block text-sm text-[#191c1e] dark:text-white mb-2 tracking-wide flex items-center">Tiempo máximo viaje (min)<InfoTooltip content="Tiempo máximo permitido para un viaje completo en el sistema de transporte. Rutas que excedan este tiempo serán penalizadas." /></label>
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
          <label className="block text-sm text-[#191c1e] dark:text-white mb-2 tracking-wide flex items-center">Capacidad bus<InfoTooltip content="Número máximo de pasajeros que puede transportar un bus simultáneamente. Afecta el cálculo de frecuencia y capacidad del sistema." /></label>
          <input
            type="number"
            value={params.bus_capacity}
            onChange={(e) => handleChange('bus_capacity', parseInt(e.target.value))}
            disabled={disabled}
            className="w-full px-4 py-3 border-2 border-[#926f6b] dark:border-[#015EB0]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#e31e24] focus:border-[#e31e24] disabled:opacity-50 bg-[#f7f9fb] dark:bg-[#121212] text-[#191c1e] dark:text-white font-semibold transition-all duration-300 hover:border-[#e31e24]/40 dark:hover:border-[#015EB0]/50"
          />
        </div>
        <div>
          <label className="block text-sm text-[#191c1e] dark:text-white mb-2 tracking-wide flex items-center">Intervalo checkpoint<InfoTooltip content="Número de generaciones entre cada punto de control para guardar el progreso. Valores menores guardan más frecuentemente pero usan más espacio." /></label>
          <input
            type="number"
            value={params.checkpoint_interval}
            onChange={(e) => handleChange('checkpoint_interval', parseInt(e.target.value))}
            disabled={disabled}
            className="w-full px-4 py-3 border-2 border-[#926f6b] dark:border-[#015EB0]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#e31e24] focus:border-[#e31e24] disabled:opacity-50 bg-[#f7f9fb] dark:bg-[#121212] text-[#191c1e] dark:text-white font-semibold transition-all duration-300 hover:border-[#e31e24]/40 dark:hover:border-[#015EB0]/50"
          />
        </div>
        <div>
          <label className="block text-sm text-[#191c1e] dark:text-white mb-2 tracking-wide flex items-center">Intervalo log<InfoTooltip content="Número de generaciones entre cada registro de progreso en los logs. Valores menores generan más logs detallados." /></label>
          <input
            type="number"
            value={params.log_interval}
            onChange={(e) => handleChange('log_interval', parseInt(e.target.value))}
            disabled={disabled}
            className="w-full px-4 py-3 border-2 border-[#926f6b] dark:border-[#015EB0]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#e31e24] focus:border-[#e31e24] disabled:opacity-50 bg-[#f7f9fb] dark:bg-[#121212] text-[#191c1e] dark:text-white font-semibold transition-all duration-300 hover:border-[#e31e24]/40 dark:hover:border-[#015EB0]/50"
          />
        </div>
        <div>
          <label className="block text-sm text-[#191c1e] dark:text-white mb-2 tracking-wide flex items-center">Ratio muestra demanda<InfoTooltip content="Proporción de datos de demanda a usar para el cálculo (0-1). 1.0 usa todos los datos, valores menores usan una muestra aleatoria para acelerar el cálculo." /></label>
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
          <label className="block text-sm text-[#191c1e] dark:text-white mb-2 tracking-wide flex items-center">Umbral filtro demanda<InfoTooltip content="Valor mínimo de demanda para incluir una parada en el cálculo. Paradas con demanda menor a este valor serán ignoradas." /></label>
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
          <label className="block text-sm text-[#191c1e] dark:text-white mb-2 tracking-wide flex items-center">Penalización conectividad<InfoTooltip content="Penalización aplicada a rutas que no están bien conectadas al resto del sistema. Valores mayores fomentan mejor conectividad." /></label>
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
            <span className="text-sm text-[#191c1e] dark:text-white tracking-wide">Habilitar Dijkstra<InfoTooltip content="Usa el algoritmo de Dijkstra para optimizar las rutas generadas. Mejora la calidad de las rutas pero aumenta el tiempo de cómputo." /></span>
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
            <span className="text-sm text-[#191c1e] dark:text-white tracking-wide">Vectorización NumPy<InfoTooltip content="Usa operaciones vectorizadas de NumPy para acelerar cálculos. Significativamente más rápido para grandes conjuntos de datos." /></span>
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
            <span className="text-sm text-[#191c1e] dark:text-white tracking-wide">Índice espacial<InfoTooltip content="Usa índices espaciales para acelerar búsquedas geográficas. Útil para grandes redes de transporte." /></span>
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
            <span className="text-sm text-[#191c1e] dark:text-white tracking-wide">Timer rendimiento<InfoTooltip content="Mide el tiempo de ejecución de cada componente del algoritmo. Útil para identificar cuellos de botella en el rendimiento." /></span>
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
            <span className="text-sm text-[#191c1e] dark:text-white tracking-wide">Validación conectividad<InfoTooltip content="Verifica que las rutas generadas estén conectadas correctamente. Rechaza rutas inválidas antes de evaluar su fitness." /></span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default GAParamsPresenter;
