import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import type { BusinessConfig } from '../../services/types/optimization.types';
import InfoTooltip from '../../components/ui/InfoTooltip';

interface BusinessParamsProps {
  params: BusinessConfig;
  onChange: (params: BusinessConfig) => void;
  disabled: boolean;
}

const BusinessParamsPresenter = ({ params, onChange, disabled }: BusinessParamsProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleChange = (field: keyof BusinessConfig, value: number) => {
    onChange({ ...params, [field]: value });
  };

  return (
    <div className="bg-white dark:bg-[#1a1a2e] rounded-2xl shadow-xl border border-[#926f6b] dark:border-[#015EB0]/20 animate-slide-in">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-[#f7f9fb] dark:hover:bg-[#121212] transition-colors rounded-t-2xl"
        disabled={disabled}
      >
        <div className="flex items-center gap-3">
          <span className="w-2 h-8 bg-[#e31e24] rounded-full"></span>
          <h3 className="text-xl font-bold text-[#191c1e] dark:text-white">
            Configuraciones Adicionales
          </h3>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-[#191c1e] dark:text-white" />
        ) : (
          <ChevronDown className="w-5 h-5 text-[#191c1e] dark:text-white" />
        )}
      </button>

      {isExpanded && (
        <div className="px-6 pb-6 pt-2">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Horarios Pico */}
            <div>
              <label className="block text-sm text-[#191c1e] dark:text-white mb-2 tracking-wide flex items-center">
                Inicio pico mañana<InfoTooltip content="Hora (formato 24h) de inicio del pico de demanda de la mañana. Período de mayor demanda matutina." />
              </label>
              <input
                type="number"
                value={params.morning_peak_start || 6}
                onChange={(e) => handleChange('morning_peak_start', Number(e.target.value))}
                disabled={disabled}
                className="w-full px-4 py-3 border-2 border-[#926f6b] dark:border-[#015EB0]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#e31e24] focus:border-[#e31e24] disabled:opacity-50 bg-[#f7f9fb] dark:bg-[#121212] text-[#191c1e] dark:text-white font-semibold transition-all duration-300 hover:border-[#e31e24]/40 dark:hover:border-[#015EB0]/50"
              />
            </div>
            <div>
              <label className="block text-sm text-[#191c1e] dark:text-white mb-2 tracking-wide flex items-center">
                Fin pico mañana<InfoTooltip content="Hora (formato 24h) de fin del pico de demanda de la mañana. Fin del período de mayor demanda matutina." />
              </label>
              <input
                type="number"
                value={params.morning_peak_end || 9}
                onChange={(e) => handleChange('morning_peak_end', Number(e.target.value))}
                disabled={disabled}
                className="w-full px-4 py-3 border-2 border-[#926f6b] dark:border-[#015EB0]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#e31e24] focus:border-[#e31e24] disabled:opacity-50 bg-[#f7f9fb] dark:bg-[#121212] text-[#191c1e] dark:text-white font-semibold transition-all duration-300 hover:border-[#e31e24]/40 dark:hover:border-[#015EB0]/50"
              />
            </div>
            <div>
              <label className="block text-sm text-[#191c1e] dark:text-white mb-2 tracking-wide flex items-center">
                Inicio pico tarde<InfoTooltip content="Hora (formato 24h) de inicio del pico de demanda de la tarde. Período de mayor demanda vespertina." />
              </label>
              <input
                type="number"
                value={params.afternoon_peak_start || 17}
                onChange={(e) => handleChange('afternoon_peak_start', Number(e.target.value))}
                disabled={disabled}
                className="w-full px-4 py-3 border-2 border-[#926f6b] dark:border-[#015EB0]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#e31e24] focus:border-[#e31e24] disabled:opacity-50 bg-[#f7f9fb] dark:bg-[#121212] text-[#191c1e] dark:text-white font-semibold transition-all duration-300 hover:border-[#e31e24]/40 dark:hover:border-[#015EB0]/50"
              />
            </div>
            <div>
              <label className="block text-sm text-[#191c1e] dark:text-white mb-2 tracking-wide flex items-center">
                Fin pico tarde<InfoTooltip content="Hora (formato 24h) de fin del pico de demanda de la tarde. Fin del período de mayor demanda vespertina." />
              </label>
              <input
                type="number"
                value={params.afternoon_peak_end || 20}
                onChange={(e) => handleChange('afternoon_peak_end', Number(e.target.value))}
                disabled={disabled}
                className="w-full px-4 py-3 border-2 border-[#926f6b] dark:border-[#015EB0]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#e31e24] focus:border-[#e31e24] disabled:opacity-50 bg-[#f7f9fb] dark:bg-[#121212] text-[#191c1e] dark:text-white font-semibold transition-all duration-300 hover:border-[#e31e24]/40 dark:hover:border-[#015EB0]/50"
              />
            </div>

            {/* Velocidades por Tipo de Vía */}
            <div>
              <label className="block text-sm text-[#191c1e] dark:text-white mb-2 tracking-wide flex items-center">
                Velocidad urbana (km/h)<InfoTooltip content="Velocidad promedio en vías urbanas. Afecta el cálculo de tiempos de viaje en zonas urbanas." />
              </label>
              <input
                type="number"
                value={params.urban_default_speed || 30}
                onChange={(e) => handleChange('urban_default_speed', Number(e.target.value))}
                disabled={disabled}
                className="w-full px-4 py-3 border-2 border-[#926f6b] dark:border-[#015EB0]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#e31e24] focus:border-[#e31e24] disabled:opacity-50 bg-[#f7f9fb] dark:bg-[#121212] text-[#191c1e] dark:text-white font-semibold transition-all duration-300 hover:border-[#e31e24]/40 dark:hover:border-[#015EB0]/50"
              />
            </div>
            <div>
              <label className="block text-sm text-[#191c1e] dark:text-white mb-2 tracking-wide flex items-center">
                Velocidad autopista (km/h)<InfoTooltip content="Velocidad promedio en autopistas y carreteras principales. Afecta el cálculo de tiempos de viaje en vías rápidas." />
              </label>
              <input
                type="number"
                value={params.highway_default_speed || 60}
                onChange={(e) => handleChange('highway_default_speed', Number(e.target.value))}
                disabled={disabled}
                className="w-full px-4 py-3 border-2 border-[#926f6b] dark:border-[#015EB0]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#e31e24] focus:border-[#e31e24] disabled:opacity-50 bg-[#f7f9fb] dark:bg-[#121212] text-[#191c1e] dark:text-white font-semibold transition-all duration-300 hover:border-[#e31e24]/40 dark:hover:border-[#015EB0]/50"
              />
            </div>
            <div>
              <label className="block text-sm text-[#191c1e] dark:text-white mb-2 tracking-wide flex items-center">
                Velocidad troncal (km/h)<InfoTooltip content="Velocidad promedio en vías troncales del sistema TransMilenio. Afecta tiempos en carriles exclusivos." />
              </label>
              <input
                type="number"
                value={params.trunk_default_speed || 50}
                onChange={(e) => handleChange('trunk_default_speed', Number(e.target.value))}
                disabled={disabled}
                className="w-full px-4 py-3 border-2 border-[#926f6b] dark:border-[#015EB0]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#e31e24] focus:border-[#e31e24] disabled:opacity-50 bg-[#f7f9fb] dark:bg-[#121212] text-[#191c1e] dark:text-white font-semibold transition-all duration-300 hover:border-[#e31e24]/40 dark:hover:border-[#015EB0]/50"
              />
            </div>
            <div>
              <label className="block text-sm text-[#191c1e] dark:text-white mb-2 tracking-wide flex items-center">
                Velocidad residencial (km/h)<InfoTooltip content="Velocidad promedio en zonas residenciales. Afecta el cálculo de tiempos de viaje en barrios residenciales." />
              </label>
              <input
                type="number"
                value={params.residential_default_speed || 20}
                onChange={(e) => handleChange('residential_default_speed', Number(e.target.value))}
                disabled={disabled}
                className="w-full px-4 py-3 border-2 border-[#926f6b] dark:border-[#015EB0]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#e31e24] focus:border-[#e31e24] disabled:opacity-50 bg-[#f7f9fb] dark:bg-[#121212] text-[#191c1e] dark:text-white font-semibold transition-all duration-300 hover:border-[#e31e24]/40 dark:hover:border-[#015EB0]/50"
              />
            </div>
            <div>
              <label className="block text-sm text-[#191c1e] dark:text-white mb-2 tracking-wide flex items-center">
                Velocidad máxima (km/h)<InfoTooltip content="Velocidad máxima permitida en cualquier vía. Límite superior para cálculos de tiempo de viaje." />
              </label>
              <input
                type="number"
                value={params.max_speed || 80}
                onChange={(e) => handleChange('max_speed', Number(e.target.value))}
                disabled={disabled}
                className="w-full px-4 py-3 border-2 border-[#926f6b] dark:border-[#015EB0]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#e31e24] focus:border-[#e31e24] disabled:opacity-50 bg-[#f7f9fb] dark:bg-[#121212] text-[#191c1e] dark:text-white font-semibold transition-all duration-300 hover:border-[#e31e24]/40 dark:hover:border-[#015EB0]/50"
              />
            </div>

            {/* Límites */}
            <div>
              <label className="block text-sm text-[#191c1e] dark:text-white mb-2 tracking-wide flex items-center">
                Mínimo paradas<InfoTooltip content="Número mínimo de paradas que debe tener una ruta. Rutas con menos paradas serán rechazadas." />
              </label>
              <input
                type="number"
                value={params.min_stops || 2}
                onChange={(e) => handleChange('min_stops', Number(e.target.value))}
                disabled={disabled}
                className="w-full px-4 py-3 border-2 border-[#926f6b] dark:border-[#015EB0]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#e31e24] focus:border-[#e31e24] disabled:opacity-50 bg-[#f7f9fb] dark:bg-[#121212] text-[#191c1e] dark:text-white font-semibold transition-all duration-300 hover:border-[#e31e24]/40 dark:hover:border-[#015EB0]/50"
              />
            </div>
            <div>
              <label className="block text-sm text-[#191c1e] dark:text-white mb-2 tracking-wide flex items-center">
                Máximo paradas<InfoTooltip content="Número máximo de paradas que puede tener una ruta. Rutas con más paradas serán rechazadas." />
              </label>
              <input
                type="number"
                value={params.max_stops || 50}
                onChange={(e) => handleChange('max_stops', Number(e.target.value))}
                disabled={disabled}
                className="w-full px-4 py-3 border-2 border-[#926f6b] dark:border-[#015EB0]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#e31e24] focus:border-[#e31e24] disabled:opacity-50 bg-[#f7f9fb] dark:bg-[#121212] text-[#191c1e] dark:text-white font-semibold transition-all duration-300 hover:border-[#e31e24]/40 dark:hover:border-[#015EB0]/50"
              />
            </div>
            <div>
              <label className="block text-sm text-[#191c1e] dark:text-white mb-2 tracking-wide flex items-center">
                Distancia mínima (km)<InfoTooltip content="Distancia mínima en kilómetros que debe tener una ruta. Rutas más cortas serán rechazadas." />
              </label>
              <input
                type="number"
                value={params.min_distance || 2}
                onChange={(e) => handleChange('min_distance', Number(e.target.value))}
                disabled={disabled}
                className="w-full px-4 py-3 border-2 border-[#926f6b] dark:border-[#015EB0]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#e31e24] focus:border-[#e31e24] disabled:opacity-50 bg-[#f7f9fb] dark:bg-[#121212] text-[#191c1e] dark:text-white font-semibold transition-all duration-300 hover:border-[#e31e24]/40 dark:hover:border-[#015EB0]/50"
              />
            </div>
            <div>
              <label className="block text-sm text-[#191c1e] dark:text-white mb-2 tracking-wide flex items-center">
                Distancia máxima (km)<InfoTooltip content="Distancia máxima en kilómetros que puede tener una ruta. Rutas más largas serán rechazadas." />
              </label>
              <input
                type="number"
                value={params.max_distance || 50}
                onChange={(e) => handleChange('max_distance', Number(e.target.value))}
                disabled={disabled}
                className="w-full px-4 py-3 border-2 border-[#926f6b] dark:border-[#015EB0]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#e31e24] focus:border-[#e31e24] disabled:opacity-50 bg-[#f7f9fb] dark:bg-[#121212] text-[#191c1e] dark:text-white font-semibold transition-all duration-300 hover:border-[#e31e24]/40 dark:hover:border-[#015EB0]/50"
              />
            </div>

            {/* Cobertura */}
            <div>
              <label className="block text-sm text-[#191c1e] dark:text-white mb-2 tracking-wide flex items-center">
                Radio cobertura parada (m)<InfoTooltip content="Radio en metros alrededor de cada parada para calcular cobertura. Usuarios dentro de este radio se consideran cubiertos." />
              </label>
              <input
                type="number"
                value={params.coverage_stop_radius || 500}
                onChange={(e) => handleChange('coverage_stop_radius', Number(e.target.value))}
                disabled={disabled}
                className="w-full px-4 py-3 border-2 border-[#926f6b] dark:border-[#015EB0]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#e31e24] focus:border-[#e31e24] disabled:opacity-50 bg-[#f7f9fb] dark:bg-[#121212] text-[#191c1e] dark:text-white font-semibold transition-all duration-300 hover:border-[#e31e24]/40 dark:hover:border-[#015EB0]/50"
              />
            </div>
            <div>
              <label className="block text-sm text-[#191c1e] dark:text-white mb-2 tracking-wide flex items-center">
                Objetivo cobertura (%)<InfoTooltip content="Porcentaje objetivo de demanda que debe ser cubierta por el sistema. Valores altos priorizan máxima cobertura." />
              </label>
              <input
                type="number"
                value={params.coverage_target || 95}
                onChange={(e) => handleChange('coverage_target', Number(e.target.value))}
                disabled={disabled}
                className="w-full px-4 py-3 border-2 border-[#926f6b] dark:border-[#015EB0]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#e31e24] focus:border-[#e31e24] disabled:opacity-50 bg-[#f7f9fb] dark:bg-[#121212] text-[#191c1e] dark:text-white font-semibold transition-all duration-300 hover:border-[#e31e24]/40 dark:hover:border-[#015EB0]/50"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BusinessParamsPresenter;
